/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig(({ mode }) => ({
  plugins: [
    angular({
      jit: true,
      tsconfig: 'tsconfig.app.json',
      inlineStylesExtension: ['scss'],
    }),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: ['es2020'],
    rollupOptions: {
      input: {
        main: './src/index.html',
      },
      onwarn(warning, defaultHandler) {
        if (warning.code === 'PLUGIN_WARNING') {
          return;
        }
        defaultHandler?.(warning);
      },
    },
  },
  server: {
    port: 4200,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4200,
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{spec,test}.ts'],
    exclude: ['node_modules', 'dist', '**/*.module.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/**/*.module.ts',
        'src/main.ts',
        'src/index.html',
        'src/styles.scss',
      ],
    },
  },
  define: {
    'import.meta.env': process.env,
  },
}));

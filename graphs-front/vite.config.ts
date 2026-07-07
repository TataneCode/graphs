/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  plugins: [
    tsconfigPaths({
      projects: ['src'],
      ignoreConfigErrors: true,
    }),
    angular({
      jit: true,
      tsconfig: 'tsconfig.app.json',
      inlineStylesExtension: ['scss'],
    }),
  ],
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
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
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
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  define: {
    'import.meta.env': process.env,
  },
}));

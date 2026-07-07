import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API info', () => {
      expect(appController.getHello()).toBe('Graphs API - Flower Series Benchmarking');
    });
  });

  describe('health check', () => {
    it('should return health status', () => {
      const result = appController.healthCheck();
      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('API info', () => {
    it('should return API metadata', () => {
      const result = appController.getApiInfo();
      expect(result.name).toBe('Graphs API');
      expect(result.version).toBe('1.0.0');
      expect(result.endpoints).toBeDefined();
    });
  });
});

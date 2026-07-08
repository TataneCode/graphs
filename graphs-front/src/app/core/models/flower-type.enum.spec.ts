import { FlowerType, FLOWER_TYPES, flowerTypeLabels } from './flower-type.enum';

describe('FlowerType Enum', () => {
  it('should have 10 flower types', () => {
    expect(FLOWER_TYPES.length).toBe(10);
  });

  it('should have labels for all flower types', () => {
    FLOWER_TYPES.forEach((type) => {
      expect(flowerTypeLabels[type]).toBeDefined();
    });
  });

  it('should have unique labels', () => {
    const labels = Object.values(flowerTypeLabels);
    const uniqueLabels = new Set(labels);
    expect(labels.length).toBe(uniqueLabels.size);
  });
});

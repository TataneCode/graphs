import { FlowerType } from '@prisma/client';

export { FlowerType };

export interface Serie {
  id: number;
  type: FlowerType;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SerieWithPoints extends Serie {
  points?: Array<{
    id: number;
    creationDate: Date;
    value: number;
    quality: string;
  }>;
}

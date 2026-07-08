import { Quality } from '@prisma/client';

export { Quality };

export class PointResponseDto {
  id: number;
  serieId: number;
  creationDate: string;
  value: number;
  quality: Quality;

  constructor(data: Partial<PointResponseDto>) {
    Object.assign(this, data);
  }
}

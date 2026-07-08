import { Quality } from '@prisma/client';

export { Quality };

export interface Point {
  id: number;
  serieId: number;
  creationDate: Date;
  value: number;
  quality: Quality;
}

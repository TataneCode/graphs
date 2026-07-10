import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { SeriesModule } from '@/series/series.module';
import { PointsModule } from '@/points/points.module';
import { SeedModule } from '@/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    SeriesModule,
    PointsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

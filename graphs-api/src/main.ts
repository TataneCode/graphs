import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Graphs API')
    .setDescription('Benchmarking graphs API for flower series and points')
    .setVersion('1.0.0')
    .addTag('series', 'Operations for managing flower series')
    .addTag('points', 'Operations for managing data points')
    .addTag('seed', 'Operations for seeding test data')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();

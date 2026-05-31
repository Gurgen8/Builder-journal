import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: '*', // Allow all origins for dev simplicity, can narrow down in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Auto-transform payloads to DTO instances
      whitelist: true, // Strip non-DTO properties
      forbidNonWhitelisted: false, // Don't crash on extra properties, just ignore
      transformOptions: {
        enableImplicitConversion: true, // Automatically converts query params to numbers/booleans if matching types
      },
    }),
  );

  // Enable global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(`🚀 Construction Work Log API is running on: http://localhost:${port}/api`);
  logger.log(`=======================================================`);
}

bootstrap();

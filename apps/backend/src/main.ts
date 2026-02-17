import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // allow FE in local/dev
    credentials: true, //
  });
  await app.listen(3001); // ensure port differs from FE if needed
}

bootstrap();

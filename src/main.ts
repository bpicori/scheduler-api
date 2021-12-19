import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from './services/config.service';

async function bootstrap() {
  if (process.env.NODE_ENV === 'test') {
    process.on('message', async () => {
      process.exit(0);
    });
  }
  const config = new ConfigService();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('Scheduler')
    .setDescription('Scheduler API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.httpPort);
}

bootstrap().catch((err) => {
  process.exit(1);
});

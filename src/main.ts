import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from './services/config.service';

async function bootstrap() {
  /*
    // TODO check if is a better way
    Add a process event listener to exits if the env is test.
    This is when running the e2e tests when the app is spawned by another process and after the tests are finished, the backend should be killed.
   */
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

// TODO check if is correct
bootstrap().catch(() => {
  process.exit(1);
});

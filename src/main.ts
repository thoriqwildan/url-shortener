import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('URL Shortener')
    .setDescription('API Documentation for URL Shortener')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, doc);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

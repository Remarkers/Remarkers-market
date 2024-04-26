import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('DOT-721 NFT Marketplace API')
    .setDescription('The DOT-721 NFT Marketplace API description')
    .setVersion('1.0')
    .addGlobalParameters({
      name: 'Authorization',
      in: 'header',
      required: false,
      example: 'Bearer $token',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

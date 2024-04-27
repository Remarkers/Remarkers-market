import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Config } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Config>);

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

  await app.listen(configService.get('port'));
}
bootstrap();

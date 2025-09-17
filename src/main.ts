import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import morgan from 'morgan';
import { CORS } from './constants';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //logs con morgan
  app.use(morgan('dev'));

  //configuracion inicial para manejar dto con class validator
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const configService = app.get(ConfigService);

  app.enableCors(CORS);

  //todas las rutas arrancan con /api
  app.setGlobalPrefix('api');

  await app.listen(configService.get('PORT') || 8000);
  console.log(`Application running on: ${await app.getUrl()}`);
}
void bootstrap();

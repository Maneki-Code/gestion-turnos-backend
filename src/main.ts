import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  console.log(`📣 SERVICIO CORRIENDO EN PUERTO: ${configService.get('app.port')}`);
  await app.listen(configService.get('app.port') ?? 3000);
}
bootstrap();

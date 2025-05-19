import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

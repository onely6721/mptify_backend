import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => callback(null, origin),
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    maxAge: 86400, // 24 hours
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(8000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

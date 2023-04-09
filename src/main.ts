import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
declare const module: any;
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';
import { JwtStrategy } from './common/auth-strategies/jwt-strategy';
import { Repositories } from './models/db.repositories';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => callback(null, origin),
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    maxAge: 86400, // 24 hours
    credentials: true,
  });
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  app.use(passport.initialize());
  passport.use(new JwtStrategy(configService, app.get(Repositories)));
  console.log(configService.get('AWS_ACCESS_KEY_ID'));
  console.log(configService.get('AWS_SECRET_ACCESS_KEY'));
  config.update({
    credentials: {
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    },
    region: configService.get('AWS_REGION'),
  });

  await app.listen(8000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

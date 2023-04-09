import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from '../../common/auth-strategies/google-strategy';
import { JwtStrategy } from '../../common/auth-strategies/jwt-strategy';

@Module({
  imports: [HttpModule, PassportModule.register({ defaultStrategy: 'google' })],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  exports: [],
})
export class AuthModule {}

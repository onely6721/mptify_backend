import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from '../../common/guards/GoogleOauthGuard';
import { Response } from 'express';
import { LoginBodyDto, RegisterBodyDto } from './dto/auth.dto';
import { GoogleStrategy } from '../../common/auth-strategies/google-strategy';
import { Repositories } from '../../models/db.repositories';
import { CurrentUser } from '../../common/decorators/auth/current-user';
import { JwtAuthGuard } from '../../common/guards/JwtAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly repositories: Repositories,
    private readonly googleStrategy: GoogleStrategy,
  ) {}

  @Get('google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async loginWithGoogle() {
    const url = await this.googleStrategy.getAuthorizationUrl();
    return { url };
  }

  @Post('login')
  async login(@Body() body: LoginBodyDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body.email, body.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user) {
    return user;
  }

  @Get('google-callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const token = await this.authService.loginWithGoogle(
      user.email,
      user.firstName,
    );
    res.cookie('auth-token', token, { httpOnly: true, secure: true });
    return res.redirect('http://localhost:3000');
  }
}

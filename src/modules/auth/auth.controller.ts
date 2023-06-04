import {
  Body,
  Controller,
  Get,
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
import { ConfigService } from '@nestjs/config';
import { HttpStatusCode } from 'axios';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly repositories: Repositories,
    private readonly googleStrategy: GoogleStrategy,
  ) {}

  @Get('google')
  async loginWithGoogle() {
    const url = await this.googleStrategy.getAuthorizationUrl();
    return { url };
  }

  @Post('login')
  async login(@Body() body: LoginBodyDto, @Res() res: Response) {
    const token = await this.authService.login(body.email, body.password);
    res.cookie('auth-token', token, { httpOnly: true, secure: true });
    res.send(HttpStatusCode.Ok);
  }

  @Post('register')
  async register(@Body() body: RegisterBodyDto, @Res() res: Response) {
    const token = await this.authService.register(
      body.email,
      body.firstName,
      body.password,
    );
    res.cookie('auth-token', token, { httpOnly: true, secure: true });
    res.send(HttpStatusCode.Ok);
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
    return res.redirect(this.configService.get('CLIENT_URL'));
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user, @Res() res: Response) {
    res.cookie('auth-token', null, { httpOnly: true, secure: true });
    return res.sendStatus(HttpStatusCode.Ok);
  }

  @Post('create-artist')
  @UseGuards(JwtAuthGuard)
  async createArtist(@CurrentUser() user, @Body() body) {
    return this.repositories.user.create(body);
  }
}

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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async loginGoogle() {}

  @Post('login')
  async login(@Body() body: LoginBodyDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body.email, body.password);
  }

  @Get('google-callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const token = user.accessToken;
    res.cookie('auth-token', token, { httpOnly: true, secure: true });
    return res.redirect('http://localhost:3000');
  }
}

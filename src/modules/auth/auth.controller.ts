import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from '../../guards/GoogleOauthGuard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('')
  async test() {
    return await this.authService.registerUser({
      email: 'email',
      firstName: 'name',
      passwordHash: 'passwordHash',
    });
  }
  @Get(':id')
  async testId(@Param('id') id: string) {
    return await this.authService.findUserById(id);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async auth() {}

  @Get('google-callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const user = req.user;
    const token = user.accessToken;
    res.cookie('token', token, { httpOnly: true, secure: true });
    return res.redirect('http://localhost:3000');
  }
}

import { Controller, Get, Req, Res } from '@nestjs/common';
import axios from 'axios';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly CLIENT_ID =
    '537618677754-1k5gsc5vntt2b208dqivklo6d9m8s2pa.apps.googleusercontent.com';
  private readonly CLIENT_SECRET = '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';
  private readonly REDIRECT_URI = 'http://localhost:8000/callback';

  @Get()
  test(@Res() res) {
    return 'Hello world';
  }

  @Get('login')
  login(@Res() res) {
    const scopes = encodeURIComponent(
      'https://www.googleapis.com/auth/sdm.service',
    );
    res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${this.CLIENT_ID}&redirect_uri=${this.REDIRECT_URI}&scope=profile&access_type=offline`,
    );
  }

  @Get('callback')
  async callback(@Req() req, @Res() res) {
    const { code } = req.query;

    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
      redirect_uri: this.REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    console.log(data);
    const accessToken = data.access_token;
    console.log(accessToken);

    // здесь можно использовать accessToken для обращения к Google Nest API
    res.redirect('/success');
  }
}

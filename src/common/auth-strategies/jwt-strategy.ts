import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repositories } from '../../models/db.repositories';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(Repositories) private readonly repositories: Repositories,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.Authorization;
        },
        (req) => {
          if (req?.headers?.authorization?.split(' ')[0] === 'Bearer') {
            return req?.headers?.authorization?.split(' ')[1];
          } else {
            return null;
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.repositories.user.findById(payload.sub);
    return user;
  }
}

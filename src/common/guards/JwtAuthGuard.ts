import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const authToken = request.cookies['auth-token'];

    if (authHeader) {
      // Authorization header takes precedence over cookie
      request.headers.authorization = `Bearer ${authHeader.split(' ')[1]}`;
    } else if (authToken) {
      // Set authorization header to use token from cookie
      request.headers.authorization = `Bearer ${authToken}`;
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}

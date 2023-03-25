import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repositories } from '../../models/db.repositories';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly repositories: Repositories,
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  async signIn(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userExists = await this.findUserByEmail(user.email);

    if (!userExists) {
      return this.registerUser(user);
    }

    return this.generateJwt({
      sub: userExists.id,
      email: userExists.email,
    });
  }

  async registerUser(user) {
    try {
      return await this.repositories.user.create(user);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async findUserById(id) {
    return await this.repositories.user.findById(id);
  }

  async findUserByEmail(email) {
    const user = await this.repositories.user.findOne({ email });

    if (!user) {
      return null;
    }

    return user;
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repositories } from '../../models/db.repositories';
import * as bcrypt from 'bcryptjs';
import { User } from '../../models/user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly repositories: Repositories,
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  async register(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.repositories.user.create({
      email: username,
      firstName: username,
      passwordHash: hashedPassword,
    });
  }

  async login(username: string, password: string): Promise<string> {
    // Find the user by username
    const user = await this.repositories.user.findOne({ email: username });

    // If the user is not found, throw an error
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare the provided password with the stored password hash
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    // If the password doesn't match, throw an error
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate a JWT token with the user ID as the payload
    const payload = { sub: user.id };
    const token = this.generateJwt(payload);

    // Return the token as the response
    return token;
  }
}

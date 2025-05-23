import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repositories } from '../../models/db.repositories';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly repositories: Repositories,
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  async register(email: string, username: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);

    const candidate = await this.repositories.user.findOne({
      email: email,
    });

    if (candidate) throw new BadRequestException('User with that email exists');

    const user = await this.repositories.user.create({
      email: email,
      firstName: username,
      artistName: username,
      passwordHash: passwordHash,
    });

    const payload = { sub: user.id };

    const token = this.generateJwt(payload);

    // Return the token as the response
    return token;
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

  async loginWithGoogle(email: string, firstName: string): Promise<string> {
    const user = await this.repositories.user.findOne({ email });
    let payload;
    if (!user) {
      const randomPassword = '22'; // will change later
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      const createdUser = await this.repositories.user.create({
        passwordHash: hashedPassword,
        email: email,
        firstName: firstName,
      });
      payload = { sub: createdUser.id };
    } else {
      payload = { sub: user.id };
    }

    const token = this.generateJwt(payload);
    return token;
  }
}

import { Injectable } from '@nestjs/common';
import { UserRepository } from './user/user.repository';

@Injectable()
export class Repositories {
  constructor(readonly user: UserRepository) {
    user.setRoot(this);
  }
}

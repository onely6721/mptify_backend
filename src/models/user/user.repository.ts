import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../abstract/base.repository';
import { T_UserDocument, User } from './user.schema';

@Injectable()
export class UserRepository extends BaseRepository<User, T_UserDocument> {
  constructor(
    @InjectModel(User.name)
    protected readonly Model: PaginateModel<T_UserDocument>,
  ) {
    super();
  }
}

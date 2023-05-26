import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../abstract/base.repository';
import { Listen, T_ListenDocument } from './listen.schema';

@Injectable()
export class ListenRepository extends BaseRepository<Listen, T_ListenDocument> {
  constructor(
    @InjectModel(Listen.name)
    protected readonly Model: PaginateModel<T_ListenDocument>,
  ) {
    super();
  }
}

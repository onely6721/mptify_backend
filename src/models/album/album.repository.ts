import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Album, T_AlbumDocument } from './album.schema';
import { BaseRepository } from '../abstract/base.repository';

@Injectable()
export class AlbumRepository extends BaseRepository<Album, T_AlbumDocument> {
  constructor(
    @InjectModel(Album.name)
    protected readonly Model: PaginateModel<T_AlbumDocument>,
  ) {
    super();
  }
}

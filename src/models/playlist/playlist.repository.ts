import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../abstract/base.repository';
import { Playlist, T_PlaylistDocument } from './playlist.schema';

@Injectable()
export class PlaylistRepository extends BaseRepository<
  Playlist,
  T_PlaylistDocument
> {
  constructor(
    @InjectModel(Playlist.name)
    protected readonly Model: PaginateModel<T_PlaylistDocument>,
  ) {
    super();
  }
}

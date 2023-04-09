import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../abstract/base.repository';
import { T_TrackDocument, Track } from './track.schema';

@Injectable()
export class TrackRepository extends BaseRepository<Track, T_TrackDocument> {
  constructor(
    @InjectModel(Track.name)
    protected readonly Model: PaginateModel<T_TrackDocument>,
  ) {
    super();
  }
}

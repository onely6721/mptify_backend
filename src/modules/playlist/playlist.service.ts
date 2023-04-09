import { Injectable } from '@nestjs/common';
import { Repositories } from '../../models/db.repositories';

@Injectable()
export class PlaylistService {
  constructor(private readonly repositories: Repositories) {}
}

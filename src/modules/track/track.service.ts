import { Injectable } from '@nestjs/common';
import { Repositories } from '../../models/db.repositories';
import { FilesService } from '../../providers/file-storage/file-storage.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly repositories: Repositories,
    private readonly filesService: FilesService,
  ) {}

  async saveTrackCover(id: string, buffer: Buffer, filename: string) {
    const cover = await this.filesService.uploadPublicFile(buffer, filename);
    return await this.repositories.track.updateById(id, {
      cover: cover.url,
    });
  }

  async saveTrackAudio(id: string, buffer: Buffer, filename: string) {
    const audio = await this.filesService.uploadPublicFile(buffer, filename);
    return await this.repositories.track.updateById(id, {
      audio: audio.url,
    });
  }
}

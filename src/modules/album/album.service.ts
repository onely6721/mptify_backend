import { Injectable } from '@nestjs/common';
import { Repositories } from '../../models/db.repositories';
import { FilesService } from '../../providers/file-storage/file-storage.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly repositories: Repositories,
    private readonly filesService: FilesService,
  ) {}

  async saveAlbumCover(id: string, buffer: Buffer, filename: string) {
    const cover = await this.filesService.uploadPublicFile(buffer, filename);
    return await this.repositories.album.updateById(id, {
      cover: cover.url,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { Repositories } from '../../models/db.repositories';
import { FilesService } from '../../providers/file-storage/file-storage.service';

@Injectable()
export class UserService {
  constructor(
    private readonly repositories: Repositories,
    private readonly filesService: FilesService,
  ) {}

  async saveAvatar(id: string, buffer: Buffer, filename: string) {
    const avatar = await this.filesService.uploadPublicFile(buffer, filename);
    return await this.repositories.user.updateById(id, {
      avatar: avatar.url,
    });
  }
}

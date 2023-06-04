import { IsDefined, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsDefined()
  @IsString()
  title!: string;

  @IsDefined()
  @IsString()
  trackIds!: string[];
}

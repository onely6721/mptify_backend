import { IsDefined, IsString } from 'class-validator';

export class CreatePlaylistDto {
  @IsDefined()
  @IsString()
  title!: string;
}

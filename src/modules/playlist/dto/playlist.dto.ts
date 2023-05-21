import { IsDefined, IsOptional, IsString } from 'class-validator';

export class CreatePlaylistDto {
  @IsOptional()
  @IsString()
  title?: string;
}

export class UpdatePlaylistDto {
  @IsDefined()
  @IsString()
  title!: string;
}

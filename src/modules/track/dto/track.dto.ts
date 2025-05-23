import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTrackBodyDto {
  @IsDefined()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  subArtistsIds?: string[];
}

export class TracksSearchQueryDto {
  @IsDefined()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  genre?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 6;
}

import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ArtistsSearchQueryDto {
  @IsDefined()
  @IsString()
  keyword!: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 6;
}

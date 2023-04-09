import { IsDefined, IsNumber, IsString } from 'class-validator';

export class CreateTrackBodyDto {
  @IsDefined()
  @IsString()
  title!: string;

  @IsDefined()
  @IsString()
  artist!: string;
}

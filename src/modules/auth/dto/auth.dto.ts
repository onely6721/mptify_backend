import { IsDefined, IsString } from 'class-validator';

export class LoginBodyDto {
  @IsDefined()
  @IsString()
  email!: string;

  @IsDefined()
  @IsString()
  password!: string;
}

export class RegisterBodyDto {
  @IsDefined()
  @IsString()
  email!: string;

  @IsDefined()
  @IsString()
  password!: string;
}

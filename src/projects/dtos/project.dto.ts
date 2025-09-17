/*
    -----DECORADORES DE CLASS VALIDATOR-----
    @IsNotEmpty() -> valida que el campo no este vacio
    @IsEmail() -> valida que el campo sea un email
    @MinLength() -> valida que el campo tenga un minimo de caracteres
    @MaxLength() -> valida que el campo tenga un maximo de caracteres

    @IsString() -> valida que el campo sea un string
    @IsNumber() -> valida que el campo sea un number
    @IsEnum() -> valida que el campo sea un enum

*/

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}

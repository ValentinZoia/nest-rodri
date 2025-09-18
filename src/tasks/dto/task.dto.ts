import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { STATUS_TASK } from 'src/constants/status-task';
import { CreateProjectDto } from 'src/projects/dtos/project.dto';
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
export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  taskName: string;

  @IsNotEmpty()
  @IsString()
  taskDescription: string;

  @IsNotEmpty()
  @IsEnum(STATUS_TASK)
  taskStatus: STATUS_TASK;

  @IsNotEmpty()
  @IsString()
  responsableName: string;

  @IsOptional()
  project?: CreateProjectDto;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  taskName: string;

  @IsOptional()
  @IsString()
  taskDescription: string;
  @IsOptional()
  @IsEnum(STATUS_TASK)
  taskStatus: STATUS_TASK;

  @IsOptional()
  @IsString()
  responsableName: string;

  @IsOptional()
  project?: CreateProjectDto;
}

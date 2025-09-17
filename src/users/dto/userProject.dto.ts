import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ACCESS_LEVEL } from 'src/constants/roles';
import { UserEntity } from '../entities/users.entity';
import { ProjectEntity } from 'src/projects/entities/project.entity';

export class CreateUserProjectDto {
  @IsNotEmpty()
  @IsEnum(ACCESS_LEVEL)
  accessLevel: ACCESS_LEVEL;

  @IsNotEmpty()
  @IsUUID()
  user: UserEntity;

  @IsNotEmpty()
  @IsUUID()
  project: ProjectEntity;
}

export class UpdateUserProjectDto {
  @IsOptional()
  @IsEnum(ACCESS_LEVEL)
  accessLevel: ACCESS_LEVEL;

  @IsOptional()
  @IsUUID()
  user: UserEntity;

  @IsOptional()
  @IsUUID()
  project: ProjectEntity;
}

import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../config/base.entity';
import { ACCESS_LEVEL } from '../../constants/roles';
import { UserEntity } from './users.entity';
import { ProjectEntity } from '../../projects/entities/project.entity';

@Entity({ name: 'users_projects' })
export class UsersProjectsEntity extends BaseEntity {
  @Column({ type: 'enum', enum: ACCESS_LEVEL, default: ACCESS_LEVEL.MANTEINER })
  accessLevel: ACCESS_LEVEL;

  //Crear relacion con otra tabla
  @ManyToOne(() => UserEntity, (user) => user.projectsInclude)
  user: UserEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.usersIncludes)
  project: ProjectEntity;
}

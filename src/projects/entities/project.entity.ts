import { TaskEntity } from '../../tasks/entities/task.entity';
import { BaseEntity } from '../../config/base.entity';
import { IProject } from '../../interfaces/project.interface';
import { UsersProjectsEntity } from '../../users/entities/usersProjects.entity';
import { Column, Entity, OneToMany } from 'typeorm';

//decorador de typeorm, le sirve para mapear la clase
// a una tabla de base de datos.
//@Entity le dice a typeorm que esta clase representa
// una tabla. con nombre 'projects'
@Entity({ name: 'projects' })
export class ProjectEntity extends BaseEntity implements IProject {
  //@Column le indica que esta propiedad es una columna dentro
  // de la tabla.
  @Column()
  name: string;

  @Column()
  description: string;

  //Relacion
  @OneToMany(() => UsersProjectsEntity, (userProjects) => userProjects.project)
  usersIncludes: UsersProjectsEntity[];

  // se lee un projecto a muchas tareas
  @OneToMany(() => TaskEntity, (task) => task.project)
  tasks: TaskEntity[];
}

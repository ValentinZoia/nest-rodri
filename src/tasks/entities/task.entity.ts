import { BaseEntity } from '../../config/base.entity';
import { STATUS_TASK } from '../../constants/status-task';
import { ProjectEntity } from '../../projects/entities/project.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'tasks' })
export class TaskEntity extends BaseEntity {
  @Column()
  taskName: string;

  @Column()
  taskDescription: string;

  @Column({ type: 'enum', enum: STATUS_TASK })
  taskStatus: STATUS_TASK;

  @Column()
  responsableName: string;

  //Relacion - se lee Muchas tareas a un projecto
  @ManyToOne(() => ProjectEntity, (project) => project.tasks)
  project: ProjectEntity;
}

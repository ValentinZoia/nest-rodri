import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { ProjectEntity } from 'src/projects/entities/project.entity';
import { ProjectsService } from 'src/projects/services/projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, ProjectEntity])],
  providers: [TasksService, ProjectsService],
  controllers: [TasksController],
})
export class TasksModule {}

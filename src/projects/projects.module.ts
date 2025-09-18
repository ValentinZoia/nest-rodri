import { Module } from '@nestjs/common';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import { ProjectEntity } from './entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { UsersProjectsEntity } from 'src/users/entities/usersProjects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, UsersProjectsEntity])],
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersService],
})
export class ProjectsModule {}

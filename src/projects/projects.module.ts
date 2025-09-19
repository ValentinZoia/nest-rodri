import { Module } from '@nestjs/common';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import { ProjectEntity } from './entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { UsersProjectsEntity } from 'src/users/entities/usersProjects.entity';
import { ProvidersModule } from 'src/providers/providers.module';
import { HttpCustomService } from 'src/providers/http/http.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity, UsersProjectsEntity]),
    ProvidersModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersService, HttpCustomService],
})
export class ProjectsModule {}

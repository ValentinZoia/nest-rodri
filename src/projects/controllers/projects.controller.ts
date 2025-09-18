import { ProjectsService } from '../services/projects.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from '../dtos/project.dto';
import { AccessLevelGuard } from 'src/auth/guards/access-level.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessLevel } from 'src/auth/decorators/access-level.decorator';

import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('projects')
@UseGuards(AuthGuard, RolesGuard, AccessLevelGuard) //controlar quien tiene acceso a los endpoints
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAllProjects() {
    return await this.projectsService.findAllProjects();
  }

  @AccessLevel(50) //todas las personas que tengan un nivel de acceso  igual a 50 pueden acceder
  @Get(':projectId')
  async findProjectById(@Param('projectId') id: string) {
    return await this.projectsService.findProjectById(id);
  }

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return await this.projectsService.createProject(createProjectDto);
  }

  @AccessLevel(50) //todas las personas que tengan un nivel de acceso  igual a 50 pueden acceder
  @Put(':projectId')
  async updateProject(
    @Param('projectId') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const result = await this.projectsService.updateProject(
      id,
      updateProjectDto,
    );
    return {
      message: 'Project updated successfully',
      result,
    };
  }

  @Delete(':projectId')
  async deleteProject(@Param('projectId') id: string) {
    const result = await this.projectsService.deleteProject(id);
    return {
      message: 'Project deleted successfully',
      result,
    };
  }
}

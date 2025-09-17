import { ProjectsService } from '../services/projects.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProjectDto, UpdateProjectDto } from '../dtos/project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @Get()
  async findAllProjects() {
    return await this.projectsService.findAllProjects();
  }

  @Get(':id')
  async findProjectById(@Param('id') id: string) {
    return await this.projectsService.findProjectById(id);
  }

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return await this.projectsService.createProject(createProjectDto);
  }

  @Put(':id')
  async updateProject(
    @Param('id') id: string,
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

  @Delete(':id')
  async deleteProject(@Param('id') id: string) {
    const result = await this.projectsService.deleteProject(id);
    return {
      message: 'Project deleted successfully',
      result,
    };
  }
}

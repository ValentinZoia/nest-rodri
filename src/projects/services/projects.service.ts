import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from '../entities/project.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ErrorManager } from 'src/utils/error.manager';
import { CreateProjectDto, UpdateProjectDto } from '../dtos/project.dto';
import { UsersProjectsEntity } from 'src/users/entities/usersProjects.entity';
import { UsersService } from 'src/users/services/users.service';
import { ACCESS_LEVEL } from 'src/constants/roles';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,

    @InjectRepository(UsersProjectsEntity)
    private readonly userProjectRepository: Repository<UsersProjectsEntity>,
    private readonly usersService: UsersService,
    // private readonly httpService: HttpCustomService
  ) {}

  async findAllProjects(): Promise<ProjectEntity[]> {
    try {
      return await this.projectRepository.find();
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findProjectById(id: string): Promise<ProjectEntity> {
    try {
      const project = await this.projectRepository
        .createQueryBuilder('project')
        .where({ id })
        .leftJoinAndSelect('project.usersIncludes', 'usersIncludes') //incluir la relación en la respuesta
        .leftJoinAndSelect('usersIncludes.user', 'user') //dentro de la relacion projectInclude, tambien incluir la relacion user
        .getOne();

      if (!project) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Project not found',
        });
      }
      return project;
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async createProject(project: CreateProjectDto, userId: string): Promise<any> {
    try {
      const user = await this.usersService.findUserById(userId);
      const savedProject = await this.projectRepository.save(project);
      return await this.userProjectRepository.save({
        accessLevel: ACCESS_LEVEL.OWNER,
        user: user,
        project: savedProject,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  // public async listApi() {
  //   return this.httpService.apiFindAll();
  // }

  async updateProject(
    id: string,
    project: UpdateProjectDto,
  ): Promise<UpdateResult> {
    try {
      const updatedProject = await this.projectRepository.update(id, project);
      if (updatedProject.affected === 0)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Project to Update not found',
        });
      return updatedProject;
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async deleteProject(id: string): Promise<DeleteResult> {
    try {
      const deletedProject = await this.projectRepository.delete(id);
      if (deletedProject.affected === 0)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Project to Delete not found',
        });
      return deletedProject;
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}

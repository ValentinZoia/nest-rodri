import { Injectable } from '@nestjs/common';
import { TaskEntity } from '../entities/task.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async findAllTasks(): Promise<TaskEntity[]> {
    try {
      return await this.taskRepository.find();
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findTaskById(id: string): Promise<TaskEntity> {
    try {
      const task = await this.taskRepository
        .createQueryBuilder('task')
        .where({ id })
        .leftJoinAndSelect('task.projectsInclude', 'projectsInclude') //incluir la relación en la respuesta
        .leftJoinAndSelect('projectsInclude.project', 'project') //dentro de la relacion projectInclude, tambien incluir la relacion projecto
        .getOne();

      if (!task) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Task not found',
        });
      }
      return task;
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  //   async findTaskBy({
  //     key,
  //     value,
  //   }: {
  //     key: keyof CreateTaskDto;
  //     value: any;
  //   }): Promise<TaskEntity | null> {
  //     try {
  //       const task = await this.taskRepository
  //         .createQueryBuilder('task')
  //         .addSelect('task.password')
  //         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //         .where({ [key]: value })

  //         .getOne();

  //       return task;
  //     } catch (error) {
  //       // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
  //       throw ErrorManager.createSignatureError(error.message);
  //     }
  //   }

  async createTask(task: CreateTaskDto): Promise<TaskEntity> {
    try {
      //  Guardar
      return await this.taskRepository.save(task);
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async updateTask(id: string, task: UpdateTaskDto): Promise<UpdateResult> {
    try {
      const updatedTask = await this.taskRepository.update(id, task);
      if (updatedTask.affected === 0)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Task to Update not found',
        });
      return updatedTask;
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    try {
      const deletedTask = await this.taskRepository.delete(id);
      if (deletedTask.affected === 0)
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Task to Delete not found',
        });
      return deletedTask;
    } catch (error) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/only-throw-error
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}

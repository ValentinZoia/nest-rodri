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
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { AccessLevelGuard } from 'src/auth/guards/access-level.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AccessLevel } from 'src/auth/decorators/access-level.decorator';

@Controller('tasks')
@UseGuards(AuthGuard, RolesGuard, AccessLevelGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAllTasks() {
    return await this.tasksService.findAllTasks();
  }

  @Get(':id')
  async findTaskById(@Param('id') id: string) {
    return await this.tasksService.findTaskById(id);
  }

  @AccessLevel('DEVELOPER')
  @Post('create/:projectId')
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Param('projectId') projectId: string,
  ) {
    return await this.tasksService.createTask(createTaskDto, projectId);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const result = await this.tasksService.updateTask(id, updateTaskDto);
    return {
      message: 'Task updated successfully',
      result,
    };
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    const result = await this.tasksService.deleteTask(id);
    return {
      message: 'Task deleted successfully',
      result,
    };
  }
}

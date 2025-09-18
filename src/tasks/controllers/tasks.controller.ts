import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';

@Controller('tasks')
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

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.createTask(createTaskDto);
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

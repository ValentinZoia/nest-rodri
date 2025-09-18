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
import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { CreateUserProjectDto } from '../dto/userProject.dto';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('ADMIN') //solo los admins pueden acceder
  @Get()
  async findAllUsers() {
    return await this.usersService.findAllUsers();
  }

  @PublicAccess() //decorador custom - permite acceder a la ruta sin token
  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return await this.usersService.findUserById(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.usersService.updateUser(id, updateUserDto);
    return {
      message: 'User updated successfully',
      result,
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const result = await this.usersService.deleteUser(id);
    return {
      message: 'User deleted successfully',
      result,
    };
  }

  //User Projects Relation
  @Post('add-to-project')
  public async userInProject(
    @Body() createUserProjectDto: CreateUserProjectDto,
  ) {
    return await this.usersService.relationToProject(createUserProjectDto);
  }
}

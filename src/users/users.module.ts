import { Module } from '@nestjs/common';

import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { UsersProjectsEntity } from './entities/usersProjects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UsersProjectsEntity])], //features de typeorm modules
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

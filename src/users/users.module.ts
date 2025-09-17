import { Module } from '@nestjs/common';

import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { UsersProjectsEntity } from './entities/usersProjects.entity';
import { BcryptAdapter } from 'src/utils/bcrypt.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UsersProjectsEntity])], //features de typeorm modules
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'HashFunction',
      // eslint-disable-next-line @typescript-eslint/unbound-method
      useValue: BcryptAdapter.hash,
    },
  ],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}

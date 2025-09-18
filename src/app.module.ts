import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data-source';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`, // => ".develop.env"
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(DataSourceConfig), //instanciar typeorm module
    UsersModule,
    ProjectsModule,
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}

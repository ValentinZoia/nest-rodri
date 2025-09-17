// import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
// import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// Cargar variables de entorno
const env = process.env.NODE_ENV || 'develop';
config({ path: `.${env}.env` });

export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'valenzo',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'valenzodb',
  entities: [path.join(__dirname + '/../**/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname + '/../migrations/*{.ts,.js}')],
  synchronize: false,
  migrationsRun: true,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
};
console.log(DataSourceConfig.migrations);
const AppDataSource = new DataSource(DataSourceConfig);

export default AppDataSource;

// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { DataSource, DataSourceOptions } from 'typeorm';
// import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// ConfigModule.forRoot({
//   envFilePath: `.${process.env.NODE_ENV}.env`,
// });

// const configService = new ConfigService();

// export const DataSourceConfig: DataSourceOptions = {
//   type: 'postgres',
//   host: configService.get('DB_HOST'),
//   port: configService.get('DB_PORT'),
//   username: configService.get('DB_USER'),
//   password: configService.get('DB_PASSWORD'),
//   database: configService.get('DB_NAME'),
//   entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
//   migrations: [__dirname + '/../migrations/*{.ts,.js}'],
//   synchronize: true,
//   migrationsRun: true,
//   logging: false,
//   namingStrategy: new SnakeNamingStrategy(),
// };
// console.log(DataSourceConfig.entities);
// console.log(DataSourceConfig.migrations);
// console.log(DataSourceConfig.host);
// console.log(DataSourceConfig.username);
// export const AppDS = new DataSource(DataSourceConfig);

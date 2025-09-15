import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
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
  entities: [__dirname + '../**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '../../migrations/*{.ts,.js}'],
  synchronize: true,
  migrationsRun: true,
  // logging: false,
  namingStrategy: new SnakeNamingStrategy(),
};

const AppDataSource = new DataSource(DataSourceConfig);

export default AppDataSource;

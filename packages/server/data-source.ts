import { DataSource } from 'typeorm';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();
console.log('Entities Path:', path.join(__dirname, '../**/**/*.entity.{js,ts}'));
export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
	entities: [path.resolve(__dirname, '../server/src/**/*.entity.{js,ts}')],
	migrations: [path.resolve(__dirname, '../server/src/migrations/*.{js,ts}')],
  synchronize: false,
});
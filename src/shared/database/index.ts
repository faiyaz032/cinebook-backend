import { DataSource } from 'typeorm';
import logger from '../logger/LoggerManager';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'cine_book',
  entities: ['src/**/*.entity{.ts,.js}', 'dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: false,
});

(async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected successfully');
  } catch (error: any) {
    logger.error(error.message);
    throw error;
  }
})();

export default AppDataSource;

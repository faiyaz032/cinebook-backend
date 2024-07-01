import { DataSource } from 'typeorm';
import logger from '../logger/LoggerManager';

class DatabaseManager {
  async createConnection(host: string, port: number, username: string, password: string, database: string) {
    try {
      const postgresDataSource = new DataSource({
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        synchronize: true,
      });

      await postgresDataSource.initialize();

      logger.info('Database connected successfully');
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  }
}

export default DatabaseManager;

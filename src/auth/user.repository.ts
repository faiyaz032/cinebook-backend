import { StatusCodes } from 'http-status-codes';
import AppDataSource from '../shared/database';
import CustomError from '../shared/error-handling/CustomError';
import logger from '../shared/logger/LoggerManager';
import { User } from './user.entity';

class UserRepository {
  private repository;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  createUser = async (user: User) => {
    try {
      const entity = Object.assign(new User(), user);
      return this.repository.save(entity);
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while creating user');
    }
  };

  getUserByEmail = async (email: string) => {
    try {
      const user = await this.repository.findOne({ where: { email } });
      return user;
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while getting user by email');
    }
  };
}

export default UserRepository;

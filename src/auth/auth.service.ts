import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../shared/error-handling/CustomError';
import logger from '../shared/logger/LoggerManager';
import { UserLoginDto } from './auth.schema';
import { User } from './user.entity';
import UserRepository from './user.repository';

class AuthService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async createUser(user: User) {
    try {
      const userExists = await this.repository.getUserByEmail(user.email);

      if (userExists) {
        throw new CustomError(StatusCodes.CONFLICT, 'User already exists with this email');
      }
      const newUser = await this.repository.createUser(user);
      return newUser;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  }

  login = async (loginData: UserLoginDto) => {
    try {
      const user = await this.repository.getUserByEmail(loginData.email);
      if (!user) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'User not found with the given email');
      }

      const isValidPassword = await bcrypt.compare(loginData.password, user.password);
      if (!isValidPassword) {
        throw new CustomError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
      }

      return user;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };
}

export default AuthService;

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../../shared/logger/LoggerManager';
import sendResponse from '../../shared/utils/sendResponse';
import signJwt from '../../shared/utils/signJwt';
import AuthService from './auth.service';

class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  registerHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.createUser(req.body);

      const token = signJwt({ id: data.id, email: data.email, role: data.role });

      sendResponse(res, StatusCodes.CREATED, 'User created successfully', { token });
    } catch (error) {
      next(error);
    }
  };

  loginHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.login(req.body);

      const token = signJwt({ id: data.id, email: data.email, role: data.role });

      sendResponse(res, StatusCodes.OK, 'User logged in successfully', { token });
    } catch (error: any) {
      logger.error(error.message);
      next(error);
    }
  };
}

export default AuthController;

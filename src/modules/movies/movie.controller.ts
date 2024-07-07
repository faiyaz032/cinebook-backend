import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../shared/utils/sendResponse';
import MovieService from './movie.service';

class MovieController {
  private service;
  constructor() {
    this.service = new MovieService();
  }

  createMovieHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.createMovie(req.body);

      sendResponse(res, StatusCodes.CREATED, 'Movie created successfully', data);
    } catch (error) {
      next(error);
    }
  };
}

export default MovieController;

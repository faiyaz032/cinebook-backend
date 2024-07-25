import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import qs from 'qs';
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

  //?search=action&filters[duration]=2h&filters[nowShowing]=true&sort=name:asc&page=2&limit=10
  getMoviesHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { search, sort, page, limit } = req.query;
    // Parse filters using qs library
    const filters = qs.parse(req.query.filters as string);

    try {
      const result = await this.service.getAllMovies({
        search: search as string,
        filters,
        sort: sort as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      sendResponse(res, StatusCodes.OK, 'All movies fetched successfully', result.data, result.pagination);
    } catch (error) {
      next(error);
    }
  };
}

export default MovieController;

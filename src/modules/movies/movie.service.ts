import { StatusCodes } from 'http-status-codes';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import { Movie } from './movie.entity';
import MovieRepository from './movie.repository';
import { UidDto, UpdateMovieDto } from './movie.schema';
import { Options } from './movie.types';

class MovieService {
  private repository;
  constructor() {
    this.repository = new MovieRepository();
  }

  createMovie = async (data: Movie) => {
    try {
      const movie = await this.repository.createMovie(data);
      return movie;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };

  getAllMovies = async (options: Options) => {
    try {
      const data = await this.repository.getAllMovies(options);
      return data;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };

  getMovieById = async (id: UidDto) => {
    try {
      const data = await this.repository.getMovieById(id);
      if (!data) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'No movie found with given id');
      }
      return data;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };

  updateMovie = async (id: UidDto, updatedMovieData: UpdateMovieDto) => {
    try {
      const data = await this.repository.updateMovie(id, updatedMovieData);
      if (!data) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'No movie found to update');
      }
      return data;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };

  deleteMovie = async (id: UidDto) => {
    try {
      const result = await this.repository.deleteMovie(id);
      if (!result.affected) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'No movie found to delete');
      }
      return result;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };
}

export default MovieService;

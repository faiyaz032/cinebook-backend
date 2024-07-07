import { StatusCodes } from 'http-status-codes';
import AppDataSource from '../../shared/database';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import { Movie } from './movie.entity';
import { UpdateMovieDto } from './movie.schema';

class MovieRepository {
  private repository;

  constructor() {
    this.repository = AppDataSource.getRepository(Movie);
  }

  createMovie = async (data: Movie) => {
    try {
      const entity = Object.assign(new Movie(), data);
      return this.repository.save(entity);
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while creating movie');
    }
  };

  getAllMovies = async () => {
    try {
      const movies = await this.repository.find();
      return movies;
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while getting all movies');
    }
  };

  getMovieById = async (id: string) => {
    try {
      return this.repository.findOne({ where: { id } });
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while getting movie by id');
    }
  };

  updateMovie = async (id: string, data: UpdateMovieDto) => {
    try {
      return this.repository.update({ id }, data);
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while updating movie');
    }
  };

  deleteMovie = async (id: string) => {
    try {
      return this.repository.delete({ id });
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while deleting movie');
    }
  };
}

export default MovieRepository;

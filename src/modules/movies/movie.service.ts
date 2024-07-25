import logger from '../../shared/logger/LoggerManager';
import { Movie } from './movie.entity';
import MovieRepository from './movie.repository';
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
}

export default MovieService;

import logger from '../../shared/logger/LoggerManager';
import { Movie } from './movie.entity';
import MovieRepository from './movie.repository';

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
}

export default MovieService;

import { StatusCodes } from 'http-status-codes';
import AppDataSource from '../../shared/database';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import getPaginationData from '../../shared/utils/getPaginationData';
import { Movie } from './movie.entity';
import { UidDto, UpdateMovieDto } from './movie.schema';
import { Options } from './movie.types';

class MovieRepository {
  private repository;
  private entity;

  constructor() {
    this.repository = AppDataSource.getRepository(Movie);
    this.entity = Movie;
  }

  createMovie = async (data: Movie) => {
    try {
      const payload = Object.assign(new this.entity(), data);
      return this.repository.save(payload);
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while creating movie');
    }
  };
  //?search=action&filters[duration]=2h&filters[nowShowing]=true&sort=name:asc&page=2&limit=10
  getAllMovies = async (options: Options) => {
    // Destructure options with default values
    const { search, filters, sort, page = 1, limit = 10 } = options;

    // Create the query builder
    let query = this.repository.createQueryBuilder('movie');

    // Handle search
    if (search) {
      query = query.where('movie.name LIKE :search OR movie.description LIKE :search', { search: `%${search}%` });
    }

    // Handle filters
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (value === 'true' || value === 'false') {
          query = query.andWhere(`movie.${key} = :${key}`, { [key]: value === 'true' });
        } else if (!isNaN(value)) {
          query = query.andWhere(`movie.${key} = :${key}`, { [key]: parseFloat(value) });
        } else {
          query = query.andWhere(`movie.${key} LIKE :${key}`, { [key]: `%${value}%` });
        }
      });
    }

    // Handle sorting
    if (sort) {
      const [sortField, sortOrder] = sort.split(':');
      query = query.orderBy(`movie.${sortField}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');
    }

    // Handle pagination
    const take = limit;
    const skip = (page - 1) * take;
    query = query.take(take).skip(skip);

    // Execute the query
    try {
      const [movies, totalItems] = await query.getManyAndCount();

      const pagination = getPaginationData(page, totalItems, take);

      return {
        data: movies,
        pagination,
      };
    } catch (error: any) {
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, `Error retrieving movies: ${error.message}`);
    }
  };

  getMovieById = async (id: UidDto) => {
    try {
      return this.repository.findOne({ where: { id } });
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while getting movie by id');
    }
  };

  updateMovie = async (id: string, payload: UpdateMovieDto) => {
    try {
      const updatedRow = await this.repository
        .createQueryBuilder()
        .update(this.entity, payload)
        .where('id = :id', { id: id })
        .returning('*')
        .updateEntity(true)
        .execute();

      return updatedRow.raw[0];
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

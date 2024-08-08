import { StatusCodes } from 'http-status-codes';
import { Raw } from 'typeorm';
import AppDataSource from '../../shared/database';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import getPaginationData from '../../shared/utils/getPaginationData';
import { Show } from './show.entity';
import { IdDto } from './show.schema';
import { Options } from './show.types';

class ShowRepository {
  private repository;
  private entity;

  constructor() {
    this.entity = Show;
    this.repository = AppDataSource.getRepository(this.entity);
  }

  createShow = async (data: Show) => {
    try {
      const payload = Object.assign(new this.entity(), data);
      return this.repository.save(payload);
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while creating show');
    }
  };
  //?search=action&filters[duration]=2h&filters[nowShowing]=true&sort=name:asc&page=2&limit=10
  getAllShows = async (options: Options) => {
    const { search, filters, sort, page = 1, limit = 10 } = options;

    // Prepare the where clause
    let where: any = {};

    // Handle movie name search/filter with case insensitivity
    if (search) {
      where = {
        ...where,
        movie: {
          name: Raw((alias) => `LOWER(${alias}) ILIKE LOWER(:search)`, { search: `%${search}%` }),
        },
      };
    }

    // Handle other filters
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (value === 'true' || value === 'false') {
          where = {
            ...where,
            [key]: value === 'true',
          };
        } else if (!isNaN(value)) {
          where = {
            ...where,
            [key]: parseFloat(value),
          };
        } else {
          where = {
            ...where,
            [key]: Raw((alias) => `LOWER(${alias}) ILIKE LOWER(:${key})`, { [key]: `%${value}%` }),
          };
        }
      });
    }

    // Handle sorting
    let order: any = {};
    if (sort) {
      const [sortField, sortOrder] = sort.split(':');
      order[sortField] = sortOrder.toUpperCase() as 'ASC' | 'DESC';
    }

    // Handle pagination
    const take = limit;
    const skip = (page - 1) * take;

    // Execute the query with relations
    try {
      const [shows, totalItems] = await this.repository.findAndCount({
        where,
        relations: ['hall', 'movie'],
        order,
        take,
        skip,
      });

      const pagination = getPaginationData(page, totalItems, take);

      return {
        data: shows,
        pagination,
      };
    } catch (error: any) {
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, `Error retrieving shows: ${error.message}`);
    }
  };

  getShowById = async (id: IdDto) => {
    try {
      return this.repository.findOne({ where: { id }, relations: ['hall', 'movie'] });
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while getting show by id');
    }
  };

  updateShow = async (id: IdDto, payload: Partial<Show>) => {
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
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while updating show');
    }
  };

  deleteShow = async (id: IdDto) => {
    try {
      return this.repository.delete({ id });
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while deleting show');
    }
  };
}

export default ShowRepository;

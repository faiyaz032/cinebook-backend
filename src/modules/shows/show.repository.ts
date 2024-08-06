import { StatusCodes } from 'http-status-codes';
import AppDataSource from '../../shared/database';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import getPaginationData from '../../shared/utils/getPaginationData';
import { Show } from './show.entity';
import { IdDto } from './show.schema';

export type Options = {
  search?: string;
  filters?: Record<string, any>;
  sort?: string;
  page?: number;
  limit?: number;
};

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
    // Destructure options with default values
    const { search, filters, sort, page = 1, limit = 10 } = options;

    // Create the query builder
    let query = this.repository.createQueryBuilder('show');

    // Handle search
    if (search) {
      query = query.where('show.id LIKE :search', { search: `%${search}%` });
    }

    // Handle filters
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (value === 'true' || value === 'false') {
          query = query.andWhere(`show.${key} = :${key}`, { [key]: value === 'true' });
        } else if (!isNaN(value)) {
          query = query.andWhere(`show.${key} = :${key}`, { [key]: parseFloat(value) });
        } else {
          query = query.andWhere(`show.${key} LIKE :${key}`, { [key]: `%${value}%` });
        }
      });
    }

    // Handle sorting
    if (sort) {
      const [sortField, sortOrder] = sort.split(':');
      query = query.orderBy(`show.${sortField}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');
    }

    // Handle pagination
    const take = limit;
    const skip = (page - 1) * take;
    query = query.take(take).skip(skip);

    // Execute the query
    try {
      const [shows, totalItems] = await query.getManyAndCount();

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
      return this.repository.findOne({ where: { id } });
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

import { StatusCodes } from 'http-status-codes';
import AppDataSource from '../../shared/database';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import getPaginationData from '../../shared/utils/getPaginationData';
import { Hall } from './hall.entity';
import { Options } from './hall.types';
import { HallIdDto, UpdateHallDto } from './hall.schema';

class HallRepository {
  private repository;
  private entity;

  constructor() {
    this.repository = AppDataSource.getRepository(Hall);
    this.entity = Hall;
  }

  createHall = async (data: Hall) => {
    try {
      const payload = Object.assign(new this.entity(), data);
      return this.repository.save(payload);
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while creating hall');
    }
  };
  //?search=action&filters[duration]=2h&filters[nowShowing]=true&sort=name:asc&page=2&limit=10
  getAllHalls = async (options: Options) => {
    // Destructure options with default values
    const { search, filters, sort, page = 1, limit = 10 } = options;

    // Create the query builder
    let query = this.repository.createQueryBuilder('hall');

    // Handle search
    if (search) {
      query = query.where('hall.capacity LIKE :search', { search: `%${search}%` });
    }

    // Handle filters
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (value === 'true' || value === 'false') {
          query = query.andWhere(`hall.${key} = :${key}`, { [key]: value === 'true' });
        } else if (!isNaN(value)) {
          query = query.andWhere(`hall.${key} = :${key}`, { [key]: parseFloat(value) });
        } else {
          query = query.andWhere(`hall.${key} LIKE :${key}`, { [key]: `%${value}%` });
        }
      });
    }

    // Handle sorting
    if (sort) {
      const [sortField, sortOrder] = sort.split(':');
      query = query.orderBy(`hall.${sortField}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');
    }

    // Handle pagination
    const take = limit;
    const skip = (page - 1) * take;
    query = query.take(take).skip(skip);

    // Execute the query
    try {
      const [halls, totalItems] = await query.getManyAndCount();

      const pagination = getPaginationData(page, totalItems, take);

      return {
        data: halls,
        pagination,
      };
    } catch (error: any) {
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, `Error retrieving halls: ${error.message}`);
    }
  };

  getHallById = async (id: HallIdDto) => {
    try {
      return this.repository.findOne({ where: { id } });
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while getting hall by id');
    }
  };

  updateHall = async (id: HallIdDto, payload: UpdateHallDto) => {
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
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while updating hall');
    }
  };

  deleteHall = async (id: HallIdDto) => {
    try {
      return this.repository.delete({ id });
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while deleting hall');
    }
  };
}

export default HallRepository;

import { StatusCodes } from 'http-status-codes';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import { Show } from './show.entity';
import ShowRepository from './show.repository';
import { IdDto } from './show.schema';
import { Options } from './show.types';

class ShowService {
  private repository;

  constructor() {
    this.repository = new ShowRepository();
  }

  createShow = async (data: Show) => {
    try {
      const movie = await this.repository.createShow(data);
      return movie;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };

  getAllShows = async (options: Options) => {
    try {
      const data = await this.repository.getAllShows(options);
      return data;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };

  getShowById = async (id: IdDto) => {
    try {
      const data = await this.repository.getShowById(id);
      if (!data) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'No show found with given id');
      }
      return data;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };

  updateShow = async (id: IdDto, updatedShowData: Partial<Show>) => {
    try {
      const data = await this.repository.updateShow(id, updatedShowData);
      if (!data) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'No show found to update');
      }
      return data;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };

  deleteShow = async (id: IdDto) => {
    try {
      const result = await this.repository.deleteShow(id);
      if (!result.affected) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'No show found to delete');
      }
      return result;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };
}

export default ShowService;

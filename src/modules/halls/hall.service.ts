import { StatusCodes } from 'http-status-codes';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import { Hall } from './hall.entity';
import HallRepository from './hall.repository';
import { HallIdDto, UpdateHallDto } from './hall.schema';
import { Options } from './hall.types';
import SeatService from './seat.service';

class HallService {
  private repository;
  private seatService;

  constructor() {
    this.repository = new HallRepository();
    this.seatService = new SeatService();
  }

  createHall = async (payload: Hall) => {
    try {
      const data = await this.repository.createHall(payload);
      await this.seatService.createSeats(data);
      return data;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };

  getAllHalls = async (options: Options) => {
    try {
      const data = await this.repository.getAllHalls(options);
      return data;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };

  getHallById = async (id: HallIdDto) => {
    try {
      const data = await this.repository.getHallById(id);
      if (!data) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'No hall found with given id');
      }
      return data;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };

  updateHall = async (id: HallIdDto, updatedPayload: UpdateHallDto) => {
    try {
      const data = await this.repository.updateHall(id, updatedPayload);
      if (!data) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'No hall found to update');
      }
      return data;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };

  deleteHall = async (id: HallIdDto) => {
    try {
      const result = await this.repository.deleteHall(id);
      if (!result.affected) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'No hall found to delete');
      }
      return result;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };
}

export default HallService;

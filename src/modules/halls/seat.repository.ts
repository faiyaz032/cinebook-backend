import { StatusCodes } from 'http-status-codes';
import AppDataSource from '../../shared/database';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import { Seat } from './seat.entity';
import { ISeat } from './seat.types';

class SeatRepository {
  private repository;

  constructor() {
    this.repository = AppDataSource.getRepository(Seat);
  }

  createSeats = async (seatsPayload: Partial<ISeat>[]) => {
    try {
      const seats = seatsPayload.map((payload) => Object.assign(new Seat(), payload));
      return await this.repository.save(seats);
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while creating seats');
    }
  };
}

export default SeatRepository;

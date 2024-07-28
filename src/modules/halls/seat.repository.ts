import { StatusCodes } from 'http-status-codes';
import AppDataSource from '../../shared/database';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import { HallIdDto } from './hall.schema';
import { Seat } from './seat.entity';
import { SeatIdDto } from './seat.schema';

class SeatRepository {
  private repository;
  private entity;

  constructor() {
    this.entity = Seat;
    this.repository = AppDataSource.getRepository(this.entity);
  }

  createSeats = async (seatsPayload: Partial<Seat>[]) => {
    try {
      const seats = seatsPayload.map((payload) => Object.assign(new this.entity(), payload));
      return await this.repository.save(seats);
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while creating seats');
    }
  };

  getSeatsByHallId = async (hallId: HallIdDto) => {
    return await this.repository
      .createQueryBuilder('seat')
      .select(['seat.id', 'seat.seat_type', 'seat.seat_number', 'seat.status', 'seat.price'])
      .where('seat.hallId = :hallId', { hallId })
      .orderBy("LENGTH(regexp_replace(seat.seat_number, '\\d', '', 'g'))") // Sort by the length of the alphabetical part
      .addOrderBy("regexp_replace(seat.seat_number, '\\d', '', 'g')") // Sort by the alphabetical part
      .addOrderBy("CAST(regexp_replace(seat.seat_number, '\\D', '', 'g') AS INTEGER)") // Sort by the numeric part
      .getMany();
  };

  updateSeat = async (id: SeatIdDto, updatedPayload: Partial<Seat>) => {
    try {
      const updatedRow = await this.repository
        .createQueryBuilder()
        .update(this.entity, updatedPayload)
        .where('id = :id', { id: id })
        .returning('*')
        .updateEntity(true)
        .execute();

      return updatedRow.raw[0];
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error while updating seat');
    }
  };
}

export default SeatRepository;

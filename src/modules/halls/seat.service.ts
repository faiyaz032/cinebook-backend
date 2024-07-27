import { StatusCodes } from 'http-status-codes';
import CustomError from '../../shared/error-handling/CustomError';
import logger from '../../shared/logger/LoggerManager';
import { Hall } from './hall.entity';
import { HallIdDto } from './hall.schema';
import { Seat, SeatTypes } from './seat.entity';
import SeatRepository from './seat.repository';
import { SeatIdDto } from './seat.schema';

class SeatService {
  private repository;

  constructor() {
    this.repository = new SeatRepository();
  }

  /**
   * Generates an array of seat objects for a given hall based on the provided capacity.
   * Each seat is assigned a seat number, type, and price based on its row.
   *
   * @param hallId - The ID of the hall for which seats are being generated.
   * @param capacity - The total number of seats to be generated.
   * @returns An array of seat objects, each with a hall ID, seat number, type, and price.
   */
  private generateSeats(hall: Hall, capacity: number): Partial<Seat>[] {
    const SEATS_PER_ROW = 30; // Number of seats per row

    const seats: Partial<Seat>[] = [];

    const rows = Math.ceil(capacity / SEATS_PER_ROW); // Calculate the total number of rows required

    /**
     * Generates a row identifier based on the given index.
     * For example: 0 -> A, 1 -> B, ..., 25 -> Z, 26 -> AA, 27 -> AB, etc.
     *
     * @param index - The index to be converted to a row identifier.
     * @returns The row identifier string.
     */
    const getRowIdentifier = (index: number): string => {
      let identifier = '';
      while (index >= 0) {
        identifier = String.fromCharCode((index % 26) + 65) + identifier; // Convert index to character
        index = Math.floor(index / 26) - 1; // Adjust index for next character
      }
      return identifier;
    };

    // Loop through each row to create seats
    for (let row = 0; row < rows; row++) {
      const rowLetter = getRowIdentifier(row); // Get row identifier for the current row
      // Loop through each column to create seats in the current row
      for (let col = 0; col < SEATS_PER_ROW && seats.length < capacity; col++) {
        const seat: Partial<Seat> = {
          hall: hall, // hall
          seat_number: `${rowLetter}${col + 1}`, // Generate seat number (e.g., A1, A2, ..., B1, B2, etc.)
          seat_type: rowLetter >= 'A' && rowLetter <= 'H' ? SeatTypes.REGULAR : SeatTypes.PREMIUM, // Determine seat type based on row
          price: rowLetter >= 'A' && rowLetter <= 'H' ? 5 : 8, // Determine price based on seat type
        };
        seats.push(seat); // Add the seat to the seats array
      }
    }

    return seats; // Return the array of generated seats
  }

  createSeats = async (hall: Hall) => {
    try {
      const seats = this.generateSeats(hall, hall.capacity);
      return await this.repository.createSeats(seats);
    } catch (error: any) {
      logger.error(error.message);
      throw new Error('Error while creating seats');
    }
  };

  getSeatsByHallId = async (hallId: HallIdDto) => {
    try {
      return await this.repository.getSeatsByHallId(hallId);
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };

  updateSeat = async (id: SeatIdDto, updatedPayload: Partial<Seat>) => {
    try {
      const data = await this.repository.updateSeat(id, updatedPayload);
      if (!data) {
        throw new CustomError(StatusCodes.NOT_FOUND, 'No seat found with the given id');
      }
      return data;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  };
}

export default SeatService;

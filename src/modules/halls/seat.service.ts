import logger from '../../shared/logger/LoggerManager';
import { Hall } from './hall.entity';
import { SeatTypes } from './seat.entity';
import SeatRepository from './seat.repository';
import { ISeat } from './seat.types';

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
  private generateSeats(hallId: string, capacity: number): Partial<ISeat>[] {
    const seats: Partial<ISeat>[] = [];
    const seatsPerRow = 10; // Number of seats per row
    const rows = Math.ceil(capacity / seatsPerRow); // Calculate the total number of rows required

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
      for (let col = 0; col < seatsPerRow && seats.length < capacity; col++) {
        const seat: Partial<ISeat> = {
          hall: hallId, // Assign the hall ID to the seat
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
      const seats = this.generateSeats(hall.id, hall.capacity);
      return await this.repository.createSeats(seats);
    } catch (error: any) {
      logger.error(error.message);
      throw new Error('Error while creating seats');
    }
  };
}

export default SeatService;

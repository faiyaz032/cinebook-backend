import { z } from 'zod';

export const idSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid uuid' }),
});

export const seatSchema = z.object({
  hall: z.string().uuid({ message: 'id must be a valid uuid' }),
  seat_number: z.string({ required_error: 'seat_number must be a string' }),
  seat_type: z.string({ required_error: 'seat_type must be a string' }),
  price: z.number({ required_error: 'price must be a number' }),
});

export const updateSeatSchema = seatSchema.partial();

export type SeatDto = z.infer<typeof seatSchema>;
export type SeatIdDto = z.infer<typeof idSchema>['id'];
export type UpdateSeatDto = z.infer<typeof updateSeatSchema>;

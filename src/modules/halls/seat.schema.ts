import { z } from 'zod';

export const seatIdSchema = z.object({
  seatId: z.string().uuid({ message: 'id must be a valid uuid' }),
});

export const seatSchema = z.object({
  hall: z.string().uuid({ message: 'id must be a valid uuid' }),
  seat_number: z.string({ required_error: 'seat_number must be a string' }),
  seat_type: z.enum(['regular', 'premium'], { required_error: 'seat_type must be either "regular" or "premium"' }),
  price: z.number({ required_error: 'price must be a number' }),
  status: z.enum(['available', 'booked'], { message: 'status must be either "available" or "booked"' }).optional(),
});

export const updateSeatSchema = seatSchema.partial();

export type SeatDto = z.infer<typeof seatSchema>;
export type SeatIdDto = z.infer<typeof seatIdSchema>['seatId'];
export type UpdateSeatDto = z.infer<typeof updateSeatSchema>;

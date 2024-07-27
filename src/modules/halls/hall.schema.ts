import { z } from 'zod';

export const hallSchema = z.object({
  hall_number: z.number({ required_error: 'hall_number must be a number' }),
  capacity: z.number({ required_error: 'capacity must be a number' }),
});

// Wrap the objectId schema in an object
export const idSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid uuid' }),
});

export const updateHallSchema = hallSchema.partial();

// Reusing idSchema from the previous definition
export const hallIdSchema = idSchema;

export const hallQuerySchema = z.object({
  search: z.string().optional(),
  sort: z.string().optional(),
  page: z.coerce
    .number({ message: 'page must be a positive number' })
    .int()
    .min(1, { message: 'Page must be a positive integer' })
    .optional(),
  limit: z.coerce
    .number({ message: 'limit must be a positive number' })
    .int()
    .min(1, { message: 'Limit must be a positive integer' })
    .optional(),
  filters: z.any().optional(),
});

export type HallDto = z.infer<typeof hallSchema>;
export type UpdateHallDto = z.infer<typeof updateHallSchema>;
export type HallIdDto = z.infer<typeof hallIdSchema>['id'];
export type HallQueryParamsDto = z.infer<typeof hallQuerySchema>;

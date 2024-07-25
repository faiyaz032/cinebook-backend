import { z } from 'zod';

export const movieSchema = z.object({
  name: z.string({ message: 'name must be a string' }),
  description: z.string({ required_error: 'description ust be a string' }),
  duration: z.string({ required_error: 'duration ust be a string' }),
  banner: z.string({ required_error: 'banner must be a string' }),
  nowShowing: z.boolean().default(false).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const updateMovieSchema = movieSchema.partial();

export const idSchema = z.string().uuid({ message: 'Invalid UUID format for id' });

export const querySchema = z.object({
  search: z.string().optional(),
  sort: z.string().optional(),
  page: z.coerce.number().int().min(1, { message: 'Page must be a positive integer' }).optional(),
  limit: z.coerce.number().int().min(1, { message: 'Limit must be a positive integer' }).optional(),
  filters: z.any().optional(),
});

export type QueryParamsDto = z.infer<typeof querySchema>;
export type MovieDto = z.infer<typeof movieSchema>;
export type UpdateMovieDto = z.infer<typeof updateMovieSchema>;

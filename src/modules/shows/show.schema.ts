import { z } from 'zod';

export const showSchema = z.object({
  movie: z.string().uuid({ message: 'movie_id must be a valid uuid' }),
  hall: z.string().uuid({ message: 'hall_id must be a valid uuid' }),
  start_time: z.string({ required_error: 'start_time must be a string' }),
  end_time: z.string({ required_error: 'end_time must be a string' }),
});

export const updateShowSchema = showSchema.partial();

// Additional schema for query parameters if needed
export const querySchema = z.object({
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

// Type inference

export const idSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid uuid' }),
});

export type IdDto = z.infer<typeof idSchema>['id'];
export type ShowDto = z.infer<typeof showSchema>;
export type UpdateShowDto = z.infer<typeof updateShowSchema>;
export type QueryParamsDto = z.infer<typeof querySchema>;

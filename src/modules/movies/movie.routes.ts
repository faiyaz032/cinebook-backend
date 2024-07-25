import { Router } from 'express';
import validateResource from '../../middlewares/validateResource';
import MovieController from './movie.controller';
import { movieSchema, querySchema } from './movie.schema';

export default function movieRoutes() {
  const router = Router();

  const controller = new MovieController();

  router.post('/', validateResource({ body: movieSchema }), controller.createMovieHandler);
  router.get('/', validateResource({ query: querySchema }), controller.getMoviesHandler);

  return router;
}

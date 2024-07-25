import { Router } from 'express';
import validateResource from '../../middlewares/validateResource';
import MovieController from './movie.controller';
import { idSchema, movieSchema, querySchema } from './movie.schema';

export default function movieRoutes() {
  const router = Router();

  const controller = new MovieController();

  router.post('/', validateResource({ body: movieSchema }), controller.createMovieHandler);
  router.get('/', validateResource({ query: querySchema }), controller.getMoviesHandler);
  router.get('/:id', validateResource({ params: idSchema }), controller.getMovieByIdHandler);

  return router;
}

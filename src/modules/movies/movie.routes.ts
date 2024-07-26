import { Router } from 'express';
import validateResource from '../../middlewares/validateResource';
import MovieController from './movie.controller';
import { idSchema, movieSchema, querySchema, updateMovieSchema } from './movie.schema';

export default function movieRoutes() {
  const router = Router();

  const controller = new MovieController();

  router.post('/', validateResource({ body: movieSchema }), controller.createMovieHandler);
  router.get('/', validateResource({ query: querySchema }), controller.getMoviesHandler);
  router.get('/:id', validateResource({ params: idSchema }), controller.getMovieByIdHandler);
  router.patch('/:id', validateResource({ params: idSchema, body: updateMovieSchema }), controller.updateMovieHandler);
  router.delete('/:id', validateResource({ params: idSchema }), controller.deleteMovieHandler);

  return router;
}

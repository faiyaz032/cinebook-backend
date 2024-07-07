import { Router } from 'express';
import validateResource from '../../middlewares/validateResource';
import MovieController from './movie.controller';
import { movieSchema } from './movie.schema';

export default function movieRoutes() {
  const router = Router();

  const controller = new MovieController();

  router.post('/', validateResource({ body: movieSchema }), controller.createMovieHandler);

  return router;
}

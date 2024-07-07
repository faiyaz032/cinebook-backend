import { Router } from 'express';
import movieRoutes from './movie.routes';

export default function loadMoviesModule(apiRouter: Router) {
  apiRouter.use('/movies', movieRoutes());
}

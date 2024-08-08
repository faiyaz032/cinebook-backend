import { Router } from 'express';
import showRoutes from './show.routes';

export default function loadShowsModule(apiRouter: Router) {
  apiRouter.use('/shows', showRoutes());
}

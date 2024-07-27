import { Router } from 'express';
import hallRoutes from './hall.routes';

export default function loadHallsModule(apiRouter: Router) {
  apiRouter.use('/halls', hallRoutes());
}

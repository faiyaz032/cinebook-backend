import { Router } from 'express';
import authRoutes from './auth.routes';

export default function loadAuthModule(apiRouter: Router) {
  apiRouter.use('/auth', authRoutes());
}

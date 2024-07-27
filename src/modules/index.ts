import { Router } from 'express';
import loadHallsModule from './halls';
import loadMoviesModule from './movies';

export default function loadAllModules(apiRouter: Router) {
  loadMoviesModule(apiRouter);
  loadHallsModule(apiRouter);
}

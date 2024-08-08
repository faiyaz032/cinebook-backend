import { Router } from 'express';
import loadHallsModule from './halls';
import loadMoviesModule from './movies';
import loadShowsModule from './shows';

export default function loadAllModules(apiRouter: Router) {
  loadMoviesModule(apiRouter);
  loadHallsModule(apiRouter);
  loadShowsModule(apiRouter);
}

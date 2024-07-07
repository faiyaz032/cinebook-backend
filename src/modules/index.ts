import { Router } from 'express';
import loadMoviesModule from './movies';

export default function loadAllModules(apiRouter: Router) {
  loadMoviesModule(apiRouter);
}

import { Router } from 'express';
import validateResource from '../../middlewares/validateResource';
import ShowController from './show.controller';
import { idSchema, querySchema, showSchema, updateShowSchema } from './show.schema';

export default function showRoutes() {
  const router = Router();

  const controller = new ShowController();

  router.post('/', validateResource({ body: showSchema }), controller.createShowHandler);
  router.get('/', validateResource({ query: querySchema }), controller.getShowsHandler);
  router.get('/:id', validateResource({ params: idSchema }), controller.getShowByIdHandler);
  router.patch('/:id', validateResource({ params: idSchema, body: updateShowSchema }), controller.updateShowHandler);
  router.delete('/:id', validateResource({ params: idSchema }), controller.deleteShowHandler);

  return router;
}

import { Router } from 'express';
import validateResource from '../../middlewares/validateResource';
import HallController from './hall.controller';
import { hallIdSchema, hallQuerySchema, hallSchema, updateHallSchema } from './hall.schema';
import { seatIdSchema, updateSeatSchema } from './seat.schema';

export default function hallRoutes() {
  const router = Router();

  const controller = new HallController();

  router.post('/', validateResource({ body: hallSchema }), controller.createHallHandler);
  router.get('/', validateResource({ query: hallQuerySchema }), controller.getHallsHandler);
  router.get('/:id', validateResource({ params: hallIdSchema }), controller.getHallByIdHandler);
  router.patch(
    '/:id',
    validateResource({ params: hallIdSchema, body: updateHallSchema }),
    controller.updateHallHandler
  );
  router.delete('/:id', validateResource({ params: hallIdSchema }), controller.deleteHallHandler);

  //seats routers
  router.get('/:id/seats', validateResource({ params: hallIdSchema }), controller.getSeatsByHallIdHandler);
  router.patch(
    '/seats/:seatId',
    validateResource({ params: seatIdSchema, body: updateSeatSchema }),
    controller.updateSeatHandler
  );

  return router;
}

import express, { Response, Request } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@li-tickets/common';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // emit an event -> order:cancel

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };

import express, { Response, Request } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { requireAuth, validateResult } from '@li-tickets/common';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateResult,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as newOrderRouter };

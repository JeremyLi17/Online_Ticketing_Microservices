import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@li-tickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    // should emit an Order:update (but for just now: we don't expect
    // user to do any feather update after the payment, so we didn't add it)

    msg.ack();
  }
}

import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Order, OrderStatus } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';
import { ExpirationCompleteEvent } from '@li-tickets/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // 1. Create listener instance
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // Create ticket and its corresponding Order
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Title',
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    userId: 'testUser',
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket: ticket,
  });
  await order.save();

  // 2. build up fake data and msg object
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
  const { listener, order, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventDate = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventDate.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, order, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

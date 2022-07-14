import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticketId,
    })
    .expect(404);
});

it('returns a 400 if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 200,
  });
  await ticket.save();

  const order = Order.build({
    userId: 'testid',
    ticket: ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('successfully reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 200,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it.todo('emits an order created events');

import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket, TicketDoc } from '../../models/ticket';

const buildTicket = async (title: string, price: number) => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title,
    price,
  });
  await ticket.save();

  return ticket;
};

it('fetches orders for an particular user', async () => {
  // 1. Create 3 tickets and 2 users
  const ticket1 = await buildTicket('concert1', 10);
  const ticket2 = await buildTicket('concert2', 20);
  const ticket3 = await buildTicket('concert3', 30);

  const user1 = global.signin();
  const user2 = global.signin();

  // 2. Create 1 order as User1
  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201);

  // 2. Create 2 orders as User2
  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({
      ticketId: ticket2.id,
    })
    .expect(201);

  const { body: order3 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({
      ticketId: ticket3.id,
    })
    .expect(201);

  // 3. Make request to get orders for User2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);

  // 4. Make sure we only get the orders for User2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order2.id);
  expect(response.body[1].id).toEqual(order3.id);

  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});

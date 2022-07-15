import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { createTicket } from './share';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('return a 404 if the provided ticketId does not exist', async () => {
  const fakeId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${fakeId}`)
    .set('Cookie', global.signin())
    .send({
      title: 'validtitle',
      price: 20,
    })
    .expect(404);
});

it('return a 401 if the user is not authenticated', async () => {
  const fakeId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${fakeId}`)
    .send({
      title: 'validtitle',
      price: 20,
    })
    .expect(401);
});

it('return a 401 if the user does not own the ticket', async () => {
  const response = await createTicket('test1', 20);

  // request the tickets just created but use different userInfo(different cookie)
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'updateTitle',
      price: 10,
    })
    .expect(401);
});

it('return a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'validTitle',
      price: -10,
    });
});

it('updates the ticket by provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: 10,
    })
    .expect(201);

  const updatedTitle = 'newTitle';
  const updatedPrice = 1000;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  const updatedResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(updatedResponse.body.title).toEqual(updatedTitle);
  expect(updatedResponse.body.price).toEqual(updatedPrice);
});

it('publishes an event after update ticket info', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: 10,
    })
    .expect(201);

  const updatedTitle = 'newTitle';
  const updatedPrice = 1000;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: 10,
    })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  const updatedTitle = 'newTitle';
  const updatedPrice = 1000;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(400);
});

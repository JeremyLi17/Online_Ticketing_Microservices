import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
  // valid Id for mongose -> string of 12 bytes / string of 24 hex characters
  const fakeId = new mongoose.Types.ObjectId().toHexString(); // generate fakeId
  await request(app).get(`/api/tickets/${fakeId}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'testTitle';
  const price = 20;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: title,
      price: price,
    })
    .expect(201);

  const ticketId = response.body.id;
  const ticketResponse = await request(app)
    .get(`/api/tickets/${ticketId}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
  expect(ticketResponse.body.id).toEqual(ticketId);
});

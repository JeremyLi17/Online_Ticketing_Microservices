import request from 'supertest';
import { app } from '../../app';
import { createTicket } from './share';

it('can fetch a list if tickets', async () => {
  await createTicket('test1', 20);
  await createTicket('test2', 20);
  await createTicket('test3', 20);

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});

import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // 1. Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'movie',
    price: 100,
    userId: 'testuser',
  });

  // 2. Save the ticket to the DB
  await ticket.save();

  // 3. fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // 4. Make 2 seperate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // Save the 1st fetched ticket -> success
  await firstInstance!.save();

  // Save the 2nd fetched ticket -> fail
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on mulitiple saves', async () => {
  const ticket = Ticket.build({
    title: 'movie',
    price: 100,
    userId: 'testuser',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});

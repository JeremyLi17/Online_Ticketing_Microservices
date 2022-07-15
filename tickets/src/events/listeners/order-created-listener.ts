import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@li-tickets/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // 1. Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no such ticket, throw not found err
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // 2. Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // 3. Save the ticket
    await ticket.save();

    // EVERYTIME WE EDIT THE TICKET -> NEED EMIT AN EVENT

    // 4. Ack the message
    msg.ack();
  }
}

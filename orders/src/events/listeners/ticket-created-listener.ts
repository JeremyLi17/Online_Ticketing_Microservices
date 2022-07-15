import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@li-tickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  // msg -> ack method
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    // We need to make sure the id of Ticket in Orders service DB
    // is equal to the id of Ticket of Ticket service DB
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}

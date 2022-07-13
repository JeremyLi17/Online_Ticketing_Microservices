import { Publisher, Subjects, TicketCreatedEvent } from '@li-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

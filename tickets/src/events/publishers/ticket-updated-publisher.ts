import { Publisher, Subjects, TicketUpdatedEvent } from '@li-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

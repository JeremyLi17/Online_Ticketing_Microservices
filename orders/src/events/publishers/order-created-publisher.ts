import { Publisher, OrderCreatedEvent, Subjects } from '@li-tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

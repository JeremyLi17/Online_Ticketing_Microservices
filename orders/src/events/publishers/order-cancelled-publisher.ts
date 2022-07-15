import { Subjects, Publisher, OrderCancelledEvent } from '@li-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

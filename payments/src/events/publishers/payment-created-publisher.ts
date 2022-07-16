import { PaymentCreatedEvent, Publisher, Subjects } from '@li-tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}

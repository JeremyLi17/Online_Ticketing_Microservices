import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@li-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}

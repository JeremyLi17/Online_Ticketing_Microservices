import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  // manualACK: avoid lose event: after everything process success, return ACK
  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()
  //   .setDurableName('service');
  // 只用.setDeliverAllAvailable() -> redeliver all event

  // the second arg is QueueGroup
  // const subscription = stan.subscribe(
  //   'ticket:created',
  //   'listener-Queue-Group',
  //   options
  // );

  // subscription.on('message', (msg: Message) => {
  //   // use msg.getSubject() -> get the channel name
  //   // getSequence -> event number (start from 1)
  //   // getDate() -> data
  //   const data = msg.getData();

  //   if (typeof data === 'string') {
  //     console.log(`Received event #${msg.getSequence()}, with data:${data}`);
  //   }

  //   msg.ack();
  // });
  new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close()); // interrupt
process.on('SIGTERM', () => stan.close()); // terminate

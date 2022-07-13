import nats from 'node-nats-streaming';

console.clear();

// create a client(instance)
// object exchange info with streaming server
// the 2nd args is the clientID
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

// once stan successfully connect to the server,
// will call this callback func
stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  // NAT can only process plain data
  // So we need convert object into JSON
  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  // publish func -> actually send data
  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});

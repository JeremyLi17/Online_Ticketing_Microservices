import Queue from 'bull';

// the payload should have inside that job
interface Payload {
  orderId: string;
}

// 1st arg is the channel
const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log(
    'I want to publish an expiration:complete event for orderId:',
    job.data.orderId
  );
});

export { expirationQueue };

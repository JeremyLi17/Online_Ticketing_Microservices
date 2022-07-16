import Stript from 'stripe';

// This file is to create a stript instance so we can use through this service
// 1st arg is the API_KEY
export const stripe = new Stript(process.env.STRIPE_KEY!, {
  apiVersion: '2020-08-27',
});

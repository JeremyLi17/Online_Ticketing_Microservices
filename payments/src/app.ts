import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUser, errHandler, NotFoundError } from '@li-tickets/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== 'test',
    secure: false,
  })
);
app.use(currentUser);

app.use(createChargeRouter);

// for any other unknown apiURL
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errHandler);

export { app };

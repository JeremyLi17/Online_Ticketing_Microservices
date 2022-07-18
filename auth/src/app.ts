import express from 'express';
import 'express-async-errors'; // catching async error use sync way
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errHandler, NotFoundError } from '@li-tickets/common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    // Some config
    // no encryption
    signed: false,
    // Must use HTTPS
    // secure: process.env.NODE_ENV !== 'test',
    secure: false,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// for any other unknown apiURL
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// for async error -> use next
// app.all("*", (req, res, next) => {
//   next(new NotFoundError());
// });

app.use(errHandler);

export { app };

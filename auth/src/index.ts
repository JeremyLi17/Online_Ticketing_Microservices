import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// for any other unknown apiURL
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

// for async error -> use next
// app.all("*", (req, res, next) => {
//   next(new NotFoundError());
// });

app.use(errHandler);

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
  } catch (err) {
    console.error(err);
  }
  console.log("Connected to MongoDb");
  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();

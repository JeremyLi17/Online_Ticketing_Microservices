import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { validateResult, BadRequestError } from "@li-tickets/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    // use 3rd parity express-validator to validate incoming data
    body("email").isEmail().withMessage("Email must be vaild"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password mush be betweeb 4 and 20 charecters"),
  ],
  validateResult, // the middleware must be under the body statement
  async (req: Request, res: Response) => {
    /* Already change this into validateRequest middleware
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // approach1: too customize info
      // return res.status(400).send(errors.array());

      // JavaScript Approach:
      // const error = new Error("Invalid email or password");
      // error.reasons = errors.array();
      // throw error;

      // Encoding more info in error -> subclass Error
      throw new RequestValidationError(errors.array());
    }
    */

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    // Create User
    const user = User.build({ email, password });
    await user.save();

    // generate JSON web token
    const userJwt = jwt.sign(
      {
        // payload
        id: user.id,
        email: user.email,
      },
      // load from env variable
      process.env.JWT_KEY!
    );

    // store JWT on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };

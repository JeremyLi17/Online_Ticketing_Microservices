import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

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
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }

    // all input are valid
    const { email, password } = req.body;

    console.log("Creating a user...");

    res.send({});
  }
);

export { router as signupRouter };

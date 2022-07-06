import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const errHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // Unknown error
  res.status(400).send({
    // err.message -> create new Error时的message
    errors: [{ message: "Something unknow went wrong" }],
  });
};

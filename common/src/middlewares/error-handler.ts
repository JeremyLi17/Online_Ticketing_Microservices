import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // standard return format
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // Unknown error
  // for debug purpose: console log unknown error -> have better understand
  console.error(err);
  res.status(400).send({
    // err.message -> create new Error时的message
    errors: [{ message: 'Something unknow went wrong' }],
  });
};

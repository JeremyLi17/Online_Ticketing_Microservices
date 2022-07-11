import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  // 401 -> Forbidden
  statusCode = 401;

  constructor() {
    super("Not authotized");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not authotized" }];
  }
}

import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

// ValidationError is a TYPE
export class RequestValidationError extends CustomError {
  statusCode = 400;

  // use private -> 等价于1. private errors; 2. this errors = errors
  constructor(public errors: ValidationError[]) {
    // must call super
    super("Invalid request parameters");

    // Only when try extending a build-in class in TS
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}

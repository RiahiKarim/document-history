import { HttpStatusCode } from './http-status-code';

// centralized error object that derives from Node’s Error
export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(message: string, httpCode: HttpStatusCode, name: string, isOperational: boolean = true) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.httpCode = httpCode;
    this.name = name;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

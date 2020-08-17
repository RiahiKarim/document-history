import { AppError } from './app-error';

process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
  // since we already have fallback handler for unhandled errors (see below),
  // let throw and let him handle that
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) process.exit(1);
});

// centralized error handler encapsulates error-handling related logic
class ErrorHandler {
  public handleError(err: Error) {
    this.logError(err);
  }

  public isTrustedError(error: Error) {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }

  public logError(error: Error) {
    console.error(`Error handler is reporting a new error:`);
    console.error(error);
  }
}

export const errorHandler = new ErrorHandler();

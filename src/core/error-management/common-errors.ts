import { AppError } from './app-error';
import { HttpStatusCode } from './http-status-code';

const commonErrors = {
  InvalidInput: { name: 'InvalidInput', httpStatus: HttpStatusCode.BAD_REQUEST },
  Unauthorized: { name: 'Unauthorized', httpStatus: HttpStatusCode.UNAUTHORIZED },
  OperationNotAllowed: { name: 'OperationNotAllowed', httpStatus: HttpStatusCode.FORBIDDEN },
  ResourceNotFound: { name: 'ResourceNotFound', httpStatus: HttpStatusCode.NOT_FOUND },
  Conflict: { name: 'Conflict', httpStatus: HttpStatusCode.CONFLICT },
  UnknownError: { name: 'UnknownError', httpStatus: HttpStatusCode.INTERNAL_SERVER_ERROR },
};

export const invalidInputError = (message: string, name = null) =>
  new AppError(message, commonErrors.InvalidInput.httpStatus, name || commonErrors.InvalidInput.name);

export const unauthorizedError = (message: string, name = null) =>
  new AppError(
    message || commonErrors.Unauthorized.name,
    commonErrors.Unauthorized.httpStatus,
    name || commonErrors.Unauthorized.name
  );

export const operationNotAllowedError = (message: string, name = null) =>
  new AppError(message, commonErrors.OperationNotAllowed.httpStatus, name || commonErrors.OperationNotAllowed.name);

export const resourceNotFoundError = (message: string, name = null) =>
  new AppError(
    message || commonErrors.ResourceNotFound.name,
    commonErrors.ResourceNotFound.httpStatus,
    name || commonErrors.ResourceNotFound.name
  );

export const conflictError = (message: string, name = null) =>
  new AppError(message, commonErrors.Conflict.httpStatus, name || commonErrors.Conflict.name);

export const unknownError = (message: string, name = null) =>
  new AppError(message, commonErrors.UnknownError.httpStatus, name || commonErrors.UnknownError.name);

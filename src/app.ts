import bodyParser from 'body-parser';
import { ErrorHandleFunction } from 'connect';
import express, { Application, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { AppError, errorHandler } from './core/error-management';
// Route handlers
import { documentHistoryRouter } from './document-history';
import { MONGODB_URI } from './util';

// Create Express server
const app: Application = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .catch(err => {
    throw new Error(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
  });

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Primary app routes.
app.use('/', documentHistoryRouter);

// Error handling middleware, we delegate the handling to the centralized error handler
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  errorHandler.handleError(err);
  res.status(err.httpCode || 500).json({ name: err.name, message: err.message });
});

export default app;

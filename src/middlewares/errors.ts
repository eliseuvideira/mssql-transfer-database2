import { RequestHandler, ErrorRequestHandler } from 'express';
import { HttpError, isHttpError } from '../functions/HttpError';

const notFound: RequestHandler = (req, res, next) => {
  next(new HttpError(404, 'Resource not found'));
};

const exception: ErrorRequestHandler = (err, req, res, _next) => {
  const status = isHttpError(err) ? err.status : 500;
  let message: string = err.message;
  if (status === 500) {
    console.error(err);
    if (process.env.NODE_ENV === 'production') {
      message = 'Internal server error';
    }
  }
  res.status(status).json({ message });
};

export { notFound, exception };

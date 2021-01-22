import { NextFunction, Request, Response } from 'express';

import { isMongoError, handleMongoError } from './mongo';
import { isRequestError, handleRequestError } from './request';
import { isMongooseError, handleMongooseError } from './mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    if (isRequestError(err)) {
        handleRequestError(err, res);
    } else if (isMongoError(err)) {
        handleMongoError(err, res);
    } else if (isMongooseError(err)) {
        handleMongooseError(err, res);
    } else {
        res.status(500).json({
            error: { name: err.name, message: err.message, stack: err.stack },
        });
    }
};

export { errorMiddleware };

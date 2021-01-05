import { Response } from 'express';

import { Error as MongooseError } from 'mongoose';

const isMongooseError = (err: Error): boolean =>
    err instanceof MongooseError.CastError ||
    err instanceof MongooseError.ValidationError ||
    err instanceof MongooseError.DocumentNotFoundError;

const handleMongooseError = (err: MongooseError, res: Response): void => {
    res.status(400).json({
        error: {
            name: err.name || 'MongooseError',
            message: err.message,
        },
    });
};

export { isMongooseError, handleMongooseError };

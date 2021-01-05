import { Response } from 'express';
import { MongoError } from 'mongodb';

const isMongoError = (err: Error): err is MongoError => err instanceof MongoError;

const handleMongoError = (err: MongoError, res: Response): void => {
    const errCodeMsg = err.code ? `[${err.code}]` : '';
    res.status(400).json({
        error: {
            name: `${err.name || 'MongoError'} ${errCodeMsg}`,
            message: err.errmsg,
        },
    });
};

export { isMongoError, handleMongoError };

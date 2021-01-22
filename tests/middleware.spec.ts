import { NextFunction, Request, Response } from 'express';

import { MongoError } from 'mongodb';

import { errorMiddleware } from '../src';
import * as MongoErrorHandler from '../src/mongo';
import * as RequestErrorHandler from '../src/request';
import * as MongooseErrorHandler from '../src/mongoose';
import { Error as MongooseError } from 'mongoose';

describe('Error handler middleware', () => {
    const mockRequest: Partial<Request> = {};
    const mockResponse: Partial<Response> = {
        statusCode: 0,
        status(code: number): Response {
            this.statusCode = code;
            return this as Response;
        },
        json: jest.fn(),
    };
    const nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('Unhandled error', () => {
        const err = new Error('UnhandledError');
        errorMiddleware(err, mockRequest as Request, mockResponse as Response, nextFunction);

        expect(err.stack).toBeDefined();
        expect(mockResponse.statusCode).toBe(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: expect.objectContaining({ name: 'Error', message: 'UnhandledError' }),
        });
    });

    test('Request error', () => {
        const handlerReqErr = jest.spyOn(RequestErrorHandler, 'handleRequestError');
        const err = new RequestErrorHandler.BadRequestError();
        errorMiddleware(err, mockRequest as Request, mockResponse as Response, nextFunction);

        expect(handlerReqErr).toHaveBeenCalledWith(err, mockResponse);
        expect(mockResponse.statusCode).toBe(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: { message: 'Bad request error' } });
    });

    test('Mongo error', () => {
        const handlerMongoErr = jest.spyOn(MongoErrorHandler, 'handleMongoError');

        const err = new MongoError('Random error');
        err.code = 12;
        errorMiddleware(err, mockRequest as Request, mockResponse as Response, nextFunction);

        expect(handlerMongoErr).toHaveBeenCalledWith(err, mockResponse);
        expect(mockResponse.statusCode).toBe(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: { message: 'Random error', name: 'MongoError [12]' } });
    });

    test('Mongoose error', () => {
        const handleMongooseError = jest.spyOn(MongooseErrorHandler, 'handleMongooseError');
        const err = new MongooseError.DocumentNotFoundError('findById');
        errorMiddleware(err, mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.statusCode).toBe(400);
        expect(handleMongooseError).toHaveBeenCalledWith(err, mockResponse);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: {
                message: 'No document found for query "\'findById\'" on model "undefined"',
                name: 'DocumentNotFoundError',
            },
        });
    });
});

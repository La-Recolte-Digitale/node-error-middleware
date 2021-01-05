/* eslint-disable */
/* @ts-ignore */
import {
    mongooseErrorHandler,
    unprocessableEntityHandler,
    entityNotFoundHandler,
    validationErrorHandler,
    duplicateKeyErrorHandler,
} from '../src/mongoose';

import { requestErrorHandler, errorHandler } from '../src/global';
import { Request, Response } from 'express';

jest.setTimeout(60000);

global.console = {
    ...global.console,
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
};

let req;
let res;
const next = jest.fn();

beforeEach(async () => {
    req = {
        params: {},
        body: {},
    };

    res = {
        data: null,
        code: null,
        status(status) {
            this.code = status;
            return this;
        },
        json(data) {
            this.data = data;
        },
    };

    next.mockClear();
});

describe('Error middlewares', () => {
    it('handle entityNotFoundHandler', async () => {
        entityNotFoundHandler({ name: 'NotFound', message: 'Not found message' }, req, res, next);

        expect(res.code).toBeDefined();
        expect(res.code).toBe(404);

        expect(res.data).toBeDefined();
        expect(res.data.error).toBeDefined();
        expect(res.data.error.message).toBeDefined();
        expect(res.data.error.message).toBe('Not found message');
    });

    it('handle duplicateKeyErrorHandler', async () => {
        duplicateKeyErrorHandler({ name: 'DuplicatedKeyError', message: 'Duplicate message' }, req, res, next);

        expect(res.code).toBeDefined();
        expect(res.code).toBe(400);

        expect(res.data).toBeDefined();
        expect(res.data.error).toBeDefined();
        expect(res.data.error.message).toBeDefined();
        expect(res.data.error.message).toBe('Duplicate message');
    });

    it('handle mongooseErrorHandler CastError', async () => {
        mongooseErrorHandler({ name: 'CastError', message: 'Cast message', statusCode: 400 }, req, res, next);

        expect(res.code).toBeDefined();
        expect(res.code).toBe(400);

        expect(res.data).toBeDefined();
        expect(res.data.error).toBeDefined();
        expect(res.data.error.message).toBeDefined();
        expect(res.data.error.message).toBe('Cast message');
    });

    it('handle mongooseErrorHandler ValidationError', async () => {
        mongooseErrorHandler(
            { name: 'ValidationError', message: 'ValidationError message', statusCode: 400 },
            req,
            res,
            next,
        );

        expect(res.code).toBeDefined();
        expect(res.code).toBe(400);

        expect(res.data).toBeDefined();
        expect(res.data.error).toBeDefined();
        expect(res.data.error.message).toBeDefined();
        expect(res.data.error.message).toBe('ValidationError message');
    });

    it('handle requestErrorHandler', async () => {
        requestErrorHandler({ name: 'RequestError', statusCode: 434, message: 'Request message' }, req, res, next);

        expect(res.code).toBeDefined();
        expect(res.code).toBe(434);

        expect(res.data).toBeDefined();
        expect(res.data.error).toBeDefined();
        expect(res.data.error.message).toBeDefined();
        expect(res.data.error.message).toBe('Request message');
    });

    it('handle requestErrorHandler with no message', async () => {
        requestErrorHandler({ name: 'RequestError', message: 'RequestError', statusCode: 456 }, req, res, next);

        expect(res.code).toBeDefined();
        expect(res.code).toBe(456);

        expect(res.data).toBeDefined();
        expect(res.data.error).toBeDefined();
        expect(res.data.error.message).toBeDefined();
        expect(res.data.error.message).toBe('Unhandled mongoose error');
    });

    it('handle unprocessableEntityHandler', async () => {
        unprocessableEntityHandler(
            { name: 'UnprocessableEntityError', statusCode: 444, message: 'Unprocessable message' },
            req,
            res,
            next,
        );

        expect(res.code).toBeDefined();
        expect(res.code).toBe(444);

        expect(res.data).toBeDefined();
        expect(res.data.error).toBeDefined();
        expect(res.data.error.message).toBeDefined();
        expect(res.data.error.message).toBe('Unprocessable message');
    });

    it('handle validationErrorHandler', async () => {
        validationErrorHandler(
            { name: 'ValidationError', message: 'ValidationError', errors: [{ path: 'name', kind: 'required' }] },
            req,
            res,
            next,
        );

        expect(res.code).toBeDefined();
        expect(res.code).toBe(400);

        expect(res.data).toBeDefined();
        expect(res.data.error).toBeDefined();
        expect(res.data.error.message).toBeDefined();
    });

    it('handle errorHandler', async () => {
        errorHandler(
            { name: 'Some error', message: 'Some message', statusCode: 500, stack: 'this is stack' },
            req,
            res,
        );

        expect(res.code).toBeDefined();
        expect(res.code).toBe(500);

        expect(res.data).toBeDefined();
        expect(res.data.error).toBeDefined();
        expect(res.data.error.message).toBeDefined();
        expect(res.data.error.name).toBe('Some error');
        expect(res.data.error.message).toBe('Some message');
        expect(res.data.error.stack).toBe('this is stack');
    });
});

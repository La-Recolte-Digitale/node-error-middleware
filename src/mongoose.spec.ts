import {
    mongooseErrorHandler,
    unprocessableEntityHandler,
    entityNotFoundHandler,
    validationErrorHandler,
    duplicateKeyErrorHandler,
} from './mongoose';
import { Request, Response } from 'express';
import { ErrorsValidation } from './type';

const next = jest.fn();
const req = {} as Request;
const err = {
    name: '',
    message: '',
    statusCode: 0,
};

const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

beforeEach(() => {
    jest.resetAllMocks();
});

describe('Test Mongoose Error Handler', () => {
    describe('mongooseErrorHandler', () => {
        it('Should call next', () => {
            err.name = 'RandomError';

            mongooseErrorHandler(err, req, {} as Response, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(err);
        });

        it("Should return 400 and 'MongooseError'", () => {
            err.name = 'CastError';
            const res = mockResponse();

            mongooseErrorHandler(err, req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: { message: 'Mongoose error' },
            });
            expect(next).toHaveBeenCalledTimes(0);
        });

        it('Should return 400 and personalised message', () => {
            err.name = 'ValidationError';
            err.message = 'Tire toi une buche';
            const res = mockResponse();

            mongooseErrorHandler(err, req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: { message: err.message },
            });
            expect(next).toHaveBeenCalledTimes(0);
        });
    });

    describe('unprocessableEntityHandler', () => {
        it('Should call next', () => {
            err.name = 'BucheError';

            unprocessableEntityHandler(err, req, {} as Response, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(err);
        });

        it("Should 403 and return 'NopNopNop'", () => {
            err.name = 'UnprocessableEntityError';
            err.message = 'NopNopNop';
            err.statusCode = 403;
            const res = mockResponse();

            unprocessableEntityHandler(err, req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                error: { message: err.message },
            });
            expect(next).toHaveBeenCalledTimes(0);
        });

        it("Should 403 and return 'NI! NI! NI!'", () => {
            err.name = 'UnprocessableEntity';
            err.message = 'NI! NI! NI!';
            err.statusCode = 500;
            const res = mockResponse();

            unprocessableEntityHandler(err, req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: { message: err.message },
            });
            expect(next).toHaveBeenCalledTimes(0);
        });
    });

    describe('entityNotFoundHandler', () => {
        it('Should call next', () => {
            err.name = 'TheError';

            entityNotFoundHandler(err, req, {} as Response, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(err);
        });

        it('Should have 404 with custom err message', () => {
            err.name = 'NotFound';
            err.message = 'Tirlalipinpon sur le chiwawa';
            const res = mockResponse();

            entityNotFoundHandler(err, req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: { message: err.message },
            });
            expect(next).toHaveBeenCalledTimes(0);
        });
    });

    describe('validationErrorHandler', () => {
        const err: ErrorsValidation = {
            name: '',
            message: '',
            errors: [],
        };

        it('Should call next', () => {
            err.name = 'One Punch Error';

            validationErrorHandler(err, req, {} as Response, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(err);
        });

        it('Should 400 and return all errors message in one string', () => {
            err.name = 'ValidationError';
            err.errors.push({
                path: "'/path'",
                kind: 'required',
            });
            err.errors.push({
                path: "'/to'",
                kind: 'invalid',
            });
            const res = mockResponse();
            const concatErrMsg = "'/path' is required\n'/to' is invalid";
            global.console.error = jest.fn();

            validationErrorHandler(err, req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: { message: concatErrMsg },
            });
            expect(next).toHaveBeenCalledTimes(0);
            expect(global.console.error).toHaveBeenCalledWith(err.errors, Object.entries(err.errors));
        });

        describe('duplicateKeyErrorHandler', () => {
            it('Should use next', () => {
                err.name = 'One Error for all';

                duplicateKeyErrorHandler(err, req, {} as Response, next);

                expect(next).toHaveBeenCalledTimes(1);
                expect(next).toHaveBeenCalledWith(err);
            });

            it('Should 400 and return custom err message', () => {
                err.name = 'DuplicatedKeyError';
                err.message = "Don't clone your keys";
                const res = mockResponse();

                duplicateKeyErrorHandler(err, req, res, next);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    error: { message: err.message },
                });
                expect(next).toHaveBeenCalledTimes(0);
            });
        });
    });
});

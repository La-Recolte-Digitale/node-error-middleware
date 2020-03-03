import { Request, Response } from 'express';
import { requestErrorHandler, errorHandler } from '../src/global';

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

describe('Test Global Error Handlers', () => {
    describe('requestErrorHandler', () => {
        it('Should call next', () => {
            err.name = 'Pew Pew Pew';

            requestErrorHandler(err, req, {} as Response, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(err);
        });

        it("Should 500 and return error msg 'Unhandled mongoose error'", () => {
            err.name = 'RequestError';
            err.statusCode = 4000;
            err.message = '';
            const res = mockResponse();

            requestErrorHandler(err, req, res, next);

            expect(res.status).toHaveBeenCalledWith(4000);
            expect(res.json).toHaveBeenCalledWith({
                error: { message: 'Unhandled mongoose error' },
            });
            expect(next).toHaveBeenCalledTimes(0);
        });

        it('Should 500 and return custom err msg', () => {
            err.name = 'RequestError';
            err.statusCode = 42;
            err.message = 'TLDR: Not Working';
            const res = mockResponse();

            requestErrorHandler(err, req, res, next);

            expect(next).toHaveBeenCalledTimes(0);
            expect(res.status).toHaveBeenCalledWith(42);
            expect(res.json).toHaveBeenCalledWith({
                error: { message: err.message },
            });
        });

        describe('errorHandler', () => {
            it('Should 500 and return errs', () => {
                const err = {
                    name: 'The Final Error',
                    statusCode: 500,
                    stack: 'gibberish stack trace',
                    message: 'Server will autodestruct in 10...',
                };
                const res = mockResponse();

                errorHandler(err, req, res);

                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({
                    error: { name: err.name, message: err.message, stack: err.stack },
                });
            });

            it('Should 418 (Tea Pot) and return custom err msg', () => {
                err.statusCode = 428;
                err.message = "I'm a teapot";
                const res = mockResponse();

                errorHandler(err, req, res);

                expect(res.status).toHaveBeenCalledWith(428);
                expect(res.json).toHaveBeenCalledWith({
                    error: { message: err.message },
                });
            });
        });
    });
});

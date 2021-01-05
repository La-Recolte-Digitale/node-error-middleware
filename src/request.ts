import { Response } from 'express';

class RequestError extends Error {
    public statusCode: number;

    constructor(message: string, name: string, statusCode: number) {
        super();
        this.name = name;
        this.message = message;
        this.statusCode = statusCode || 500;
        Object.setPrototypeOf(this, RequestError.prototype);
    }

    output(): { message: string; name?: string; stack?: string } {
        if (this.statusCode === 500)
            return {
                name: this.name,
                stack: this.stack,
                message: this.message,
            };
        else {
            return {
                message: this.message,
            };
        }
    }
}

class BadRequestError extends RequestError {
    constructor(message?: string) {
        super(message || 'Bad request error', 'BadRequest', 400);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

class ValidationError extends RequestError {
    constructor(message?: string) {
        super(message || 'Validation error', 'ValidationError', 400);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

class NotFoundError extends RequestError {
    constructor(message?: string) {
        super(message || 'Not found error', 'NotFound', 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

class UnauthorizedError extends RequestError {
    constructor(message?: string) {
        super(message || 'Unauthorized error', 'Unauthorized', 401);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

class ForbiddenError extends RequestError {
    constructor(message?: string) {
        super(message || 'Forbidden error', 'Forbidden', 403);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

class UnprocessableEntityError extends RequestError {
    constructor(message?: string) {
        super(message || 'Unprocessable entity error', 'UnprocessableEntity', 422);
        Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
    }
}

const isRequestError = (err: Error): err is RequestError => err instanceof RequestError;

const handleRequestError = (err: RequestError, res: Response): void => {
    res.status(err.statusCode).json({ error: err.output() });
};

export {
    RequestError,
    NotFoundError,
    ForbiddenError,
    BadRequestError,
    ValidationError,
    UnauthorizedError,
    UnprocessableEntityError,
    isRequestError,
    handleRequestError,
};

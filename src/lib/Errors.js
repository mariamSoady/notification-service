'use strict';

class IllegalArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IllegalArgument';
    }
}

class UnimplementedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Unimplemented';
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Validation';
    }
}

class UnsupportedTypeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnsupportedType';
    }
}

class RateLimitError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RateLimit';
    }
}

module.exports = {
    IllegalArgumentError,
    UnimplementedError,
    ValidationError,
    UnsupportedTypeError,
    RateLimitError,
};

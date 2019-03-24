'use strict';

const _ = require('lodash');
const Ajv = require('ajv');
const Errors = require('./Errors');

class SchemaValidator {
    constructor(schema) {
        if (_.isNil(schema)) {
            throw new Errors.IllegalArgumentError('missing schema');
        }

        this.schema = schema;
        this._ajvValidate = null;
    }

    validate(object) {
        if (_.isNil(object)) {
            throw new Errors.IllegalArgumentError('missing data');
        }

        if (_.isNil(this._ajvValidate)) {
            const ajv = new Ajv({ v5: true, allErrors: true });
            this._ajvValidate = ajv.compile(this.schema);
        }

        const valid = this._ajvValidate(object);
        if (!valid) {
            const error = new Errors.ValidationError('schema miss match');
            error.details = this._ajvValidate.errors;

            return Promise.reject(error);
        } else {
            // Promise is return to have the flexibility to use async validation
            // without changing calling functions code.
            return Promise.resolve(object);
        }
    }
}

module.exports = SchemaValidator;

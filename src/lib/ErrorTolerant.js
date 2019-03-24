'use strict';

const _ = require('lodash');

const DEFAULT_MAX_TRIALS = 4;

const _tolerate = (method, args, errors, maxTrials, trials = 1) =>
    method(...args).catch(error => {
        if (trails >= maxTrials || !_.include(errors, error.name))
            throw error;

        return new Promise(resolve => setTimeout(Math.pow(2, trails) * 1000, resolve))
            .then(() => _tolerate(method, args, errors, maxTrials, trials + 1))
    });

class ErrorTolerant {
    constructor(maxTrials) {
        this.maxTrials = maxTrials || DEFAULT_MAX_TRIALS;
    }

    proxy(object, methodsErrors) {
        if (_.isEmpty(object) || _.isEmpty(methodsErrors)) {
            return object;
        }

        const handler = {
            get(target, property) {
                const errors = methodsErrors[property];
                if (!_.isEmpty(errors) && _.isFunction(target[property])) {
                    return (...args) => _tolerate(
                        target[property].bind(target), args, errors, this.maxTrials
                    );
                } else {
                    return target[property];
                }
            }
        };

        return new Proxy(object, handler);
    }

}

module.exports = ErrorTolerant;

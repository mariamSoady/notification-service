'use strict';

const _ = require('lodash');
const Errors = require('../lib/Errors');

const methodsErrors = {
    send: ['RateLimit'],
};

class Notification {
    constructor(deps) {
        if (_.isNil(deps) ||
            !_.isArray(deps.notifiers) ||
            _.isEmpty(deps.notifiers) ||
            _.isNil(deps.validator)
        ) {
            throw new Errors.IllegalArgumentError('missing dependencies');
        }

        this.notifiers = deps.notifiers;
        this.validator = deps.validator;

        if (!_.isNil(deps.error_tolerat)) {
            this.notifiers = this.notifiers.map(
                notifier => deps.error_tolerat.proxy(notifier, methodsErrors)
            );
        }
    }

    process(request) {
        return this.validator.validate(request)
            .then(request => {
                const notifier = _.find(
                    this.notifiers,
                    aNotifier => request.type === aNotifier.getType()
                );

                if (_.isNil(notifier)) {
                    throw new Errors.UnsupportedTypeError();
                }

                return notifier.send(request);
            });
    }
}

module.exports = Notification;

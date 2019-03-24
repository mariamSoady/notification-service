'use strict';

const _ = require('lodash');
const Errors = require('../lib/Errors');

class Messenger {
    constructor(deps) {
        if (_.isNil(deps) || _.isNil(deps.sqs) || !_.isFunction(deps.handler)) {
            throw new Errors.IllegalArgumentError('missing dependencies');
        }

        this.sqs = deps.sqs;
        this.handler = deps.handler;
    }

    pullMessage() {
        let aMessage;
        return this.sqs.receive()
            .then(message => {
                aMessage = message;
                return handler(message.data);
            })
            .then(() => this.sqs.deleteMessage(aMessage.id));
    }
}

module.exports = Messenger;

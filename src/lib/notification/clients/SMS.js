'use strict';

const _ = require('lodash');
const Errors = require('../../Errors');
const BaseNotifier = require('../BaseNotifier');

class SMS extends BaseNotifier {
    constructor(config) {
        super(config);

        if (_.isNil(config)) { //TODO check other req props
            throw new Errors.IllegalArgumentError('missing SNS config');
        }

        // this is a mock to client supporting mobile SMS service,
        // like AWS SNS or ..., real client will be created using config param
        this.client = {
            push(from, to, text) {
                return Promise.resolve({
                    from,
                    to,
                    body: text,
                    message_id: _.random(1000),
                });
            }
        }
    }

    getType() {
        return 'SMS';
    }

    send(request) {
        return this.client.push(request.from, request.to, request.text)
            .catch(error => this._wrapErrorResponse(error));
    }

    _wrapErrorResponse(response) {
        //This function will throw lib specific errors like RateLimitError
        //so, it's handled by fault tolerace lib.
        throw response;
    }
}

module.exports = SMS;

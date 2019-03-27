'use strict';

const Errors = require('../Errors');

/**
 * describes how a notification client should be implemented
 * @abstract
 */
class BaseNotifier {
    getType() {
        throw new Errors.UnimplementedError('unimplemented method `type`');
    }

    /**
    * describes how a data platform client should be implemented
    * @param {Object} request matching notification request schema
    * @return a promise that resolve to provider reponse state
    */
    send(request) {
        throw new Errors.UnimplementedError('unimplemented method `send`');
    }
}

module.exports = BaseNotifier;

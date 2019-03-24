'use strict';

const _ = require('lodash');
const Errors = require('../Errors');

class BaseNotifier {
    getType() {
        throw new Errors.UnimplementedError('unimplemented method `type`');
    }
    
    send(request) {
        throw new Errors.UnimplementedError('unimplemented method `send`');
    }
}

module.exports = BaseNotifier;

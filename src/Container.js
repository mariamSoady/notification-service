'use strict';

const _ = require('lodash');

class ContainerIllegaArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ContainerIllegaArgument';
    }
}

class ContainerServiceNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ContainerServiceNotFound';
    }
}

/**
 * all services container, that store or return services identified by id
 */
class Container {
    constructor() {
        this.services = {};
    }

    defineService(serviceId, factory) {
        if (!_.isString(serviceId) || !_.isFunction(factory)) {
            throw new ContainerIllegaArgumentError(
                'serviceId must be string and factory be function'
            );
        }

        this.services[serviceId] = factory(this);
    }

    getService(serviceId) {
        if (_.isNil(this.services[serviceId])) {
            throw new ContainerServiceNotFoundError(
                `no service was found for ${serviceId}`
            );
        }

        return this.services[serviceId];
    }
}

module.exports = Container;

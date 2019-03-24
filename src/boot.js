'use strict';

const _ = require('lodash');
const Container = require('./Container');

module.exports = (config, di) => {
    const env = process.env.NODE_ENV || 'development';
    const container = new Container();

    const servicesDefinition = di(config[env] || {});
    _.forOwn(
        servicesDefinition,
        (definition, id) => container.defineService(id, definition)
    });

    return container;
};

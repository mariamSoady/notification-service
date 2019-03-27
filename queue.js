'use strict';

const boot = require('./src/boot');

const container = boot(require('./config'), require('./src/di'));
const messenger = container.getService('notification.messenger');

/**
 * this is the entry point to run service, it listens to queue and process requests
 */
const execute = () => {
        messenger.pullMessage().then(response => {
            //TODO log success to logger-service
            process.nextTick(execute);
        }).catch(err => {
            //TODO log error to logger-service
            process.nextTick(execute);
        });
    };

process.nextTick(execute);

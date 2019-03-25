'use strict';

const Notification = require('./services/Notification');
const Messenger = require('./services/Messenger');

const clients = require('./lib/notification/clients');
const SchemaValidator = require('./lib/SchemaValidator');
const ErrorTolerant = require('./lib/ErrorTolerant');

const SQS = require('./lib/SQS');

const requestSchema = require('./services/schema/requestSchema');

module.exports = config => {
    return {

        'notification.clients': () => [
            new clients.PushNotification(config.clients.push_notification),
            new clients.SMS(config.clients.SMS),
        ],

        'notification.validator': () => new SchemaValidator(requestSchema),

        'notification.error.tolerant': () => new ErrorTolerant(config.error_max_trials),

        'notification.service': container => new Notification({
            validator: container.getService('notification.validator'),
            notifiers: container.getService('notification.clients'),
            error_tolerat: container.getService('notification.error.tolerant'),
        }),

        'notification.messenger': container => new Messenger({
            sqs: new SQS(config.sqs),
            handler: request => container.getService('notification.service').process(request),
        }),
    }
};

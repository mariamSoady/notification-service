'use strict';

/**
 * schema defines request object, it's concerned with data required to locate
 * designated user and content to be sent to, it's not aware of other business logic
 * regarding user/group domains, it only provide what this service handle that is
 * one specific concern, send notification.
 */

module.exports = {
    id: '/schemas/notification-service/request',
    title: 'Notification Service Request Schema',

    type: 'object',
    required: ['type', 'user', 'text'],
    additionalProperties: false,

    properties: {
        type: {
            enum: ['SMS', 'push_notification'],
        },

        // TODO user could be oneOf string or array of strings that will need
        // to track notifications sent before error happened, and continue from there
        // when retry
        user: {
            $ref: '#/definitions/non_empty_string',
        },

        text: {
            $ref: '#/definitions/non_empty_string',
        },

        title: {
            $ref: '#/definitions/non_empty_string',
        }
    },

    definitions: {
        non_empty_string: {
            type: 'string',
            minLength: 1,
        }
    }
};

'use strict';

module.exports = {
    id: '/schemas/notification-service/request',
    title: 'Notification Service Request Schema',

    type: 'object',
    required: ['type', 'to', 'text'],
    additionalProperties: false,

    properties: {
        type: {
            enum: ['SMS', 'push_notification'],
        },

        to: {
            $ref: '#/definitions/string_digits',
        },

        text: {
            $ref: '#/definitions/non_empty_string',
        },

        from: {
            $ref: '#/definitions/string_digits',
        }
    },

    definitions: {
        string_digits: {
            type: 'string',
            pattern: '^[0-9]+$',
        },

        non_empty_string: {
            type: 'string',
            minLength: 1,
        }
    }
};

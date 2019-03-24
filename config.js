'use strict';

module.exports = {
    development: {
        sqs: {
            access_key: process.env.SQS_ACCESS_KEY,
            access_token: process.env.SQS_ACCESS_TOKEN,
            uri: process.env.SQS_QUEUE_URI,
        },

        clients: {
            SMS: {

            },

            push_notification: {

            },
        },

        error_max_trials: 5,
    }
};

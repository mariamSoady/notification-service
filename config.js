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
                app_id: process.env.SMS_APP_ID,
                app_secret: process.env.SMS_APP_SECRET,
            },

            push_notification: {
                app_token: process.env.PUSH_NOTIFICATION_APP_TOKEN,
            },
        },

        error_max_trials: 5,
    }
};

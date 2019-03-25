'use strict';

const _ = require('lodash');
const AWS = require('aws-sdk');

const{ IllegalArgumentError } = require('./Errors');

// default queue region
const DEFAULT_REGION = 'us-east-1';
// wait 10 seconds if there is no messages
const DEFAULT_QUEUE_WAIT_TIME = 10;

class SQS {
    constructor(config) {
        if(!_.isPlainObject(config) ||
            !_.isString(config.access_key) ||
            !_.isString(config.access_token) ||
            !_.isString(config.uri)) {
            throw new SQSQueueIllegalArgumentError(
                'missing access key / access token / queue uri'
            );
        }

        this.simpleQueueService = new AWS.SQS({
            accessKeyId: config.access_key,
            secretAccessKey: config.access_token,
            region: _.isString(config.region) ? config.region : DEFAULT_REGION,
        });

        this._queue = config.uri;
    }

    receive() {
        return this.simpleQueueService.receiveMessage({
            QueueUrl: this._queue,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: DEFAULT_QUEUE_WAIT_TIME,
        })
            .promise()
            .then(response => {
                const message = response.Messages[0];
                try {
                    message.Body = JSON.parse(message.Body);
                } catch(err) { /* Do Nothing */ }

                return { id: message.ReceiptHandle, data: message.Body };

            });
    }

    delete(messageId) {
        if(!_.isString(messageId)) {
            throw new IllegalArgumentError('invalid message id');
        }

        return this.simpleQueueService.deleteMessage({
            QueueUrl: this._queue,
            ReceiptHandle: messageId,
        }).promise()
            .then(response => response.ResponseMetadata.RequestId);
    }
}

module.exports = SQS;

'use strict';

const _ = require('lodash');

const Errors = require('../../src/lib/Errors');
const Container = require('../../src/Container');
const Messenger = require('../../src/services/Messenger');

const config = require('../../config').development;

const expect = require('../resources/chai').expect;
const samples = require('../resources/samples');

describe('Messenger', () => {
    let messenger;
    let messageId;

    before(() => {
        const container = new Container();
        const servicesDefinition = require('../../src/di')(config);
        _.forOwn(
            servicesDefinition,
            (definition, id) => container.defineService(id, definition)
        );

        messenger = container.getService('notification.messenger');

        return messenger.sqs.simpleQueueService
            .purgeQueue({ QueueUrl: messenger.sqs._queue })
            .promise()
            .catch(err => {
                if(err.name === 'AWS.SimpleQueueService.PurgeQueueInProgress')
                    // wait for a minute before next purge,
                    return new Promise(resolve => setTimeout(resolve, 60000))
                        .then(
                            () => messenger.sqs.simpleQueueService
                                .purgeQueue({ QueueUrl: messenger.sqs._queue })
                                .promise()
                        )
                else
                    throw err;
            })
            .then(
                () => messenger.sqs.simpleQueueService
                    .sendMessage({
                        MessageBody: JSON.stringify(samples.sms),
                        QueueUrl: messenger.sqs._queue
                    })
                    .promise()
                    .then(response => messageId = response.MessageId)
            );
    });

    describe('constructor', () => {
        it('should create notification service successfully', () => {
            expect(messenger).to.be.instanceOf(Messenger);
        });

        it('should throw error when missing dependencies', () => {
            const fn = () => new Messenger();
            expect(fn).to.throw(Error)
                .that.is.instanceOf(Errors.IllegalArgumentError)
                .and.have.property('message')
                .that.equals('missing dependencies');
        });
    });

    describe('pullMessage', () => {
        it('should pull a message and process it',
            () => messenger.pullMessage()
                .then(response => {
                    expect(response).to.be.a('string');
                    //TODO use mocha spy to detect if notifier send function is called
                })
        );
    });
});

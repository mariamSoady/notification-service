'use strict';

const _ = require('lodash');

const Errors = require('../../src/lib/Errors');
const Container = require('../../src/Container');
const Notification = require('../../src/services/Notification');

const config = require('../../config').development;

const expect = require('../resources/chai').expect;
const samples = require('../resources/samples');

describe('Notification', () => {
    let notification;

    before(() => {
        const container = new Container();
        const servicesDefinition = require('../../src/di')(config);
        _.forOwn(
            servicesDefinition,
            (definition, id) => container.defineService(id, definition)
        );

        notification = container.getService('notification.service');
    });

    describe('constructor', () => {
        it('should create notification service successfully', () => {
            expect(notification).to.be.instanceOf(Notification);
        });

        it('should throw error when missing dependencies', () => {
            const fn = () => new Notification();
            expect(fn).to.throw(Error)
                .that.is.instanceOf(Errors.IllegalArgumentError)
                .and.have.property('message')
                .that.equals('missing dependencies');
        });
    });

    describe('process', () => {
        it('should notifiy through SMS',
            () => notification.process(samples.sms)
                .then(response => {
                    expect(response).to.be.an('object');
                    expect(response.message_id).to.be.a('number');
                })
        );

        it('should notifiy through push notification',
            () => notification.process(samples.push_notification)
                .then(response => {
                    expect(response).to.be.an('object');
                    expect(response.message_id).to.be.a('number');
                })
        );

        it('should throw error if request is missig', () => {
            const fn = () => notification.process();
            expect(fn).to.throw(Error).that.is.instanceOf(Errors.IllegalArgumentError);
        });

        it('should throw error if type is missing', () => {
            const promise = notification.process(_.omit(samples.sms, 'type'));
            return expect(promise).to.be.eventually
                .rejected.instanceOf(Errors.ValidationError);
        });

        it('should throw error if text is missing', () => {
            const promise = notification.process(_.omit(samples.sms, 'text'));
            return expect(promise).to.be.eventually
                .rejected.instanceOf(Errors.ValidationError);
        });

        it('should throw error if to is missing', () => {
            const promise = notification.process(_.omit(samples.sms, 'to'));
            return expect(promise).to.be.eventually
                .rejected.instanceOf(Errors.ValidationError);
        });

        it('should throw error if to is invalid', () => {
            const promise = notification.process(
                _.extend({}, samples.sms, { to: '(3444) 9000' })
            );

            return expect(promise).to.be.eventually
                .rejected.instanceOf(Errors.ValidationError);
        });

        it('should throw error if from is invalid', () => {
            const promise = notification.process(
                _.extend({}, samples.sms, { from: '(3444) 9000' })
            );

            return expect(promise).to.be.eventually
                .rejected.instanceOf(Errors.ValidationError);
        });
    });
});

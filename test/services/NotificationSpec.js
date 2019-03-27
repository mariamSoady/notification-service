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
    let notifiers;
    let validator;

    before(() => {
        const container = new Container();
        const servicesDefinition = require('../../src/di')(config);
        _.forOwn(
            servicesDefinition,
            (definition, id) => container.defineService(id, definition)
        );

        notification = container.getService('notification.service');
        notifiers = container.getService('notification.clients');
        validator = container.getService('notification.validator');
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

        it('should throw error when missing notifiers', () => {
            const fn = () => new Notification({ validator });
            expect(fn).to.throw(Error)
                .that.is.instanceOf(Errors.IllegalArgumentError)
                .and.have.property('message')
                .that.equals('missing dependencies');
        });

        it('should throw error when missing validator', () => {
            const fn = () => new Notification({ notifiers });
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

        it('should throw error if unsupported type', () => {
            const promise = notification.process(_.extend(samples.sms, { type: 'xx' }));
            return expect(promise).to.be.eventually
                .rejected.instanceOf(Errors.ValidationError);
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

        it('should throw error if user is missing', () => {
            const promise = notification.process(_.omit(samples.sms, 'user'));
            return expect(promise).to.be.eventually
                .rejected.instanceOf(Errors.ValidationError);
        });

        it('should throw error if user is invalid', () => {
            const promise = notification.process(
                _.extend({}, samples.sms, { user: 23444 })
            );

            return expect(promise).to.be.eventually
                .rejected.instanceOf(Errors.ValidationError);
        });

        it('should throw error if title is invalid', () => {
            const promise = notification.process(
                _.extend({}, samples.sms, { title: { val: 'once upon time' } })
            );

            return expect(promise).to.be.eventually
                .rejected.instanceOf(Errors.ValidationError);
        });
    });
});

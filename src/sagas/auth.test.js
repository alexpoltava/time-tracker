import { put, call, cancelled } from 'redux-saga/effects';
import { cloneableiterator, createMockTask } from 'redux-saga/utils';

import 'babel-polyfill';
import api from '../api';

import { auth,
         authWithGoogleAccount,
         restoreAuth,
         loginFlow,
         syncAuthState,
         createAuthChannel,
         updatedAuthState, } from './auth.js';

import { LOGIN_REQUEST,
          LOGIN_SUCCESS,
          LOGIN_FAILURE,
          LOGOUT_REQUEST,
          LOGOUT_SUCCESS,
          LOGIN_WITH_GOOGLE_REQUEST,
          LOGIN_WITH_GOOGLE_FAILURE, } from '../actions';

import session from '../components/utils/session';

import { expect } from 'chai';

describe('auth', () => {
    const payload = { user: 'testuser', password: 'test1234' };
    const iterator = auth(payload);
    it('should call api.login function with user/password', () => {
        const result = iterator.next().value;
        expect(result).to.be.deep.equal(call(api.login, payload));
    });
    it('should handle thrown error', () => {
        const error = new Error('error');
        expect(iterator.throw(error).value).to.deep.equal(put({ type: LOGIN_FAILURE, error: error.message }));
    });
    it('should handle cancel()', () => {
        expect(iterator.return().value).to.deep.equal(cancelled());
        expect(iterator.next(true).value).to.deep.equal(put({ type: LOGIN_FAILURE, error: 'cancelled' }));
    });
});

describe('syncAuthState', () => {
    describe('with user passed', () => {
        const user = { email: 'testuser@test.test', name: 'testuser' };
        const iterator = syncAuthState(user);
        it('should put an action LOGIN_SUCCESS', () => {
            const result = iterator.next().value;
            expect(result).to.deep.equal(put({ type: LOGIN_SUCCESS, payload: { user } }));
        });

        // it('should fork updatedDbState function with user id', () => {});
        // it('shoud put an action '')
        // it('should call saveSession function', () => {
        //     const result = iterator.next().value;
        //     expect(result).to.deep.equal(call(session.saveSession, user));
        // });
        // it('should be done', () => {
        //     expect(iterator.next().done).true;
        // });
    });
    describe('with no user passed', () => {
        const iterator = syncAuthState(null);
        it('should put an action LOGOUT_SUCCESS', () => {
            const result = iterator.next().value;
            expect(result).to.deep.equal(put({ type: LOGOUT_SUCCESS }));
        });
        it('should call clearSession function', () => {
            const result = iterator.next().value;
            expect(result).to.deep.equal(call(session.clearSession));
        });
        it('should be done', () => {
            expect(iterator.next().done).true;
        });
    });
});

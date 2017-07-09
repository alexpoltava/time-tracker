import { take, call, put, cancelled, fork, cancel } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { firebaseAuth } from '../config/constants';
import api from '../api';
import session from '../components/utils/session';

import { LOGIN_REQUEST,
         LOGIN_SUCCESS,
         LOGIN_FAILURE,
         LOGOUT_REQUEST,
         LOGOUT_SUCCESS,
         LOGIN_WITH_GOOGLE_REQUEST,
         LOGIN_WITH_GOOGLE_FAILURE } from '../actions';


export function* auth(payload) {
    try {
        yield call(api.login, payload);
    } catch (error) {
        yield put({ type: LOGIN_FAILURE, error: error.message });
    } finally {
        if (yield cancelled()) {
            yield put({ type: LOGIN_FAILURE, error: 'cancelled' });
        }
    }
}

export function* authWithGoogleAccount() {
    try {
        const result = yield call(api.loginWithGoogleAccount);
        if (api.isUserExist) {
            yield call(api.saveUser, result.user);
        }
    } catch (error) {
        yield put({ type: LOGIN_WITH_GOOGLE_FAILURE, error: error.message });
    } finally {
        if (yield cancelled()) {
            yield put({ type: LOGIN_WITH_GOOGLE_FAILURE, error: 'cancelled' });
        }
    }
}

export function* restoreAuth() {
    const credential = yield call(session.extractSession);
    if (credential) {
        try {
            switch (credential.providerId) {
                case 'google.com':
                    yield call(api.signInWithGoogleCredential, credential);
                    break;
                case 'password':
                    yield call(api.signInWithCredential, credential);
                    break;
                default:
            }
      } catch (error) {
          yield put({ type: LOGIN_FAILURE, error: error.message });
      }
    }
}

export function* loginFlow() {
    yield call(restoreAuth);
    while (true) {
        const loginAction = yield take([LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_WITH_GOOGLE_REQUEST]);
        let task = null;
        if (loginAction.type === LOGIN_REQUEST) {
            const { payload } = loginAction;
            task = yield fork(auth, payload);
        } else if (loginAction.type === LOGIN_WITH_GOOGLE_REQUEST) {
            task = yield fork(authWithGoogleAccount);
        }
        const logoutAction = yield take([LOGOUT_REQUEST, LOGIN_FAILURE, LOGIN_WITH_GOOGLE_FAILURE]);
        if (logoutAction.type === LOGOUT_REQUEST) {
            if (task) {
                yield cancel(task);
            }
            yield call([session.clearSession, api.logout]);
        }
    }
}

// Callbacks from  firebase
export function* syncAuthState(user) {
    if (user) {
        yield put({ type: LOGIN_SUCCESS, payload: { user } });
        yield call(session.saveSession, user);
    } else {
        yield put({ type: LOGOUT_SUCCESS });
        yield call(session.clearSession);
    }
}

export function createAuthChannel() {
    const authListener = eventChannel((emit) => {
        const unsubscribe = firebaseAuth().onAuthStateChanged(
            user => emit({ user }),
            error => emit({ error })
        );
        return unsubscribe;
    });
    return authListener;
}

export function* updatedAuthState() {
    const authStateListener = createAuthChannel();
    while (true) {
        const { user, error } = yield take(authStateListener);
        yield call(syncAuthState, user);
    }
}

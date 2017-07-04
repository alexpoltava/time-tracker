import { takeLatest, take, call, put, cancelled, eventChannel, fork, cancel } from 'redux-saga/effects';
import firebaseAuth from '../config/constants';
import api from '../api';
import session from '../components/utils/session';

import { LOGIN_REQUEST,
         LOGIN_SUCCESS,
         LOGIN_FAILURE,
         LOGOUT_REQUEST,
         LOGOUT_SUCCESS } from '../actions';


function* auth(user, password) {
    try {
        yield put({ type: LOGIN_REQUEST });
        yield call(api.login, user, password);
    } catch (error) {
        yield put({ type: LOGIN_FAILURE, error });
    } finally {
        if (yield cancelled()) {
            yield put({ type: LOGIN_FAILURE, error: new Error('cancelled') });
        }
    }
}

export function* loginFlow() {
    while (true) {
        const { user, password } = yield take(LOGIN_REQUEST);
        const task = yield fork(auth, user, password);
        const action = yield take([LOGOUT_REQUEST, LOGIN_FAILURE]);
        if (action.type === LOGOUT_REQUEST) {
            yield cancel(task);
        }
        yield call(session.clearSession);
    }
}

function* syncAuthState(action) {
    if (action.type === LOGIN_SUCCESS) {
        yield put({ type: action.type, credentials: action.credentials });
        yield call(session.saveSession, { credentials: action.credentials });
    } else if (action.type === LOGOUT_SUCCESS) {
        yield put({ type: action.type });
        yield call(session.clearSession, { credentials: action.credentials });
    }
}

export function* authSaga() {
    const authListener = eventChannel((emit) => {
        const unsubscribe = firebaseAuth().onAuthStateChanged(
            user => emit({ user }),
            error => emit({ error })
        );
        return unsubscribe;
    });
    try {
        yield takeLatest(authListener, syncAuthState);
    } finally {
        if (yield cancelled()) {
            authListener.close();
        }
    }
}

import { take, call, put, cancelled, fork, cancel, select, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { firebaseAuth } from '../config/constants';
import api from '../api';
import session from '../components/utils/session';

import { updatedDbState } from './database';

import { LOGIN_REQUEST,
         LOGIN_SUCCESS,
         LOGIN_FAILURE,
         LOGOUT_REQUEST,
         LOGOUT_SUCCESS,
         LOGOUT_FAILURE,
         LOGIN_WITH_GOOGLE_REQUEST,
         LOGIN_WITH_GOOGLE_FAILURE,
         RESTORE_AUTH,
         START_DB_LISTENER,
         STOP_DB_LISTENER,
         CLEAR_ALL_TASKS,
         KILL_TIMER_TASKS, } from '../actions';


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
    yield put({ type: RESTORE_AUTH });
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

export function* forkDBSyncTask(uid) {
    const dbSyncTask = yield fork(updatedDbState, uid);
    yield put({ type: START_DB_LISTENER, payload: { dbSyncTask } });
}

export function* killDBSyncTask() {
    const getDBSyncTask = state => state.session.dbSyncTask;
    const dbSyncTask = yield select(getDBSyncTask);
    if (dbSyncTask && dbSyncTask.isRunning()) {
        yield cancel(dbSyncTask);
        yield put({ type: STOP_DB_LISTENER });
    }
    yield put({ type: CLEAR_ALL_TASKS });
}

export function* killTimerTasks() {
    const timerTasks = yield select(state => state.session.timerTasks);
    if (timerTasks.length) {
        yield all(timerTasks.map(timer => timer.cancel()));
        yield put({ type: KILL_TIMER_TASKS });
    }
    yield put({ type: 'CLEAR_ALL_TIMERS' });
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
            try {
                yield call(killDBSyncTask);
                yield call(killTimerTasks);
                yield call([session.clearSession, api.logout]);
            } catch (error) {
                yield put({ type: LOGOUT_FAILURE, error: error.message });
            }
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
        const { user } = yield take(authStateListener);
        yield call(syncAuthState, user);
    }
}

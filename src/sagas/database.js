import { take, takeEvery, call, put, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ref } from '../config/constants';
import api from '../api';


import { ADD_TASK,
          REMOVE_TASK,
          TASK_ADDED,
          TASK_REMOVED } from '../actions';


function* addTask(action) {
    try {
        yield call(api.dbAddNewTask, action.payload);
    } catch (error) {

    }
}

function* waitAddTask() {
    yield takeEvery(ADD_TASK, addTask);
}

function* removeTask(action) {
    try {
        yield call(api.dbTaskRemove, action.payload.id);
    } catch (error) {

    }
}

function* waitRemoveTask() {
    yield takeEvery(REMOVE_TASK, removeTask);
}


export function* processOperations() {
    yield fork(waitAddTask);
    yield fork(waitRemoveTask);
}

// Callbacks from  firebase
export function* syncDbState(key, val) {
    if (val) {
        yield put({ type: 'TIMER_ADD', payload: { id: key } });
        yield put({ type: TASK_ADDED, payload: { key, val } });
    } else {
        yield put({ type: 'TIMER_REMOVE', payload: { id: key } });
        yield put({ type: TASK_REMOVED, payload: { key } });
    }
}

export function createDbChannel(uid) {
    const dbListener = eventChannel((emit) => {
        ref.child(`users/${uid}/tasks/`)
        .on(
            'child_added',
            childSnapshot => emit({ key: childSnapshot.key, val: childSnapshot.val() })
        );
        ref.child(`users/${uid}/tasks/`)
        .on(
            'child_removed',
            childSnapshot => emit({ key: childSnapshot.key })
          );
        return () => ref.off(dbListener);
    });
    return dbListener;
}

export function* updatedDbState(uid) {
    const dbStateListener = createDbChannel(uid);
    while (true) {
        const { key, val } = yield take(dbStateListener);
        yield call(syncDbState, key, val);
    }
}

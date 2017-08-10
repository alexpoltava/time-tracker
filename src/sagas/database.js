import { take, takeEvery, call, put, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ref } from '../config/constants';
import api from '../api';
import { forkDBSyncTask, killDBSyncTask } from './auth';

import { ADD_TASK,
          REMOVE_TASK,
          TASK_ADDED,
          TASK_REMOVED,
          UPDATE_TASK,
          TASK_UPDATED,
          CHANGE_DBSYNC_UID, } from '../actions';


function* addTask(action) {
    try {
        yield call(api.dbAddNewTask, action.payload);
    } catch (error) {
      console.error(error);
    }
}

function* waitUpdateTask() {
    yield takeEvery(UPDATE_TASK, updateTask);
}

function* updateTask(action) {
    try {
        yield call(api.dbUpdateTask, action.payload);
    } catch (error) {
      console.error(error);
    }
}

function* waitAddTask() {
    yield takeEvery(ADD_TASK, addTask);
}

function* removeTask(action) {
    try {
        yield call(api.dbTaskRemove, action.payload.id);
    } catch (error) {
      console.error(error);
    }
}

function* waitRemoveTask() {
    yield takeEvery(REMOVE_TASK, removeTask);
}

function* changeDBSyncUID(action) {
    try {
        yield call(killDBSyncTask);
        yield call(forkDBSyncTask, action.payload.uid);
    } catch (error) {
      console.error(error);
    }
}

function* waitChangeDBSyncUID() {
    yield takeEvery(CHANGE_DBSYNC_UID, changeDBSyncUID);
}


export function* processOperations() {
    yield fork(waitAddTask);
    yield fork(waitRemoveTask);
    yield fork(waitUpdateTask);
    yield fork(waitChangeDBSyncUID);
}

// Callbacks from  firebase
export function* syncDbState(type, key, val) {
    switch (type){
      case 'child_added': {
        const { isPaused, timeLogged, dateStart } = val;
        yield put({ type: 'TIMER_ADD', payload: { id: key, isPaused, timeLogged, dateStart, now: +Date.now() } });
        if(!isPaused) {
          yield put({ type: 'START', payload: { id: key, dateStart, timeLogged } });
        }
        yield put({ type: TASK_ADDED, payload: { key, val } });
        break;
      }
      case 'child_removed': {
        yield put({ type: TASK_REMOVED, payload: { key } });
        yield put({ type: 'TIMER_REMOVE', payload: { id: key } });
        break;
      }
      case 'child_changed': {
        const { isPaused, timeLogged, dateStart } = val;
        yield put({ type: TASK_UPDATED, payload: { key, val } });
        if(isPaused) {
          yield put({ type: 'STOP', payload: { id: key, dateStart, timeLogged } });
        } else {
          yield put({ type: 'START', payload: { id: key, dateStart, timeLogged } });
        }
      }
      default:
    }
}

export function createDbChannel(uid) {
    const dbListener = eventChannel((emit) => {
        ref.child(`users/${uid}/tasks/`)
        .on(
            'child_added',
            childSnapshot => emit({ type: 'child_added', key: childSnapshot.key, val: childSnapshot.val() })
        );
        ref.child(`users/${uid}/tasks/`)
        .on(
            'child_removed',
            childSnapshot => emit({ type: 'child_removed', key: childSnapshot.key })
          );
        ref.child(`users/${uid}/tasks/`)
        .on(
            'child_changed',
            childSnapshot => emit({ type: 'child_changed', key: childSnapshot.key, val: childSnapshot.val()})
          );
        return () => ref.off(dbListener);
    });
    return dbListener;
}

export function* updatedDbState(uid) {
    const dbStateListener = createDbChannel(uid);
    while (true) {
        const { type, key, val } = yield take(dbStateListener);
        yield call(syncDbState, type, key, val);
    }
}

import { take, takeEvery, call, put, fork, cancelled, race } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { ref } from '../config/constants';
import api from '../api';
import { forkDBSyncTask, killDBSyncTask, killTimerTasks } from './auth';

import { ADD_TASK,
          REMOVE_TASK,
          TASK_ADDED,
          TASK_REMOVED,
          UPDATE_TASK,
          TASK_UPDATED,
          CHANGE_DBSYNC_UID,
          UPDATE_SETTINGS,
          SETTINGS_UPDATED, } from '../actions';


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

function* waitUpdateSettings() {
    yield takeEvery(UPDATE_SETTINGS, updateSettings);
}

function* updateSettings(action) {
    try {
        yield call(api.dbUpdateSettings, action.payload);
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
        yield call(killTimerTasks);
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
    yield fork(waitUpdateSettings);
}

// Callbacks from  firebase
export function* syncDbTaskState(type, key, val) {
    switch (type){
      case 'child_added': {
        const { isPaused, periods } = val;
        yield put({ type: 'TIMER_ADD', payload: { id: key, isPaused, periods, now: +Date.now() } });
        if(!isPaused) {
          yield put({ type: 'START', payload: { id: key, periods } });
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
        const { isPaused, periods } = val;
        yield put({ type: TASK_UPDATED, payload: { key, val } });
        yield put({ type: 'TICK', payload: {id: key, periods, now: +Date.now()} }); // update timer
        yield put({ type: isPaused ? 'STOP' : 'START', payload: { id: key, periods } });
      }
      default:
    }
}

export function createDbTaskChannel(uid) {
    const dbListener = eventChannel( emit => {
        const unsubscribeChildAdded = ref.child(`users/${uid}/tasks/`)
        .on(
            'child_added',
            childSnapshot => emit({ type: 'child_added', key: childSnapshot.key, val: childSnapshot.val() })
        );
        const unsubscribeChildRemoved = ref.child(`users/${uid}/tasks/`)
        .on(
            'child_removed',
            childSnapshot => emit({ type: 'child_removed', key: childSnapshot.key })
          );
        const unsubscribeChildChanged = ref.child(`users/${uid}/tasks/`)
        .on(
            'child_changed',
            childSnapshot => emit({ type: 'child_changed', key: childSnapshot.key, val: childSnapshot.val()})
          );
        const unsubscribe = () => {
            ref.child(`users/${uid}/tasks/`).off('child_added', unsubscribeChildAdded);
            ref.child(`users/${uid}/tasks/`).off('child_removed', unsubscribeChildRemoved);
            ref.child(`users/${uid}/tasks/`).off('child_changed', unsubscribeChildChanged);
        };
        return unsubscribe;
    });
    return dbListener;
}

export function* syncDbSettingsState(type, key, val) {
    console.log(type, key, val);
    switch (type){
      case 'child_added': {
        yield put({ type: SETTINGS_UPDATED, payload: { [key]: val } });
        break;
      }
      case 'child_removed': {
        console.log('settings child_removed');
        break;
      }
      case 'child_changed': {
        yield put({ type: SETTINGS_UPDATED, payload: { [key]: val } });
        break;
      }
      default:
    }
}

export function createDbSettingsChannel(uid) {
    const dbListener = eventChannel( emit => {
        const unsubscribeChildAdded = ref.child(`users/${uid}/settings/`)
        .on(
            'child_added',
            childSnapshot => emit({ type: 'child_added', key: childSnapshot.key, val: childSnapshot.val() })
        );
        const unsubscribeChildRemoved = ref.child(`users/${uid}/settings/`)
        .on(
            'child_removed',
            childSnapshot => emit({ type: 'child_removed', key: childSnapshot.key })
          );
        const unsubscribeChildChanged = ref.child(`users/${uid}/settings/`)
        .on(
            'child_changed',
            childSnapshot => emit({ type: 'child_changed', key: childSnapshot.key, val: childSnapshot.val()})
          );
        const unsubscribe = () => {
            ref.child(`users/${uid}/settings/`).off('child_added', unsubscribeChildAdded);
            ref.child(`users/${uid}/settings/`).off('child_removed', unsubscribeChildRemoved);
            ref.child(`users/${uid}/settings/`).off('child_changed', unsubscribeChildChanged);
        };
        return unsubscribe;
    });
    return dbListener;
}

export function* updatedDbState(uid) {
    const dbTaskStateListener = createDbTaskChannel(uid);
    const dbSettingsStateListener = createDbSettingsChannel(uid);
    while (true) {
      try {
        const { task, settings } = yield race({
            task: take(dbTaskStateListener),
            settings: take(dbSettingsStateListener)
        });
        if(task) {
            const { type, key, val } = task;
            yield call(syncDbTaskState, type, key, val);
        } else if (settings) {
            const { type, key, val } = settings;
            yield call(syncDbSettingsState, type, key, val);
        }
      } finally {
        if (yield cancelled()) {
            dbTaskStateListener.close();
            dbSettingsStateListener.close();
        }
      }
    }
}

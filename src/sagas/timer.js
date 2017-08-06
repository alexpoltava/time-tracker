import { take, takeEvery, call, put, race, actionChannel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { UPDATE_TASK } from '../actions';

function* handleStart(action) {
    if(action.payload.doNotUpdateTask) {
      // console.log('doNotUpdateTask');
    } else {
        yield put({ type: UPDATE_TASK, payload: { key: action.payload.id, isPaused: false, dateStart: +Date.now() } });
    }
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { stop, remove } = yield race({
            stop: take('STOP'),
            remove: take('TASK_REMOVED'),
            tick: call(delay, 1000),
        });
        if (stop) {
            if (action.payload.id === stop.payload.id) {
              const timeLogged = Math.floor(((+Date.now() - stop.payload.dateStart)) / 1000 + stop.payload.timeLogged);
              yield put({ type: UPDATE_TASK, payload: { key: action.payload.id, isPaused: true, timeLogged, dateStart: null } });
              break;
            }
        } else if (remove) {
            if (action.payload.id === remove.payload.key) break;
        } else {
            const timeElapsed = Math.floor((+Date.now() - action.payload.dateStart) / 1000  + action.payload.timeLogged);
            yield put({ type: 'TICK', payload: { id: action.payload.id, timeElapsed } });
        }
    }
}

export default function* root() {
    const channel = yield actionChannel('START');
    yield takeEvery(channel, handleStart);
}

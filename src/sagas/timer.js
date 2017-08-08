import { take, takeEvery, call, put, race, actionChannel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { UPDATE_TASK } from '../actions';

function* handleStart(action) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { stop, remove } = yield race({
            stop: take('STOP'),
            remove: take('TASK_REMOVED'),
            tick: call(delay, 1000),
        });
        if (stop) {
            if (action.payload.id === stop.payload.id) break;
        } else if (remove) {
            if (action.payload.id === remove.payload.key) break;
        } else {
            const timeElapsed = (+Date.now() - action.payload.dateStart) / 1000  + action.payload.timeLogged;
            yield put({ type: 'TICK', payload: { id: action.payload.id, timeElapsed } });
        }
    }
}

export default function* root() {
    const channel = yield actionChannel('START');
    yield takeEvery(channel, handleStart);
}

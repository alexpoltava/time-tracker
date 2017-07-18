import { take, takeEvery, call, put, race, actionChannel } from 'redux-saga/effects';
import { delay } from 'redux-saga';

function* handleStart(action) {
    // eslint-disable-next-line no-constant-condition
    console.log(action);
    while (true) {
        const { stop, remove } = yield race({
            stop: take('STOP'),
            remove: take('TASK_REMOVED'),
            tick: call(delay, 1000),
        });
        if (stop) {
            if (action.payload.id === stop.id) { break; }
        } else if (remove) {
            if (action.payload.id === remove.key) { break; }
        } else {
            yield put({ type: 'TICK', payload: { id: action.payload.id, now: Date.now() } });
        }
    }
}

export default function* root() {
    const channel = yield actionChannel('START');
    yield takeEvery(channel, handleStart);
}

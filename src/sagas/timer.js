import { take, call, put, race, actionChannel } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { action } from '../actions';

export default function* root() {
    const channel = yield actionChannel('START');

    while (yield take(channel)) {
        while (true) {
            const { stop } = yield race({
                stop: take('STOP'),
                tick: call(delay, 1000),
            });

            if (!stop) {
                yield put(action('TICK'));
            } else {
                break;
            }
        }
    }
}

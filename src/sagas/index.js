import { fork } from 'redux-saga/effects';

import timer from './timer';

function* mySaga() {
    yield fork(timer);
}

export default mySaga;

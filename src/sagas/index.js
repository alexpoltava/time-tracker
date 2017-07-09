import { fork } from 'redux-saga/effects';

import timer from './timer';
import { loginFlow, updatedAuthState } from './auth.js';


function* mySaga() {
    yield fork(loginFlow);
    yield fork(updatedAuthState);
    yield fork(timer);
}

export default mySaga;

import { fork } from 'redux-saga/effects';

import timer from './timer';
import { loginFlow, updatedAuthState } from './auth.js';
import { registerUser } from './register';


function* mySaga() {
    yield fork(loginFlow);
    yield fork(updatedAuthState);
    yield fork(timer);
    yield fork(registerUser);
}

export default mySaga;

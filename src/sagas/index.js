import { fork } from 'redux-saga/effects';

import timer from './timer';
import { loginFlow, updatedAuthState } from './auth';
import { registerUser } from './register';
import { processOperations } from './database';


function* mySaga() {
    yield fork(loginFlow);
    yield fork(updatedAuthState);
    yield fork(timer);
    yield fork(registerUser);
    yield fork(processOperations);
}

export default mySaga;

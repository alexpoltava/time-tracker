import { takeEvery, call, put } from 'redux-saga/effects';
import api from '../api';

import { REGISTER_REQUEST,
         REGISTER_SUCCESS,
         REGISTER_FAILURE } from '../actions';

export function* handleRegister(action) {
    try {
        const user = yield call(api.register, action.payload);
        yield call(api.saveUser, user);
        yield put({ type: REGISTER_SUCCESS });
    } catch (error) {
        yield put({ type: REGISTER_FAILURE, error: error.message });
    }
}

export function* registerUser() {
    yield takeEvery(REGISTER_REQUEST, handleRegister);
}

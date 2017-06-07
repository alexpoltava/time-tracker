import { combineReducers } from 'redux';
import {  LOGIN_REQUEST,
          LOGIN_SUCCESS,
          LOGIN_FAILURE,
          LOGOUT
      } from '../actions';

import timer from './timer';

const session = (state = { isLoggingIn: false, isLoggedIn: false, error: null }, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                isLoggingIn: true,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggingIn: false,
                isLoggedIn: true,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                isLoggingIn: false,
                isLoggedIn: false,
                error: action.error,
            };
        case LOGOUT:
            return {
                ...state,
                isLoggingIn: false,
                isLoggedIn: false
            };
        default:
            return state
    }
}


export default combineReducers({
    timer,
    session
});

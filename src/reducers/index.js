import { combineReducers } from 'redux';
import { LOGIN_REQUEST,
          LOGIN_SUCCESS,
          LOGIN_FAILURE,
          LOGIN_WITH_GOOGLE_REQUEST,
          LOGIN_WITH_GOOGLE_FAILURE,
          LOGOUT_REQUEST,
          LOGOUT_SUCCESS,
          LOGOUT_FAILURE,
          RESTORE_AUTH
      } from '../actions';

import timers from './timer';
import { task, tasks } from './task';

const session = (state = {
    isLoggingIn: false,
    isLoggingWithGoogleIn: false,
    isLoggedIn: false,
    isLoggingOut: false,
    error: null,
    user: {}
}, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                isLoggingIn: true,
            };
        case LOGIN_WITH_GOOGLE_REQUEST:
            return {
                ...state,
                isLoggingWithGoogleIn: true,
            };
        case LOGIN_WITH_GOOGLE_FAILURE:
            return {
                ...state,
                isLoggingWithGoogleIn: false,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggingIn: false,
                isLoggingWithGoogleIn: false,
                isLoggedIn: true,
                user: action.user,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                isLoggingIn: false,
                isLoggedIn: false,
                error: action.error,
            };
        case LOGOUT_REQUEST:
            return {
                ...state,
                isLoggingOut: true,
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isLoggingOut: false,
                isLoggedIn: false,
                user: {},
            };
        case RESTORE_AUTH:
            return state;
        default:
            return state;
    }
};


export default combineReducers({
    timers,
    task,
    tasks,
    session
});

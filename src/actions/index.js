import api from '../api';
import session from '../components/utils/session';

export const action = (type, params = {}) => (
    {
        type,
        ...params
    }
);

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGIN_WITH_GOOGLE_REQUEST = 'LOGIN_WITH_GOOGLE_REQUEST';
export const LOGIN_WITH_GOOGLE_FAILURE = 'LOGIN_WITH_GOOGLE_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const RESTORE_AUTH = 'RESTORE_AUTH';

export const logoutSuccess = () => ({ type: LOGOUT_SUCCESS });

export const logout = () => ({ type: LOGOUT_REQUEST });

export const loginSuccess = user => ({ user, type: LOGIN_SUCCESS });

export const login = (user, password) => ({ type: LOGIN_REQUEST, payload: { user, password } });

export const loginWithGoogleAccount = () => ({ type: LOGIN_WITH_GOOGLE_REQUEST });

export const ADD_TASK = 'ADD_TASK';
export const FETCH_REQUEST = 'FETCH_REQUEST';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';

export const TASK_ADDED = 'TASK_ADDED';
export const TASK_REMOVED = 'TASK_REMOVED';

export const addNewTask = payload => (dispatch) => {
    dispatch({ type: ADD_TASK });
    return api.dbAddNewTask(payload);
};

export const fetchTasksList = () => (dispatch) => {
    dispatch({ type: FETCH_REQUEST });
    return api.dbFetchTasks()
        .then(snap => (dispatch({ type: FETCH_SUCCESS, list: snap.val() })))
        .catch(error => (dispatch({ type: FETCH_FAILURE, error })));
};

export const taskRemove = key => () => api.dbTaskRemove(key);

export const taskAdded = (key, payload) => ({
    type: TASK_ADDED,
    key,
    payload
});

export const taskRemoved = key => ({
    type: TASK_REMOVED,
    key
});

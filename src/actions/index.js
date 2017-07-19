export const action = (type, params = {}) => ({ type, payload: { ...params } });

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGIN_WITH_GOOGLE_REQUEST = 'LOGIN_WITH_GOOGLE_REQUEST';
export const LOGIN_WITH_GOOGLE_FAILURE = 'LOGIN_WITH_GOOGLE_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const START_DB_LISTENER = 'START_DB_LISTENER';
export const STOP_DB_LISTENER = 'STOP_DB_LISTENER';

export const ADD_TASK = 'ADD_TASK';
export const REMOVE_TASK = 'REMOVE_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const TASK_ADDED = 'TASK_ADDED';
export const TASK_REMOVED = 'TASK_REMOVED';
export const TASK_UPDATED = 'TASK_UPDATED';

export const FETCH_REQUEST = 'FETCH_REQUEST';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_FAILURE = 'FETCH_FAILURE';

export const RESTORE_AUTH = 'RESTORE_AUTH';

export const logoutSuccess = () => ({ type: LOGOUT_SUCCESS });

export const register = (email, password) => ({ type: REGISTER_REQUEST, payload: { email, pw: password } });

export const logout = () => ({ type: LOGOUT_REQUEST });

export const loginSuccess = payload => ({ type: LOGIN_SUCCESS, payload });

export const login = (email, password) => ({ type: LOGIN_REQUEST, payload: { email, pw: password } });

export const loginWithGoogleAccount = () => ({ type: LOGIN_WITH_GOOGLE_REQUEST });

export const addTask = payload => ({ type: ADD_TASK, payload });

export const removeTask = key => ({ type: REMOVE_TASK, payload: { id: key } });

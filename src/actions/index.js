import { api } from '../api';

export const action = (type, params = {}) => (
    {
        type,
        ...params
    }
);

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT = 'LOGOUT';


export const logout = () => {
  dispatch({
      type: LOGOUT
  });
  return api.logout();
}

export const loginSuccess = (user) => {
    return {
        user: user,
        type: LOGIN_SUCCESS
    };
}

export const login = (login, password) => dispatch => {
    dispatch({
        type: LOGIN_REQUEST,
    });

    return api.login(email, password)
        .then(
            data => (
                dispatch(loginSuccess(data.user))
            ),
            error => (
                dispatch({
                    error,
                    type: LOGIN_FAILURE
                })
            ),
        );
};

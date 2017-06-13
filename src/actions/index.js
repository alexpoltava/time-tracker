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

export const logoutSuccess = () => ({
    type: LOGOUT_SUCCESS
});

export const logout = () => (dispatch) => {
    session.clearSession();
    dispatch({
        type: LOGOUT_REQUEST
    });
    return api.logout()
        .then(
            null,
            error => (
                dispatch({
                    error,
                    type: LOGOUT_FAILURE
                })
            ),
        );
};


export const loginSuccess = user => ({
    user,
    type: LOGIN_SUCCESS
});

export const login = (email, password) => (dispatch) => {
    dispatch({
        type: LOGIN_REQUEST
    });

    return api.login(email, password)
        .then(
            null,
            error => (
                dispatch({
                    error,
                    type: LOGIN_FAILURE
                })
            ),
        );
};

export const loginWithGoogleAccount = () => (dispatch) => {
    dispatch({
        type: LOGIN_WITH_GOOGLE_REQUEST
    });
    return api.loginWithGoogleAccount()
        .then((result) => {
            session.saveSession(result.credential);
        },
            error => (
                dispatch({
                    error,
                    type: LOGIN_WITH_GOOGLE_FAILURE
                })
            ),
        );
};

export const restoreAuth = credential => (dispatch) => {
    switch (credential.providerId) {
        case 'google.com':
            return api.signInWithGoogleCredential(credential);
        case 'password':
            return api.signInWithCredential(credential);
    }
};

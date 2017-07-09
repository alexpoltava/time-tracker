import {  REGISTER_REQUEST,
          REGISTER_SUCCESS,
          REGISTER_FAILURE } from '../actions';

const register = (state = {
    isRegistering: false,
    registrationSuccess: false,
    error: ''
}, action) => {
    switch(action.type) {
      case REGISTER_REQUEST: {
        return {
          ...state,
          isRegistering: true,
          registrationSuccess: false,
          error: ''
        };
      }
      case REGISTER_SUCCESS: {
        return {
          ...state,
          isRegistering: false,
          registrationSuccess: true
        };
      }
      case REGISTER_FAILURE: {
        return {
          ...state,
          isRegistering: false,
          registrationSuccess: false,
          error: action.error
        };
      }
      default: {
        return state;
      }
    }
};

export default register;

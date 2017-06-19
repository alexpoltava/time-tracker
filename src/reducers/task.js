import { ADD_TASK,
          FETCH_REQUEST,
          FETCH_SUCCESS,
          FETCH_FAILURE,
          TASK_ADDED,
          TASK_REMOVED
         } from '../actions';

export const tasks = (state = { isFetching: false, list: {}, error: null }, action) => {
    switch (action.type) {
        case FETCH_REQUEST: {
            return {
                isFetching: true,
                ...state
            };
        }
        case FETCH_SUCCESS: {
            return {
                isFetching: false,
                list: action.list
            };
        }
        case FETCH_FAILURE: {
            return {
                isFetching: false,
                error: action.error
            };
        }
        case TASK_ADDED: {
            return {
                ...state,
                list: Object.assign({}, state.list, { [action.key]: action.payload })
            };
        }

        case TASK_REMOVED: {
            const newList = Object.assign({}, state.list);
            delete newList[action.key];
            return {
                ...state,
                list: newList
            };
        }
        default: {
            return state;
        }
    }
};

export const task = (state = {}, action) => {
    switch (action.type) {
        case ADD_TASK: {
            return {
                ...state
            };
        }

        case 'REMOVE_TASK': {
            return {
                ...state
            };
        }

        case 'COPY_TASK': {
            return {
                ...state
            };
        }

        case 'GET_TASKS': {
            return {
                ...state
            };
        }

        default: {
            return state;
        }
    }
};

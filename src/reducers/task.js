import { ADD_TASK,
          REMOVE_TASK,
          UPDATE_TASK,
          FETCH_REQUEST,
          FETCH_SUCCESS,
          FETCH_FAILURE,
          TASK_ADDED,
          TASK_REMOVED,
          TASK_UPDATED,
          CLEAR_ALL_TASKS,
         } from '../actions';

const initialState = { isFetching: false, list: {}, error: null };

export const tasks = (state = initialState, action) => {
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
                list: { ...state.list, [action.payload.key]: action.payload.val }
            };
        }

        case TASK_UPDATED: {
            return {
                ...state,
                list: { ...state.list, [action.payload.key]: action.payload.val }
            };
        }

        case TASK_REMOVED: {
            return {
                ...state,
                list: Object.keys(state.list).filter(task => task !== action.payload.key)
                        .reduce((newList, task) => {
                            newList[task] = state.list[task];
                            return newList;
                          },
                      {})
            };
        }

        case CLEAR_ALL_TASKS: {
            return initialState;
        }

        default: {
            return state;
        }
    }
};

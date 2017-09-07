import { SETTINGS_UPDATED } from '../actions';

const initialState = {
    hideCompleted: false,
    categories: [],
};

const settings = (state = initialState, action) => {
    switch (action.type) {
        case SETTINGS_UPDATED: {
            return {
                ...state,
                ...action.payload
            };
        }
        default: {
            return {
                ...state
            };
        }
    }
};

export default settings;

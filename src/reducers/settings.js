import { UPDATE_SETTINGS,
         SETTINGS_UPDATED, } from '../actions'

const initialState = {
  hideCompleted: false,
  categories: [
    {id: 1, name: 'Work'},
    {id: 2, name: 'Shopping'},
    {id: 3, name: 'Entertainment'},
    {id: 4, name: 'Sport'}
  ],
};

const settings = (state = initialState, action) => {
  switch(action.type) {
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
}

export default settings;

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import timer from './timer';

export default combineReducers({
    timer,
    routing: routerReducer
});

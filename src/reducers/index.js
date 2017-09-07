import { combineReducers } from 'redux';

import timers from './timer';
import { tasks } from './task';
import session from './session';
import register from './register';
import settings from './settings';

export default combineReducers({
    timers,
    tasks,
    session,
    register,
    settings,
});

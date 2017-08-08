const timer = (state = { status: 'STOPPED', time: 0 }, action) => {
    switch (action.type) {
        case 'TIMER_ADD': {
            const { id, isPaused, timeLogged, dateStart, now } = action.payload;
            return {
                ...state,
                id,
                status: isPaused ? 'STOPPED' : 'RUNNING',
                time: timeLogged + (isPaused ? 0 : (now - dateStart) / 1000),
            };
        }
        case 'START': {
            return {
                ...state,
                status: 'RUNNING'
            };
        }

        case 'STOP': {
            return {
                ...state,
                status: 'STOPPED'
            };
        }

        case 'TICK': {
            return {
                ...state,
                time: action.payload.timeElapsed,
            };
        }

        case 'RESET': {
            return {
                ...state,
                time: 0,
            };
        }

        default: {
            return state;
        }
    }
};

const timers = (state = [], action) => {
    switch (action.type) {
        case 'TIMER_ADD': {
            return [...state, timer(undefined, action)];
        }
        case 'CLEAR_ALL_TIMERS': {
            return [];
        }
        case 'TIMER_REMOVE': {
            return state.filter(el => (el.id !== action.payload.id));
        }

        case 'START':
        case 'STOP':
        case 'TICK':
        case 'RESET': {
            return state.map(el => ((el.id === action.payload.id) ? timer(el, action) : el));
        }

        default: {
            return state;
        }
    }
};

export default timers;

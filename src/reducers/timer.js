function getTimeElapsed(periods, now) {
    return periods
      ? periods.reduce((total, period) => {
          const start = period.dateStart;
          const end = period.dateComplete || now;
          return total + ((end - start) / 1000);
      }, 0)
      : 0;
}

const timer = (state = { status: 'STOPPED', time: 0 }, action) => {
    switch (action.type) {
        case 'TIMER_ADD': {
            const { id, isPaused, periods, now } = action.payload;
            return {
                ...state,
                id,
                status: isPaused ? 'STOPPED' : 'RUNNING',
                time: getTimeElapsed(periods, now),
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
            const { periods, now } = action.payload;
            return {
                ...state,
                time: getTimeElapsed(periods, now),
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

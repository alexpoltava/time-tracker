const timer = (state = { status: 'STOPPED', time: 0 }, action) => {
    switch (action.type) {
        case 'TIMER_ADD': {
            return {
                ...state,
                id: action.payload.id
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
                time: state.time + 1,
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

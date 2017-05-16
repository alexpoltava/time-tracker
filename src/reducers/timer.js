const timer = (state = { status: 'STOPPED', time: 0 }, action) => {
    switch (action.type) {
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

export default timer;

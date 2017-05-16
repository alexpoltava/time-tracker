export const action = (type, params = {}) => (
    {
        type,
        ...params
    }
);

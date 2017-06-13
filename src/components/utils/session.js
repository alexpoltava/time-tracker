const saveSession = (credential) => {
    try {
        localStorage.setItem('session', JSON.stringify(credential));
    } catch (error) {
        console.log(error.message);
    }
};

const extractSession = () => {
    try {
        return JSON.parse(localStorage.getItem('session'));
    } catch (error) {
        console.log(error.message);
    }
};

const clearSession = () => {
    try {
        localStorage.setItem('session', '');
    } catch (error) {
        console.log(error.message);
    }
};

export default {
    saveSession,
    extractSession,
    clearSession
};

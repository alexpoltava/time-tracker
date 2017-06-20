import 'babel-polyfill';

import ReactDOM from 'react-dom';
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { blue500, blue700, grey100, grey300, grey400, grey500, pinkA200, white, darkBlack, fullBlack } from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import configureStore from './store';

import { restoreAuth } from './actions';
import App from './components/App.jsx';

import session from './components/utils/session';

// styles
import 'normalize.css';
import './assets/main.css';

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: blue500,
        primary2Color: blue700,
        primary3Color: grey400,
        accent1Color: pinkA200,
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: blue500,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
    },
});

injectTapEventPlugin();
const store = configureStore();

const renderApp = () => {
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <App />
                </MuiThemeProvider>
            </BrowserRouter>
        </Provider>,
  document.getElementById('root'));
};

const startApp = () => {
    const credential = session.extractSession();
    if (credential) {
        store.dispatch(restoreAuth(credential))
        .then(() => renderApp())
        .catch((error) => {
            console.log(error.message);
            session.clearSession();
            renderApp();
        });
    } else {
        renderApp();
    }
};

startApp();

import 'babel-polyfill';

import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, syncHistoryWithStore } from 'react-router-redux';

import MyApp from './components/MyApp.jsx';

import configureStore from './store';

// styles
import 'normalize.css';
import './assets/main.css';

const browserHistory = createHistory();
const store = configureStore({}, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

const routes = (
    <Route path="/" component={MyApp} />
);

const renderApp = () => {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                {routes}
            </Router>
        </Provider>,
        document.getElementById('root')
    );
};

renderApp();

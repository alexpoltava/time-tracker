import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { firebaseAuth } from '../config/constants'
import requireAuth from './hoc/requireAuth.jsx';

import Nav from './Nav.jsx'
import LoggedInLayout from './protected/LoggedInLayout.jsx'
import Dashboard from './protected/Dashboard.jsx'
import Home from './Home.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'

import configureStore from '../store';

import styles from './App.less';

const store = configureStore();

const routes = (
    <Route component={Home}>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />

        <Route component={requireAuth(LoggedInLayout)}>
            <Route path="/dashboard" component={Dashboard} />
        </Route>
    </Route>
);

export default class App extends Component {

    componentDidMount() {
      this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
        if (user) {
          // dispatch user is logged in
        } else {
          // dispatch user is logged out
        }
      })
    }
    componentWillUnmount() {
      this.removeListener()
    }

    render() {
        return (
              <Provider store={store}>
                  <BrowserRouter>
                    <MuiThemeProvider>
                        <div className={styles.app}>
                            <Nav />
                            {routes}
                        </div>
                    </MuiThemeProvider>
                  </BrowserRouter>
              </Provider>
        );
    }
}

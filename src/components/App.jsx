import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';

import { firebaseAuth } from '../config/constants';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import requireAuth from './hoc/requireAuth.jsx';

import Dashboard from './protected/Dashboard.jsx';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';

import { loginSuccess, logout, logoutSuccess, taskAdded } from '../actions';
import { withRouter } from 'react-router-dom';
import muiThemeable from 'material-ui/styles/muiThemeable';

import Alert from './utils/alert.jsx';

import api from '../api';
import { ref } from '../config/constants';
import styles from './App.less';

const mapStateToProps = state => ({
    isLoggedIn: state.session.isLoggedIn,
    isLoggedOut: state.session.isLoggedOut,
    isLoggingOut: state.session.isLoggingOut,
    user: state.session.user
});

@withRouter
@connect(mapStateToProps, { loginSuccess, logout, logoutSuccess, taskAdded })
class App extends Component {
    state ={
      showAlert: false
    };

    closeAlert = () => {
      this.setState({ showAlert: false });
    }

    showAlert = () => {
      this.setState({ showAlert: true });
    }

    componentDidMount() {
        this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
            if (user) {
                this.props.loginSuccess(user);
                const { history, location } = this.props;
                history.push({
                  pathname: location.state ? location.state.nextLocation.pathname : '/dashboard',
                  search: location.state ? location.state.nextLocation.search : ''
                });
                user.emailVerified === false ? this.showAlert() : null;

                ref.child(`users/${user.uid}/tasks`).on('child_added', (childSnapshot, prevChildKey) => {
                  console.log('child_added');
                  this.props.taskAdded(childSnapshot.val());
                });

            } else {
                this.props.logoutSuccess();
            }
        });
    }
    componentWillUnmount() {
        this.removeListener();
    }

    render() {
        return (
            <div className={styles.app}>
              <div className={styles.nav}>
                <div className={styles.links}>
                  <NavLink exact to={'/'} style={{textDecoration:'none', color: this.props.muiTheme.palette.textColor}} activeStyle={{fontWeight: 'bold'}}>Home</NavLink>{' | '}
                  {
                    this.props.isLoggedIn === true
                    ? <NavLink to={'/dashboard'} style={{textDecoration:'none', color: this.props.muiTheme.palette.textColor}} activeStyle={{fontWeight: 'bold'}}>Dashboard</NavLink>
                    : null
                  }
                </div>
                {
                  this.props.isLoggedIn === true
                  ? this.props.isLoggingOut === true
                    ? <CircularProgress />
                  : <div>
                      <span>{this.props.user.email}</span>
                      <span style={{fontSize: 'small', color: 'red'}}>{this.props.user.emailVerified ? null : '   unverified email'}</span>
                      <RaisedButton
                        className={styles.links}
                        onClick={this.props.logout}
                      >
                        Logout
                      </RaisedButton>
                    </div>
                  : <div className={styles.links}>
                      <NavLink to={'/login'} style={{textDecoration:'none', color: this.props.muiTheme.palette.textColor}} activeStyle={{fontWeight: 'bold'}}>Login</NavLink> {' | '}
                      <NavLink to={'/register'} style={{textDecoration:'none', color: this.props.muiTheme.palette.textColor}} activeStyle={{fontWeight: 'bold'}}>Register</NavLink>
                    </div>
                }
              </div>
              <hr />
              <div className={styles.content}>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/dashboard" component={requireAuth(Dashboard)} />
                <Alert
                  open={this.state.showAlert}
                  closeDialog={this.closeAlert}
                >
                  email has been sent to {this.props.user.email}. Check it to complete registration.
                </Alert>
              </div>
            </div>
        );
    }
}

export default muiThemeable()(App);

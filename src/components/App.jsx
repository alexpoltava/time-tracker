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

import { action, loginSuccess, logout, logoutSuccess, taskAdded, taskRemoved } from '../actions';
import { withRouter } from 'react-router-dom';
import muiThemeable from 'material-ui/styles/muiThemeable';

import Alert from './utils/alert.jsx';

import styles from './App.less';

const mapStateToProps = state => ({
    isLoggedIn: state.session.isLoggedIn,
    isLoggedOut: state.session.isLoggedOut,
    isLoggingOut: state.session.isLoggingOut,
    user: state.session.user
});

@withRouter
@connect(mapStateToProps, { action, loginSuccess, logout, logoutSuccess, taskAdded, taskRemoved })
class App extends Component {
    state ={
      showAlert: false,
    };

    closeAlert = () => {
      this.setState({ showAlert: false });
    }

    showAlert = () => {
      this.setState({ showAlert: true });
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

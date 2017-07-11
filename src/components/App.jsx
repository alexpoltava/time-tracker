import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';

import { firebaseAuth } from '../config/constants';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import Dashboard from './protected/Dashboard.jsx';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';

import { logout } from '../actions';
import { withRouter } from 'react-router-dom';
import muiThemeable from 'material-ui/styles/muiThemeable';

import Alert from './utils/alert.jsx';

import styles from './App.less';

const mapStateToProps = state => ({
    isLoggedIn: state.session.isLoggedIn,
    isLoggingOut: state.session.isLoggingOut,
    uid: state.session.user.uid,
    user: state.session.user
});

const PrivateRoute = ({ component: Component, ...rest }) => {
  return <Route {...rest} render={ props => {
      return rest.auth ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }}/>
      );
  }} />
}

@withRouter
@connect(mapStateToProps, { logout })
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
                    ? <NavLink to={`/dashboard/${this.props.uid}`} style={{textDecoration:'none', color: this.props.muiTheme.palette.textColor}} activeStyle={{fontWeight: 'bold'}}>Dashboard</NavLink>
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
                <div className={styles.content}>
                  <Route exact path="/" component={Home} />
                  <Route path="/login" component={Login} />
                  <Route path="/register" component={Register} />
                  <PrivateRoute path="/dashboard/:uid" auth={this.props.isLoggedIn} component={Dashboard} />
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

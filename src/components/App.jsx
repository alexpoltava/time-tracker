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

import styles from './App.less';

const mapStateToProps = state => ({
    isLoggedIn: state.session.isLoggedIn,
    isLoggingOut: state.session.isLoggingOut,
    uid: state.session.user.uid,
    user: state.session.user
});

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={ props => {
      return rest.auth
          ? <Component {...props}/>
          : <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
              }}/>;
  }} />
);

const NavMenu = ({ props }) => (
    <nav className={styles.nav}>
        <div className={styles.links}>
          <NavLink exact to={'/'} style={{textDecoration:'none', color: props.muiTheme.palette.textColor}} activeStyle={{fontWeight: 'bold'}}>Home</NavLink>
          {
            props.isLoggedIn
            ? <span>
                {' | '}
                <NavLink to={`/dashboard/${props.uid}`} style={{textDecoration:'none', color: props.muiTheme.palette.textColor}} activeStyle={{fontWeight: 'bold'}}>Dashboard</NavLink>
              </span>
            : null
          }
        </div>
        {
          props.isLoggedIn
          ? props.isLoggingOut
            ? <CircularProgress />
            : <div>
                <span>{props.user.email}</span>
                <span style={{fontSize: 'small', color: 'red'}}>{props.user.emailVerified ? null : '   unverified email'}</span>
                <RaisedButton
                  className={styles.links}
                  onClick={props.logout}
                >
                  Logout
                </RaisedButton>
              </div>
          : <div className={styles.links}>
              <NavLink to={'/login'} style={{textDecoration:'none', color: props.muiTheme.palette.textColor}} activeStyle={{fontWeight: 'bold'}}>Login</NavLink> {' | '}
              <NavLink to={'/register'} style={{textDecoration:'none', color: props.muiTheme.palette.textColor}} activeStyle={{fontWeight: 'bold'}}>Register</NavLink>
            </div>
        }
    </nav>
);

@withRouter
@connect(mapStateToProps, { logout })
class App extends Component {
    render() {
        return (
            <div className={styles.app}>
                <NavMenu props={this.props} />
                <div className={styles.content}>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <PrivateRoute path="/dashboard/:uid" auth={this.props.isLoggedIn} component={Dashboard} />
                  </Switch>
              </div>
            </div>
        );
    }
}

export default muiThemeable()(App);

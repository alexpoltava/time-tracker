import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import Avatar from 'material-ui/Avatar';

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

import Media from 'react-responsive';
import { SMALL_SCREEN } from '../config/constants';

import styles from './App.less';

const mapStateToProps = state => ({
    isLoggedIn: state.session.isLoggedIn,
    isRestoringAuth: state.session.isRestoringAuth,
    isLoggingOut: state.session.isLoggingOut,
    uid: state.session.user.uid,
    user: state.session.user
});

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={ props => {
        return rest.auth
          ? <Component {...props} isMenuOpen={rest.isMenuOpen} onRequestCloseMenu={rest.onRequestCloseMenu}/>
          : rest.isRestoringAuth
            ? <CircularProgress size={80} thickness={5} />
            : <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
              }}/>;
  }} />
);

const LoginRegister = ({ muiTheme }) => (
          <div className={styles.links}>
            <NavLink to={'/login'} style={{textDecoration:'none', color: muiTheme.palette.alternateTextColor}} activeStyle={{fontWeight: 'bold'}}>Login</NavLink> {' | '}
            <NavLink to={'/register'} style={{textDecoration:'none', color: muiTheme.palette.alternateTextColor}} activeStyle={{fontWeight: 'bold'}}>Register</NavLink>
          </div>
);

const Logged = ({ logout, user }) => (
  <IconMenu
    iconButtonElement={
      <FlatButton
        label={<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', textTransform: 'none'}}><Avatar style={{margin: '8px'}} src={user.photoURL || user.providerData[0].photoURL} /><span>{user.providerData[0].displayName || user.email}</span><ExpandMore /></div>}
        labelStyle={{display: 'flex', flexDirection: 'row', alignItems: 'center', textTransform: 'none'}}
        style={{height: '56px'}}
      >
      </FlatButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
  >
    <MenuItem
      primaryText="Logout"
      onClick={logout}
    />
  </IconMenu>
);

@withRouter
@connect(mapStateToProps, { logout })
class App extends Component {
    state = {
      isMenuOpen: true
    }

    onShowHideMenu = () => {
      this.setState({ isMenuOpen: !this.state.isMenuOpen });
    }

    onRequestCloseMenu = () => {
      this.setState({ isMenuOpen: false });
    }

    render() {
        return (
            <div className={styles.app}>
                <Media minDeviceWidth={SMALL_SCREEN}>
                  {(match) =>
                    <AppBar
                      title={<NavLink exact to={'/'} style={{textDecoration:'none', fontFamily: 'cursive', color: this.props.muiTheme.palette.alternateTextColor}} activeStyle={{fontWeight: 'bold'}}>Time-tracker</NavLink>}
                      titleStyle={{textAlign: match ? 'left' : 'center'}}
                      style={{width: this.state.isMenuOpen && this.props.isLoggedIn ? '75%' : '100%'}}
                      showMenuIconButton={this.props.isLoggedIn}
                      iconElementRight={this.props.isLoggedIn
                          ? match ? <Logged logout={this.props.logout} user={this.props.user} /> : null
                          : <LoginRegister muiTheme={this.props.muiTheme}/>}
                      onLeftIconButtonTouchTap={this.onShowHideMenu}
                    />
                  }
                </Media>
                <div className={styles.content}>
                  <Switch>
                    <Route
                      exact path="/"
                      render={() =>
                        this.props.isLoggedIn
                        ? <Redirect to={`/dashboard/${this.props.uid}`} />
                        : <Home />}
                    />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <PrivateRoute
                      path="/dashboard/:uid"
                      auth={this.props.isLoggedIn}
                      isRestoringAuth={this.props.isRestoringAuth}
                      isMenuOpen={this.state.isMenuOpen}
                      onRequestCloseMenu={this.onRequestCloseMenu}
                      component={Dashboard}
                    />
                  </Switch>
              </div>
            </div>
        );
    }
}

export default muiThemeable()(App);

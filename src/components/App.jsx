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
          ? <Component {...props} isMenuOpen={rest.isMenuOpen} />
          : rest.isRestoringAuth
            ? <CircularProgress size={80} thickness={5} />
            : <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
              }}/>;
  }} />
);

const NavMenu = (props) => (
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
    </nav>
);

const LoginRegister = ({ muiTheme }) =>
          <div className={styles.links}>
          <NavLink to={'/login'} style={{textDecoration:'none', color: muiTheme.palette.alternateTextColor}} activeStyle={{fontWeight: 'bold'}}>Login</NavLink> {' | '}
          <NavLink to={'/register'} style={{textDecoration:'none', color: muiTheme.palette.alternateTextColor}} activeStyle={{fontWeight: 'bold'}}>Register</NavLink>
        </div>;

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

    render() {
        return (
            <div className={styles.app}>
                <AppBar
                  title={<NavLink exact to={'/'} style={{textDecoration:'none', fontFamily: 'cursive', color: this.props.muiTheme.palette.alternateTextColor}} activeStyle={{fontWeight: 'bold'}}>Time-tracker</NavLink>}
                  titleStyle={{textAlign: 'left'}}
                  showMenuIconButton={this.props.isLoggedIn}
                  iconElementRight={this.props.isLoggedIn
                      ? <Logged  logout={this.props.logout} user={this.props.user} />
                      : <LoginRegister muiTheme={this.props.muiTheme}/>}
                  onLeftIconButtonTouchTap={this.onShowHideMenu}
                />
                <div className={styles.content}>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <PrivateRoute
                      path="/dashboard/:uid"
                      auth={this.props.isLoggedIn}
                      isRestoringAuth={this.props.isRestoringAuth}
                      isMenuOpen={this.state.isMenuOpen}
                      component={Dashboard}
                    />
                  </Switch>
              </div>
            </div>
        );
    }
}

export default muiThemeable()(App);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import GoogleButton from 'react-google-button'

import Media from 'react-responsive';
import { SMALL_SCREEN } from '../config/constants';

import { login, loginWithGoogleAccount } from '../actions';

import styles from './LoginRegister.less';

const mapStateToProps = state => ({
    isLoggedIn: state.session.isLoggedIn,
    isLoggingIn: state.session.isLoggingIn,
    isLoggingWithGoogleIn: state.session.isLoggingWithGoogleIn,
    uid: state.session.user.uid,
    error: state.session.error
});

@withRouter
@connect(mapStateToProps, { login, loginWithGoogleAccount })
export default class Login extends Component {

    state = {
        email: '',
        password: '',
        isEmailValid: true,
        isPasswordValid: true
      };


    validateInput = () => {
      let isInputValid = true;
      if (this.state.email === '') {
          this.setState({ isEmailValid: false });
          isInputValid = false;
      }
      if (this.state.password === '') {
          this.setState({ isPasswordValid: false });
          isInputValid = false;
      }
      return isInputValid;
    }

    handleEmailChange = (event) => {
      this.setState({
        email: event.target.value,
        isEmailValid: true
      });
    };

    handlePaswordChange = (event) => {
      this.setState({
        password: event.target.value,
        isPasswordValid: true
      });
    };


    handleLogin = () => {
      if (this.validateInput() ===true){
            this.props.login(this.state.email, this.state.password);
        }
    }

    handleLoginWithGoogleAccount = () => {
      this.props.loginWithGoogleAccount();
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: `/dashboard/${this.props.uid}` } };
        if(this.props.isLoggedIn) {
          return <Redirect to={from} />
        }
        return (
          <Media minDeviceWidth={SMALL_SCREEN}>
            {(match) =>
              <div className={styles.componentStyle}>
                  <Paper className={styles.paperStyle} style={{width: match ? null : '100%'}}>
                    <span className={styles.inputStyle}>Log in with e-mail</span>
                    <TextField
                        hintText="e-mail"
                        errorText={this.state.isEmailValid ? '' : 'e-mail is required'}
                        name="Email"
                        className={styles.inputStyle}
                        style={{width: '80%'}}
                        type="email"
                        value={this.state.email}
                        onChange={this.handleEmailChange}
                    />
                    <TextField
                        hintText="password"
                        errorText={this.state.isPasswordValid ? '' : 'password is required'}
                        name="Password"
                        className={styles.inputStyle}
                        style={{width: '80%'}}
                        type="password"
                        value={this.state.password}
                        onChange={this.handlePaswordChange}
                    />
                    <span className={styles.inputStyle}
                          style={{
                                  color: 'red',
                                  display: `${this.props.error === null ? 'none': 'block'}`,
                                  fontSize: 'small',
                                  textAlign: 'left'
                                }}
                    >
                      {this.props.error ? this.props.error : null}
                    </span>
                    {
                      this.props.isLoggingIn === true
                      ? <CircularProgress />
                      : <FlatButton
                          className={styles.btnLogin}
                          label="Login"
                          disabled={this.props.isLoggedIn}
                          primary={true}
                          style={{margin: '16px'}}
                          onClick={this.handleLogin}
                        />
                    }
                  </Paper>
                  {
                    this.props.isLoggingWithGoogleIn === true
                    ? <CircularProgress />
                    : <GoogleButton
                        className={styles.btnGoogle}
                        type='light'
                        disabled={this.props.isLoggedIn}
                        onClick={this.handleLoginWithGoogleAccount}
                      />
                  }
              </div>
            }
          </Media>
        );
    }
}

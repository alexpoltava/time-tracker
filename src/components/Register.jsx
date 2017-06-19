import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';

import api from '../api';

import styles from './LoginRegister.less';

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      password2: '',
      isEmailValid: true,
      isPasswordValid: true,
      isPassword2Valid: true,
      registrationInProgress: false,
      errorMessage: '',
      isRegisterSuccess: false
    };
  }

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
    if (this.state.password2 === '') {
        this.setState({ isPasswor2dValid: false });
        isInputValid = false;
    }
    return isInputValid;
  }

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
      isEmailValid: true,
      errorMessage: ''
    });
  };

  handlePaswordChange = (event) => {
    this.setState({
      password: event.target.value,
      isPasswordValid: true,
      errorMessage: ''
    });
  };

  handlePasword2Change = (event) => {
    this.setState({
      password2: event.target.value,
      isPassword2Valid: true,
      errorMessage: ''
    });
  };

  comparePasswords = () => (this.state.password === this.state.password2);

  handleRegister = () => {
    if (this.validateInput() === true){
        if(!this.comparePasswords()) {
          return this.setState({
            registrationInProgress: false,
            isRegisterSuccess: false,
            errorMessage: 'Passwords should be the same'
          });
        }
        this.setState({
          registrationInProgress: true
        }, () => (
          api.register(this.state.email, this.state.password)
            .then(user => (
                api.saveUser(user)
            ))
            .catch(error => {
              return this.setState({
                registrationInProgress: false,
                isRegisterSuccess: false,
                errorMessage: error.message
              });
              }
            )
          )
        )
      }
  }

  render () {
    return (
      <div className={styles.componentStyle}>
        <Paper className={styles.paperStyle}>
          <span className={styles.inputStyle}>Register using e-mail</span>
          <TextField
              className={styles.inputStyle}
              hintText="e-mail"
              disabled={this.state.isRegisterSuccess}
              errorText={this.state.isEmailValid ? '' : 'e-mail is required'}
              name="Email"
              value={this.state.email}
              onChange={this.handleEmailChange}
          />
          <TextField
              className={styles.inputStyle}
              hintText="password"
              disabled={this.state.isRegisterSuccess}
              errorText={this.state.isPasswordValid ? '' : 'password is required'}
              name="Password"
              type="password"
              value={this.state.password}
              onChange={this.handlePaswordChange}
          />
          <TextField
              className={styles.inputStyle}
              hintText="confirm password"
              disabled={this.state.isRegisterSuccess}
              errorText={this.state.isPassword2Valid ? '' : 'password is required'}
              name="Password2"
              type="password"
              value={this.state.password2}
              onChange={this.handlePasword2Change}
          />
          <span
              className={styles.inputStyle}
              style={{
                        color:`${this.state.isRegisterSuccess === true ? "green" : "red"}`,
                        display: `${this.state.errorMessage === '' ? 'none': 'block'}`,
                        fontSize: 'small',
                        textAlign: 'left'
                      }}
          >
            {this.state.errorMessage}
          </span>
          {
            this.state.registrationInProgress === true
            ? <CircularProgress />
            : <FlatButton
                className={styles.btnRegister}
                label="Register"
                primary={true}
                style={{margin: '16px'}}
                disabled={this.state.isRegisterSuccess}
                onTouchTap={this.handleRegister}
              />
          }
        </Paper>
      </div>
    )
  }
}

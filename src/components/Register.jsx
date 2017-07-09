import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';


import api from '../api';

import styles from './LoginRegister.less';

import { register } from '../actions';

const mapStateToProps = state => ({
    isRegistering: state.register.isRegistering,
    isLoggedIn: state.session.isLoggedIn,
    registrationSuccess: state.register.registrationSuccess,
    error: state.register.error
});

@connect(mapStateToProps, { register } )
export default class Register extends Component {
    state = {
        email: '',
        password: '',
        password2: '',
        isEmailValid: true,
        isPasswordValid: true,
        isPassword2Valid: true,
        validationError: '',
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
    if (this.state.password2 === '') {
        this.setState({ isPassword2Valid: false });
        isInputValid = false;
    }
    return isInputValid;
  }

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
      isEmailValid: true,
      validationError: ''
    });
  };

  handlePaswordChange = (event) => {
    this.setState({
      password: event.target.value,
      isPasswordValid: true,
      validationError: ''
    });
  };

  handlePasword2Change = (event) => {
    this.setState({
      password2: event.target.value,
      isPassword2Valid: true,
      validationError: ''
    });
  };

  comparePasswords = () => (this.state.password === this.state.password2);

  handleRegister = () => {
    if (this.validateInput() === true){
        if(!this.comparePasswords()) {
          return this.setState({
            validationError: 'Passwords should be the same'
          });
        }
        this.props.register(this.state.email, this.state.password);
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
              disabled={this.props.registrationSuccess || this.props.isLoggedIn}
              errorText={this.state.isEmailValid ? '' : 'e-mail is required'}
              name="Email"
              value={this.state.email}
              onChange={this.handleEmailChange}
          />
          <TextField
              className={styles.inputStyle}
              hintText="password"
              disabled={this.props.registrationSuccess || this.props.isLoggedIn}
              errorText={this.state.isPasswordValid ? '' : 'password is required'}
              name="Password"
              type="password"
              value={this.state.password}
              onChange={this.handlePaswordChange}
          />
          <TextField
              className={styles.inputStyle}
              hintText="confirm password"
              disabled={this.props.registrationSuccess || this.props.isLoggedIn}
              errorText={this.state.isPassword2Valid ? '' : 'password is required'}
              name="Password2"
              type="password"
              value={this.state.password2}
              onChange={this.handlePasword2Change}
          />
          <span
              className={styles.inputStyle}
              style={{
                        color:`${this.props.registrationSuccess === true ? "green" : "red"}`,
                        display: `${!this.state.validationError && !this.props.error ? 'none': 'block'}`,
                        fontSize: 'small',
                        textAlign: 'left'
                      }}
          >
            {`${this.state.validationError} ${this.props.error}`}
          </span>
          {
            this.props.isRegistering === true
            ? <CircularProgress />
            : <FlatButton
                className={styles.btnRegister}
                label="Register"
                primary={true}
                style={{margin: '16px'}}
                disabled={this.props.registrationSuccess || this.props.isLoggedIn}
                onTouchTap={this.handleRegister}
              />
          }
        </Paper>
      </div>
    )
  }
}

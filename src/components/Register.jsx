import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';

import api from '../api';

const componentStyle = {
  display: 'flex',
  width: '100%',
  justifyContent: 'center'
};

const paperStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: 240,
  alignItems: 'center',
  margin: 16
};

const inputStyle = {
  margin: 16,
  width: '80%'
};

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      isEmailValid: true,
      isPasswordValid: true,
      registrationInProgress: false,
      errorMessage: '',
      isRegisterSuccess: false
    };
  }

  componentWillUnmount(){

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

  handleRegister = () => {
    if (this.validateInput() ===true){
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
      <div style={componentStyle}>
        <Paper style={paperStyle}>
          <span style={inputStyle}>Register using e-mail</span>
          <TextField
              hintText="e-mail"
              disabled={this.state.isRegisterSuccess}
              errorText={this.state.isEmailValid ? '' : 'e-mail is required'}
              name="Email"
              style={inputStyle}
              value={this.state.email}
              onChange={this.handleEmailChange}
          />
          <TextField
              hintText="password"
              disabled={this.state.isRegisterSuccess}
              errorText={this.state.isPasswordValid ? '' : 'password is required'}
              name="Password"
              style={inputStyle}
              type="password"
              value={this.state.password}
              onChange={this.handlePaswordChange}
          />
          <span style={
              Object.assign({}, inputStyle,
                      {
                        color:`${this.state.isRegisterSuccess === true ? "green" : "red"}`,
                        display: `${this.state.errorMessage === '' ? 'none': 'block'}`,
                        fontSize: 'small',
                        textAlign: 'left'
                      })
                    }
          >
            {this.state.errorMessage}
          </span>
          {
            this.state.registrationInProgress === true
            ? <CircularProgress />
            : <FlatButton
                label="Register"
                primary={true}
                disabled={this.state.isRegisterSuccess}
                style={
                  Object.assign({}, inputStyle,
                    {
                      alignSelf: 'flex-end',
                      width: '50%'
                    })
                  }
                onTouchTap={this.handleRegister}
              />
          }
        </Paper>
      </div>
    )
  }
}

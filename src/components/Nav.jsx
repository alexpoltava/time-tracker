import React, { Component } from 'react'

import { Link} from 'react-router-dom';

export default class Nav extends Component {
  render () {
    return (
      <div>
        <Link to={"/"}>Home</Link> {' | '}
        <Link to={"/dashboard"}>Dashboard</Link> {' | '}
        <Link to={"/login"}>Login</Link> {' | '}
        <Link to={"/register"}>Register</Link>
      </div>
    )
  }
}

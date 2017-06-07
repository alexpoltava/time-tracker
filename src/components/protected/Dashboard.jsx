import React, { Component } from 'react'

import Sidebar from '../Sidebar.jsx';
import View from '../View.jsx';


export default class Dashboard extends Component {

render () {
  return (
      <div>
        Dashboard. This is a protected route. You can only see this if you're authed.
      </div>
    )
  }
}

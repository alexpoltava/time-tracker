import React, { Component } from 'react';
import { connect } from 'react-redux';

import Menu from './Menu.jsx';
import style from './Sidebar.less';

export default class Sidebar extends Component {
    render() {
        return (
          <div className={style.root}>
            <h2>Total:</h2>
            <h2>00:00</h2>
            <Menu />
          </div>
        );
    }
}

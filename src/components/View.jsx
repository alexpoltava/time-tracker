import React, { Component } from 'react';
import { connect } from 'react-redux';

import Task from './Task.jsx';
import style from './View.less';

export default class View extends Component {
    render() {
        return (
          <div className={style.root}>
            <Task />
          </div>
        );
    }
}

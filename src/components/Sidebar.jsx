import React, { Component } from 'react';
import { connect } from 'react-redux';

import duration from './utils/duration';

import Menu from './Menu.jsx';
import style from './Sidebar.less';

const mapStateToProps = state => ({
    timers: state.timers,
});

@connect(mapStateToProps)
export default class Sidebar extends Component {
    render() {
        return (
            <div className={style.root}>
                <h2>Total logged:</h2>
                <h2>{duration(this.props.timers.reduce((prev, curr) => prev + curr.time, 0))}</h2>
                <span>with {this.props.timers.length} tasks</span>
                <Menu onSelectMenuItem={this.props.onSelectMenuItem} />
            </div>
        );
    }
}

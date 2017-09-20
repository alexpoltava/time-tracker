import React, { Component } from 'react';
import { connect } from 'react-redux';
import pluralize from 'pluralize';
import Drawer from 'material-ui/Drawer';

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
          <Drawer
            openSecondary={true}
            open={this.props.isMenuOpen}
          >
            <div className={style.root}>
                <h2>Total logged:</h2>
                <h2>{duration(this.props.timers.reduce((prev, curr) => prev + Math.floor(curr.time), 0))}</h2>
                <span>with {pluralize('tasks', this.props.timers.length, true)}</span>
                <Menu onSelectMenuItem={this.props.onSelectMenuItem} />
            </div>
          </Drawer>
        );
    }
}

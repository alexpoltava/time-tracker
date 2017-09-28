import React, { Component } from 'react';
import { connect } from 'react-redux';
import pluralize from 'pluralize';
import Drawer from 'material-ui/Drawer';
import Media from 'react-responsive';
import { SMALL_SCREEN } from '../config/constants'
import { createSelector } from 'reselect';

import duration from './utils/duration';

import Menu from './Menu.jsx';
import style from './Sidebar.less';

const timers = (state) => state.timers;

const tasks = (state) => state.tasks.list;

const getSettingsHideComplete = (state) => state.settings.hideCompleted;

const getTotalTime = createSelector(
  timers,
  timers => timers.reduce((prev, curr) => prev + Math.floor(curr.time), 0)
);

const getTimersCount = createSelector(
  timers,
  timers => timers.length
);

const getTimersRunning = createSelector(
  timers,
  timers => timers.filter(timer => timer.status === 'RUNNING').length
);

const getHidden = createSelector(
  [tasks, getSettingsHideComplete],
  (tasks, getSettingsHideComplete) => getSettingsHideComplete ? Object.keys(tasks).filter(key => tasks[key].isComplete).length : 0
);


const mapStateToProps = state => ({
    totalTime: getTotalTime(state),
    timersCount: getTimersCount(state),
    timersRunning: getTimersRunning(state),
    tasksHidden: getHidden(state),
});

@connect(mapStateToProps)
export default class Sidebar extends Component {
    render() {
        return (
          <Media minDeviceWidth={SMALL_SCREEN}>
            {(match) =>
              <Drawer
                openSecondary={true}
                open={this.props.isMenuOpen}
                width={match ? '25%' : '100%'}
                containerStyle={{display: 'flex', justifyContent: 'center'}}
              >
                <div className={style.root}>
                    <h2>Total logged:</h2>
                    <h2>{duration(this.props.totalTime)}</h2>
                    <span>
                      {`with ${pluralize('tasks', this.props.timersCount, true)}
                      (${this.props.timersRunning} running, ${this.props.tasksHidden} hidden)`}
                    </span>
                    <Menu onSelectMenuItem={this.props.onSelectMenuItem} />
                </div>
              </Drawer>
            }
          </Media>
        );
    }
}

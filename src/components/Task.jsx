import React, { Component } from 'react';
import { connect } from 'react-redux';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';

import humanizeDuration from 'humanize-duration';

import { action } from '../actions';

import style from './Task.less';

@connect(
    state => ({
        time: state.timer.time,
        status: state.timer.status,
    }),
    dispatch => ({
        start: () => dispatch(action('START')),
        stop: () => dispatch(action('STOP')),
        reset: () => dispatch(action('RESET')),
    })
)


export default class Task extends Component {
    render() {
      const paperStyle = {
        height: '64px',
        width: '100%',
        margin: '8px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      };

        return (
            <div className={style.root}>
              <Paper style={paperStyle} zDepth={2}>
                    <h3>My task</h3>
                    <span>{ humanizeDuration(this.props.time * 1000) }</span>
                    <IconButton
                        iconClassName="material-icons"
                        tooltip="Reset"
                        disabled={this.props.status === 'RUNNING'}
                        onClick={this.props.reset}
                    >
                      replay
                    </IconButton>
                    <IconButton
                        iconClassName="material-icons"
                        tooltip="Start"
                        style={this.props.status === 'RUNNING' ? { 'display': 'none' } : null}
                        onClick={this.props.start}
                    >
                      play_arrow
                    </IconButton>
                    <IconButton
                        iconClassName="material-icons"
                        tooltip="Stop"
                        style={this.props.status === 'STOPPED' ? { 'display': 'none' } : null}
                        onClick={this.props.stop}
                    >
                      pause
                    </IconButton>
              </Paper>
            </div>
        )
    }
}

import React, { Component } from 'react';
import { connect } from 'react-redux';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {red500, green500, blue500} from 'material-ui/styles/colors';

import { action } from '../actions';

import style from './Timer.less';

@connect(
    state => ({
        time: state.timer.time,
        status: state.timer.status,
    }),
    dispatch => ({
        start: () => dispatch(action('START')),
        stop: () => dispatch(action('STOP')),
        reset: () => dispatch(action('RESET')),
        another: () => dispatch(action('ANOTHER')),
    })
)
class Timer extends Component {
    componentDidMount() {
        this.timer = setInterval(() => this.props.another(), 1500);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        return (
            <div className={style.root}>
                <h3>{this.props.time} seconds</h3>
                <div>
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
                        disabled={this.props.status === 'RUNNING'}
                        onClick={this.props.start}
                    >
                      play_arrow
                    </IconButton>
                    <IconButton
                        iconClassName="material-icons"
                        tooltip="Stop"
                        disabled={this.props.status === 'STOPPED'}
                        onClick={this.props.stop}
                    >
                      pause
                    </IconButton>
                </div>
            </div>
        )
    }
}

export default Timer;

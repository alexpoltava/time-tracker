import React, { Component } from 'react';
import Media from 'react-responsive';
import { SMALL_SCREEN } from '../config/constants'

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import duration from './utils/duration';
import Replay from 'material-ui/svg-icons/av/replay';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Pause from 'material-ui/svg-icons/av/pause';
import Delete from 'material-ui/svg-icons/action/delete-forever';

import style from './Task.less';


export default class Task extends Component {
    constructor(props) {
      super(props);
        this.state = {
          isHovered: false,
        }
    }

    handleDelete = () => {
        this.props.onDelete({ key: this.props.id, uid: this.props.uid });
    }
    handleMouseOver = () => {
        this.setState({isHovered: true});
    }

    handleMouseOut = () => {
        this.setState({isHovered: false});
    }

    handleDoubleClick = () => {
        this.props.onDoubleClick(this.props.id)
    }

    handleStart = () => {
      const { id, uid } = this.props;
      const periods = [...this.props.periods, { dateStart: +Date.now() }];
      this.props.updateTask(id, { isPaused: false, uid, periods });
    }

    handleStop = () => {
      const { id, uid } = this.props;
      const periods = this.props.periods.map(el =>
        el.dateComplete ? el : {...el, dateComplete: +Date.now()}
      );
      this.props.updateTask(id, { isPaused: true, uid, periods });
    }

    handleReset = () => {
      const { id, uid } = this.props;
      this.props.updateTask(id, { periods: [], uid });
    }

    handleUpdate = (params) => {
      const { id, uid, isPaused } = this.props;
      const { isComplete } = params;
      if (isComplete && !isPaused) {
          this.handleStop();
      }
      this.props.updateTask(id, { ...params, uid });
    }

    handleComplete = (e, isComplete) => {
      this.handleUpdate({ isComplete });
    }

    render() {
      const paperStyle = {
        height: '64px',
        width: '100%',
        margin: '8px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      };
      const checkbox = {
        width: '36px'
      }
      const button = {
        padding: '0'
      }
      const deleteStyle = {
        padding: '0',
        marginRight: '8px',
        opacity: '1',
        transition: 'opacity 0.5s linear 0.5s'
      };
      const { id, name, description, category, tagsArray, isComplete, time } = this.props;
        return (
            <div className={style.root}>
              <Paper
                style={paperStyle}
                zDepth={2 + this.state.isHovered}
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                onDoubleClick={this.handleDoubleClick}
              >
                  <Media minDeviceWidth={SMALL_SCREEN}>
                    {(match) => (
                      <div
                        className={ isComplete ? style.infogrey : style.info }
                        style={{width: match ? '90%' : '35%'}}
                      >
                        <p className={style.name}>{name}</p>
                        <p
                          className={style.description}
                          style={{display: match ? 'block' : 'none'}}
                        >
                          {description}
                        </p>
                        <div style={{display: 'flex', flexDirection: 'column', display: match ? 'flex' : 'none'}}>
                          <p className={style.category}>
                            {category}
                          </p>
                          <p className={style.tags}>
                            {
                              tagsArray
                              ? tagsArray.map((tag, i) => <span key={i}>#{tag} </span>)
                              : null
                            }
                          </p>
                        </div>
                        <p className={style.duration}>{duration(time)}</p>
                      </div>
                      )
                    }
                  </Media>
                  <div className={style.controls}>
                    <IconButton
                        tooltip="Reset"
                        disabled={(!this.props.isPaused) || isComplete || this.props.readOnly}
                        style={button}
                        onClick={this.handleReset}
                    >
                      <Replay />
                    </IconButton>
                    <IconButton
                        disabled={isComplete || this.props.readOnly}
                        tooltip="Start"
                        style={this.props.isPaused ? button : { ...button, display: 'none' }}
                        onClick={this.handleStart}
                    >
                      <PlayArrow />
                    </IconButton>
                    <IconButton
                        disabled={isComplete || this.props.readOnly}
                        tooltip="Stop"
                        style={this.props.isPaused ? { ...button, display: 'none' } : button}
                        onClick={this.handleStop}
                    >
                      <Pause />
                    </IconButton>
                    <Checkbox
                        style={checkbox}
                        inputStyle={checkbox}
                        disabled={this.props.readOnly}
                        checked={isComplete}
                        onCheck={this.handleComplete}
                    />
                    <IconButton
                        disabled={this.props.readOnly}
                        tooltip="Delete task"
                        style={!this.state.isHovered ? { ...deleteStyle, visibility: 'hidden', opacity: '0' } : deleteStyle }
                        onClick={this.handleDelete}
                    >
                      <Delete
                        hoverColor='red'
                      />
                    </IconButton>
                </div>
            </Paper>
          </div>
        )
    }
}

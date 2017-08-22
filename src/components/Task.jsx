import React, { Component } from 'react';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import duration from './utils/duration';

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

    handleStart = () => {
      const { id, uid } = this.props;
      const periods = [...this.props.periods, {dateStart: +Date.now()}];
      this.props.start(id, {  uid, periods });
    }

    handleStop = () => {
      const { id, uid } = this.props;
      const periods = [...this.props.periods.slice(0, -1),
        Object.assign(...this.props.periods.slice(-1), {dateComplete: +Date.now()})];
      this.props.stop(id, { uid, periods });
    }

    handleReset = () => {
      const { id, uid } = this.props;
      this.props.reset(id, { uid });
    }

    handleUpdate = (params) => {
      const { id, uid, isPaused } = this.props;
      const { isComplete } = params;
      if (isComplete && !isPaused) {
          this.handleStop();
      }
      this.props.onUpdate(id, { ...params, uid });
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
        justifyContent: 'space-around',
        alignItems: 'center',
      };
      const checkbox = {
        display: 'flex',
        alignSelf: 'center'
      }
      const deleteStyle = {
        opacity: '1',
        transition: 'opacity 0.5s linear 0.5s'
      };
      const { id, name, description, isComplete, time } = this.props;
        return (
              <Paper
                style={paperStyle}
                zDepth={2 + this.state.isHovered}
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
              >
                <div className={style.root}>
                    <div className={ isComplete ? style.infogrey : style.info }>
                      <span className={style.name}>{name}</span>
                      <span className={style.description}>{description}</span>
                      <span>{duration(time)}</span>
                    </div>
                    <div className={style.controls}>
                      <IconButton
                          iconClassName="material-icons"
                          tooltip="Reset"
                          disabled={(!this.props.isPaused) || isComplete || this.props.readOnly}
                          onClick={this.handleReset}
                      >
                        replay
                      </IconButton>
                      <IconButton
                          iconClassName="material-icons"
                          disabled={isComplete || this.props.readOnly}
                          tooltip="Start"
                          style={this.props.isPaused ? null : { 'display': 'none' }}
                          onClick={this.handleStart}
                      >
                        play_arrow
                      </IconButton>
                      <IconButton
                          iconClassName="material-icons"
                          disabled={isComplete || this.props.readOnly}
                          tooltip="Stop"
                          style={this.props.isPaused ? { 'display': 'none' } : null}
                          onClick={this.handleStop}
                      >
                        pause
                      </IconButton>
                      <Checkbox
                          style={checkbox}
                          disabled={this.props.readOnly}
                          checked={isComplete}
                          onCheck={this.handleComplete}
                      />
                      <IconButton
                          iconClassName="material-icons"
                          disabled={this.props.readOnly}
                          className='delete'
                          iconStyle={{iconHoverColor: 'red'}}
                          style={!this.state.isHovered ? {...deleteStyle, ...{'visibility':'hidden', 'opacity':'0'}} : deleteStyle}
                          tooltip="Delete task"
                          onClick={this.handleDelete}
                      >
                        delete
                      </IconButton>
                  </div>
                </div>
            </Paper>
        )
    }
}

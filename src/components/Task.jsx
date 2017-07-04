import React, { Component } from 'react';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import duration from './utils/duration';

import style from './Task.less';


export default class Task extends Component {
    state = {
      isHovered: false
    }

    handleDelete = () => {
        this.props.onDelete(this.props.id);
    }
    handleMouseOver = () => {
        this.setState({isHovered: true});
    }

    handleMouseOut = () => {
        this.setState({isHovered: false});
    }

    handleStart = () => {
      this.props.start(this.props.id);
    }

    handleStop = () => {
      this.props.stop(this.props.id);
    }

    handleReset = () => {
      this.props.reset(this.props.id);
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
      const deleteStyle = {
        opacity: '1',
        transition: 'opacity 1s linear 0.5s'
      };
      const { id, name, description } = this.props;
        return (
              <Paper
                style={paperStyle}
                zDepth={2 + this.state.isHovered}
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
              >
                <div className={style.root}>
                    <div className={style.info}>
                      <span className={style.name}>{name}</span>
                      <span className={style.description}>{description}</span>
                      {duration(this.props.time)}
                    </div>
                    <div className={style.controls}>
                      <IconButton
                          iconClassName="material-icons"
                          tooltip="Reset"
                          disabled={this.props.status === 'RUNNING'}
                          onClick={this.handleReset}
                      >
                        replay
                      </IconButton>
                      <IconButton
                          iconClassName="material-icons"
                          tooltip="Start"
                          style={this.props.status === 'RUNNING' ? { 'display': 'none' } : null}
                          onClick={this.handleStart}
                      >
                        play_arrow
                      </IconButton>
                      <IconButton
                          iconClassName="material-icons"
                          tooltip="Stop"
                          style={this.props.status === 'STOPPED' ? { 'display': 'none' } : null}
                          onClick={this.handleStop}
                      >
                        pause
                      </IconButton>
                      <IconButton
                          iconClassName="material-icons"
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

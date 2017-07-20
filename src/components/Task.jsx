import React, { Component } from 'react';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import duration from './utils/duration';

import style from './Task.less';


export default class Task extends Component {
    state = {
      isHovered: false,
      isComplete: false,
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

    handleUpdate = () => {
      this.props.onUpdate(this.props.id, { isComplete: this.state.isComplete });
    }

    handleComplete = (e, isInputChecked) => {
      this.setState({ isComplete: isInputChecked }, this.handleUpdate);
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
        transition: 'opacity 1s linear 1s'
      };
      const { id, name, description, isComplete } = this.props;
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
                      <span>{duration(this.props.time)}</span>
                    </div>
                    <div className={style.controls}>
                      <IconButton
                          iconClassName="material-icons"
                          tooltip="Reset"
                          disabled={(this.props.status === 'RUNNING') || isComplete}
                          onClick={this.handleReset}
                      >
                        replay
                      </IconButton>
                      <IconButton
                          iconClassName="material-icons"
                          disabled={isComplete}
                          tooltip="Start"
                          style={this.props.status === 'RUNNING' ? { 'display': 'none' } : null}
                          onClick={this.handleStart}
                      >
                        play_arrow
                      </IconButton>
                      <IconButton
                          iconClassName="material-icons"
                          disabled={isComplete}
                          tooltip="Stop"
                          style={this.props.status === 'STOPPED' ? { 'display': 'none' } : null}
                          onClick={this.handleStop}
                      >
                        pause
                      </IconButton>
                      <Checkbox
                          tooltip="Complete"
                          style={checkbox}
                          checked={isComplete}
                          onCheck={this.handleComplete}
                      />
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

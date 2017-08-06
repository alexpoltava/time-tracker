import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import Task from './Task.jsx';

import { action } from '../actions';
import { removeTask } from '../actions';

const mapStateToProps = state => ({
    list: state.tasks.list,
    isFetching: state.tasks.isFetching,
    timers: state.timers,
});

const mapDispatchToProps = dispatch => ({
        removeTask: (key) => dispatch(removeTask(key)),
        start: (id, dateStart, timeLogged) => dispatch(action('START', { id, dateStart, timeLogged })),
        stop: (id, dateStart, timeLogged) => dispatch(action('STOP', { id, dateStart, timeLogged })),
        reset: (id) => dispatch(action('RESET', { id })),
        onUpdate: (id, params) =>  dispatch(action('UPDATE_TASK', { key: id, ...params })),
    });

@connect(mapStateToProps, mapDispatchToProps)
export default class TaskList extends Component {
    onDelete = (key) => {
      this.props.removeTask(key);
    }

    render() {
      const { list, filter, isFetching, timers } = this.props;
        return (
          <div>
            {
              !isFetching
              ? Object.keys(list).filter(key => list[key].name ? list[key].name.toLowerCase().includes(filter.toLowerCase()) : false)
                .reverse().map(key => {
                  const item = list[key];
                  const timer = timers.find(timer => (timer.id === key));
                  return (<Task
                    key={key}
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    dateStart={item.dateStart || 0}
                    dateComplete={item.dateComplete || 0}
                    timeLogged={item.timeLogged || 0}
                    time={timer.time}
                    status={timer.status}
                    start={this.props.start}
                    stop={this.props.stop}
                    reset={this.props.reset}
                    onDelete={this.onDelete}
                    onUpdate={this.props.onUpdate}
                    isComplete={item.isComplete}
                  />);
                  }
                )
              : <CircularProgress />
            }
          </div>
        );
    }
}

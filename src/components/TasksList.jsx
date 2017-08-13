import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import Task from './Task.jsx';

import { action, UPDATE_TASK } from '../actions';
import { removeTask } from '../actions';

const mapStateToProps = state => ({
    list: state.tasks.list,
    isFetching: state.tasks.isFetching,
    timers: state.timers,
});

const mapDispatchToProps = dispatch => ({
        removeTask: (key) => dispatch(removeTask(key)),
        start: (id, params) => dispatch(action(UPDATE_TASK, { key: id, isPaused: false, ...params })),
        stop: (id, params) => {
          dispatch(action(UPDATE_TASK, { key: id, dateStart: 0, isPaused: true, ...params }));
          dispatch(action('TICK', { id, timeElapsed: params.timeLogged }));
        },
        reset: (id, params) => { dispatch(action('RESET', { id, ...params })); dispatch(action(UPDATE_TASK, { key: id, timeLogged: 0, ...params }));},
        onUpdate: (id, params) =>  dispatch(action(UPDATE_TASK, { key: id, ...params })),
    });

@connect(mapStateToProps, mapDispatchToProps)
export default class TaskList extends Component {
    onDelete = (payload) => {
      this.props.removeTask(payload);
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
                    isPaused={item.isPaused}
                    time={timer.time}
                    status={timer.status}
                    start={this.props.start}
                    stop={this.props.stop}
                    reset={this.props.reset}
                    onDelete={this.onDelete}
                    onUpdate={this.props.onUpdate}
                    isComplete={item.isComplete}
                    uid={this.props.uid}
                    readOnly={this.props.readOnly}
                  />);
                  }
                )
              : <CircularProgress />
            }
          </div>
        );
    }
}

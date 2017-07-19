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
        start: (id) => dispatch(action('START', {id})),
        stop: (id) => dispatch(action('STOP', {id})),
        reset: (id) => dispatch(action('RESET', {id})),
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
                .reverse().map(key =>
                  <Task
                    key={key}
                    id={list[key].id}
                    name={list[key].name}
                    description={list[key].description}
                    dateStart={list[key].dateStart || 0}
                    dateComplete={list[key].dateComplete || 0}
                    time={timers.find(timer => (timer.id === key)).time}
                    status={timers.find(timer => (timer.id === key)).status}
                    start={this.props.start}
                    stop={this.props.stop}
                    reset={this.props.reset}
                    onDelete={this.onDelete}
                    onUpdate={this.props.onUpdate}
                    isDone={list[key].isDone}
                  />
                )
              : <CircularProgress />
            }
          </div>
        );
    }
}

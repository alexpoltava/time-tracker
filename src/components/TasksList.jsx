import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import Task from './Task.jsx';

import { action } from '../actions';
import { taskRemove } from '../actions';

const mapStateToProps = state => ({
    list: state.tasks.list,
    isFetching: state.tasks.isFetching,
    timers: state.timers
});

const mapDispatchToProps = dispatch => ({
        taskRemove: (key) => dispatch(taskRemove(key)),
        start: (id) => dispatch(action('START', {id})),
        stop: (id) => dispatch(action('STOP', {id})),
        reset: (id) => dispatch(action('RESET', {id}))
    });

@connect(mapStateToProps, mapDispatchToProps)
export default class TaskList extends Component {
    onDelete = (key) => {
      this.props.taskRemove(key);
    }

    render() {
      const { list, filter, isFetching } = this.props;
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
                    time={this.props.timers.find(timer => (timer.id === key)).time}
                    status={this.props.timers.find(timer => (timer.id === key)).status}
                    start={this.props.start}
                    stop={this.props.stop}
                    reset={this.props.reset}
                    onDelete={this.onDelete}
                  />
                )
              : <CircularProgress />
            }
          </div>
        );
    }
}

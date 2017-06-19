import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import Task from './Task.jsx';
import { taskRemove } from '../actions';

const mapStateToProps = state => ({
    list: state.tasks.list,
    isFetching: state.tasks.isFetching
});

@connect(mapStateToProps, { taskRemove })
export default class TaskList extends Component {
    onDelete = (key) => {
      this.props.taskRemove(key);
    }

    render() {
      const { list, isFetching } = this.props;
        return (
          <div>
            {
              !isFetching
              ? Object.keys(list).map(key =>
                  <Task
                    key={key}
                    id={list[key].id}
                    name={list[key].name}
                    onDelete={this.onDelete}
                  />
                )
              : <CircularProgress />
            }
          </div>
        );
    }
}

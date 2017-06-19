import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import Task from './Task.jsx';

const mapStateToProps = state => ({
    list: state.tasks.list,
    isFetching: state.tasks.isFetching
});

@connect(mapStateToProps)
export default class TaskList extends Component {
    render() {
      const { list, isFetching } = this.props;

        return (
          <div>
            {
              !isFetching
              ? Object.keys(list).map(key =>
                  <Task
                    key={key}
                    name={list[key].name}
                  />
                )
              : <CircularProgress />
            }
          </div>
        );
    }
}

import React, { Component } from 'react';

import TasksList from './TasksList.jsx';
import AddTask from './AddTask.jsx';
import FilterTasks from './FilterTasks.jsx';

export default class ViewTasks extends Component {
    state = {
        filter: ''
    }

    handleChange = (filter) => {
      this.setState({filter});
    }

    render() {
        return (
            <div>
                <AddTask />
                <FilterTasks
                  handleChange={this.handleChange}
                />
                <TasksList
                  filter={this.state.filter}
                />
            </div>
        );
    }
}

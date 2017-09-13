import React, { Component } from 'react';

import TasksList from './TasksList.jsx';
import AddTask from './AddTask.jsx';
import FilterTasks from './FilterTasks.jsx';

import styles from './ViewTasks.less';

export default class ViewTasks extends Component {
    state = {
        value: '',
        category: ''
    }

    handleChange = (filter) => {
      this.setState(filter);
    }

    render() {
        return (
            <div className={styles.root}>
                <AddTask
                  uid={this.props.uid}
                  readOnly={this.props.readOnly}
                />
                <FilterTasks
                  handleChange={this.handleChange}
                />
                <TasksList
                  filter={this.state}
                  uid={this.props.uid}
                  readOnly={this.props.readOnly}
                />
            </div>
        );
    }
}

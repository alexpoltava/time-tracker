import React, { Component } from 'react';
import { connect } from 'react-redux';

import TasksList from './TasksList.jsx';
import AddTask from './AddTask.jsx';

export default class View extends Component {
    render() {
        return (
            <div>
                <AddTask />
                <TasksList />
            </div>
        );
    }
}

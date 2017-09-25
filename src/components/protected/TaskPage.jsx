import React, { Component } from 'react';
import { connect } from 'react-redux';
import { defaultCategories } from '../../config/constants';
import Paper from 'material-ui/Paper';


export default class TaskPage extends Component {
    render() {
        return (
            <Paper>
                {this.props.match.params.task}
            </Paper>
        );
    }
}

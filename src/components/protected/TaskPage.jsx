import React, { Component } from 'react';
import { defaultCategories } from '../../config/constants';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class TaskPage extends Component {
    handleHide = () => {
      const { history, uid } = this.props;
      history.push(`/dashboard/${uid}`);
    }

    render() {
        const { category, item } = this.props;
        return (
            item
            ?
            <Paper>
                <h3>Task info</h3>
                <TextField
                  id="name"
                  disabled
                  floatingLabelText="Task name"
                  floatingLabelFixed
                  value={item.name}
                /><br />
                <TextField
                  id="description"
                  disabled
                  floatingLabelText="Task description"
                  floatingLabelFixed
                  value={item.description}
                /><br />
                <TextField
                  id="category"
                  disabled
                  floatingLabelText="Task category"
                  floatingLabelFixed
                  value={category}
                /><br />
                <TextField
                  id="tags"
                  disabled
                  floatingLabelText="Task tags"
                  floatingLabelFixed
                  value={item.tags}
                /><br />
                <TextField
                  id="started"
                  disabled
                  floatingLabelText="Task started"
                  floatingLabelFixed
                  value={new Date(item.periods[0].dateStart)}
                /><br />
                <TextField
                  id="completed"
                  disabled
                  floatingLabelText="Task completed"
                  floatingLabelFixed
                  value={item.isComplete ? 'yes' : 'no'}
                /><br />
                <RaisedButton
                  label="hide"
                  onClick={this.handleHide}
                />
            </Paper>
            :
            <Paper>
                <h3>Task info</h3>
                <span>No data...</span>
                <RaisedButton
                  label="hide"
                  onClick={this.handleHide}
                />
            </Paper>
        );
    }
}

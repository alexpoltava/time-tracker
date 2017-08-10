import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';

import { addTask } from '../actions';

import styles from './AddTask.less';

const tempCategories = [
  {id: 1, name: 'Work'},
  {id: 2, name: 'Shopping'},
  {id: 3, name: 'Entertainment'},
  {id: 4, name: 'Sport'}
];

const mapStateToProps = (state) => ({
});

@connect(mapStateToProps, { addTask })
class AddTask extends Component {
    state = {
      showAddDialog: false,
      name: '',
      isNameValid: true,
      tagsString: '',
      description: '',
      isTagsValid: true,
      category: 0,
      dateTimeStart: null,
      dateTimeComplete: null,
      timeLogged: 0,
      isPaused: false,
      isDateValid: true,
      isComplete: false
    }

    handleOpen = () => {
      this.setState({showAddDialog: true, dateTimeStart: new Date()});
    }

    handleClose = () => {
      this.setState({showAddDialog: false});
    }

    handleNameChange = (e) => {
      this.setState({ name: e.target.value, isNameValid: true });
    }

    tagsStringToArray = (str) => str.replace(/[\s,;.]/g, '').split('#').filter(el => el !== '');

    tagsArrayToString = (arr) => arr.reduce((str, tag) => str += `#${tag}`, '');

    handleTagsChange = (e) => {
      this.setState({ tagsString: e.target.value, isTagsValid: true });
    }

    handleDescriptionChange = (e) => {
      this.setState({ description: e.target.value});
    }

    handleCategoryChange = (event, index, value) => this.setState({category: value});

    validateInput = () => {
      let isInputValid = true;
      if (this.state.name === '') {
          this.setState({ isNameValid: false });
          isInputValid = false;
      }
      if ((this.state.dateTimeStart >= this.state.dateTimeComplete) && this.state.isComplete) {
          this.setState({ isDateValid: false });
          isInputValid = false;
      }
      return isInputValid;
    }

    combineDateTime = (date, time) => {
      const year = new Date(date).getFullYear();
      const month = new Date(date).getMonth();
      const day = new Date(date).getDate();
      const hour = new Date(time).getHours();
      const minutes = new Date(time).getMinutes();

      const newDateTime = new Date(year, month, day, hour, minutes);
      const now = +Date.now();

      return  newDateTime >  now ? now : newDateTime;
    }

    handleDateStartChange = (event, date) => {
        this.setState({
          dateTimeStart: this.combineDateTime(date, this.state.dateTimeStart),
          isDateValid: true
        });
    }

    handleTimeStartChange = (event, time) => {
      this.setState({
        dateTimeStart: this.combineDateTime(this.state.dateTimeStart, time),
        isDateValid: true
      });
    }

    handleCompleteChange = () => this.setState({
      isComplete: !this.state.isComplete,
      isPaused: !this.state.isComplete
    });

    handleDateCompleteChange = (event, date) => {
      this.setState({
        dateTimeComplete: this.combineDateTime(date, this.state.dateTimeComplete),
        isDateValid: true
      });
    }

    handleTimeCompleteChange = (event, time) => {
      this.setState({
        dateTimeComplete: this.combineDateTime(this.state.dateTimeComplete, time),
        isDateValid: true
      });
    }

    handleAdd = () => {
      if (this.validateInput()) {
        const { name, tagsString, description, category, dateTimeStart, dateTimeComplete, timeLogged, isPaused, isComplete } = this.state;
        const tagsArray = this.tagsStringToArray(tagsString);
        const dateStart = +dateTimeStart;
        const dateComplete = +dateTimeComplete || null;
        this.props.addTask({
            name,
            tagsArray,
            description,
            category,
            dateStart,
            dateComplete,
            timeLogged: isComplete ? (dateComplete - dateStart) / 1000 : timeLogged,
            isPaused,
            isComplete,
            uid: this.props.uid,
        });
        this.setState({showAddDialog: false});
      }
    }

    render() {
        const actions = [
             <FlatButton
               label="CANCEL"
               primary={false}
               onTouchTap={this.handleClose}
             />,
             <FlatButton
               label="ADD"
               primary={true}
               onTouchTap={this.handleAdd}
             />
           ];
        return (
            <div className={styles.root}>
                <RaisedButton
                    label='Add new task'
                    disabled={this.state.showAddDialog}
                    onTouchTap={this.handleOpen}
                />
                <Dialog
                    actions={actions}
                    autoDetectWindowHeight
                    title="Add new Task"
                    modal={true}
                    autoScrollBodyContent={true}
                    open={this.state.showAddDialog}
                >
                  <TextField
                    className={styles.input}
                    hintText="Task name"
                    errorText={this.state.isNameValid ? '' : 'Task name is required'}
                    name="Name"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                  />
                  <TextField
                    className={styles.input}
                    hintText="Task description"
                    name="Description"
                    value={this.state.description}
                    onChange={this.handleDescriptionChange}
                  />
                  <TextField
                    className={styles.input}
                    hintText="Task tags (e.g. #tag1 #tag2...)"
                    errorText={this.state.isTagsValid ? '' : 'Input is not valid'}
                    name="Tags"
                    value={this.state.tagsString}
                    onChange={this.handleTagsChange}
                  />
                  <SelectField
                    autoWidth={true}
                    floatingLabelText="Category"
                    value={this.state.category}
                    onChange={this.handleCategoryChange}
                  >
                  {
                    tempCategories.map(cat=>
                    <MenuItem key={cat.id} value={cat.id} primaryText={cat.name} />
                    )
                  }
                  </SelectField>
                  <div>
                    <DatePicker
                      autoOk
                      className={styles.input}
                      defaultDate={new Date()}
                      hintText='Task started'
                      maxDate={new Date()}
                      value={this.state.dateTimeStart}
                      onChange={this.handleDateStartChange}
                    />
                    <TimePicker
                      autoOk
                      defaultTime={new Date()}
                      hintText="time"
                      minutesStep={5}
                      value={this.state.dateTimeStart}
                      onChange={this.handleTimeStartChange}
                    />
                  </div>
                  <Checkbox
                    label="Completed task"
                    checked={this.state.isComplete}
                    onCheck={this.handleCompleteChange}
                  />
                <div style={{display: `${this.state.isComplete ? 'block' : 'none'}`}}>
                    <DatePicker
                      autoOk
                      className={styles.input}
                      errorText={this.state.isDateValid ? '' : 'Completion time shoud be after start time'}
                      hintText='Task completed on date'
                      maxDate={new Date()}
                      value={this.state.dateTimeComplete}
                      onChange={this.handleDateCompleteChange}
                    />
                    <TimePicker
                      autoOk
                      hintText="time"
                      errorText={this.state.isDateValid ? '' : 'Completion time shoud be after start time'}
                      minutesStep={5}
                      value={this.state.dateTimeComplete}
                      onChange={this.handleTimeCompleteChange}
                    />
                  </div>
                </Dialog>
            </div>
        );
    }
}

export default AddTask;

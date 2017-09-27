import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up';

import { action, UPDATE_TASK } from '../../actions';

import '../../assets/animations.css';
import Timeline from './Timeline.jsx';

import { defaultCategories } from '../../config/constants';

const mapDispatchToProps = dispatch => ({
        updateTask: (id, params) => dispatch(action(UPDATE_TASK, { key: id, ...params })),
    });

@connect(null, mapDispatchToProps)
export default class TaskPage extends Component {
    state = {
      name: '',
      description: '',
      category: 0,
      tagsString: '',
      isComplete: false,
      isTagsValid: true,
      isNameValid: true,
    }

    syncStateWithProps = (item) => {
      const { name, description, category, tagsArray, isComplete } = item;
      this.setState({
        name,
        description,
        category,
        tagsString: this.tagsArrayToString(tagsArray),
        isComplete,
      });
    }

    componentWillReceiveProps(nextProps) {
      nextProps.item
      ? this.syncStateWithProps(nextProps.item)
      : null;
    }

    handleNameChange = (e) => {
      this.setState({ name: e.target.value, isNameValid: true });
    }

    tagsStringToArray = (str) => str.replace(/[\s,;.]/g, '').split('#').filter(el => el !== '');

    tagsArrayToString = (arr) => arr.map(tag => `#${tag}`).join(' ');

    handleTagsChange = (e) => {
      this.setState({ tagsString: e.target.value, isTagsValid: true });
    }

    handleDescriptionChange = (e) => {
      this.setState({ description: e.target.value});
    }

    handleCategoryChange = (event, index, value) => this.setState({category: value});

    handleCompleteChange = () => this.setState({
      isComplete: !this.state.isComplete
    })

    validateInput = () => {
      let isInputValid = true;
      if (this.state.name === '') {
          this.setState({ isNameValid: false });
          isInputValid = false;
      }
      return isInputValid;
    }

    handleUpdate = () => {
      if (this.validateInput()) {
        const { name, description, category, tagsString, isComplete } = this.state;
        const tagsArray = this.tagsStringToArray(tagsString);
        this.props.updateTask(this.props.item.id, {
            name,
            description,
            category,
            tagsArray,
            isComplete,
          }
        );
      }
    }

    handleHide = () => {
      const { history, uid } = this.props;
      history.push(`/dashboard/${uid}`);
    }

    render() {
        const style = {
            root: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: this.props.isMenuOpen ? '70%' : '100%',
              },
            columnsContainer: {
                display: 'flex',
                flexDirection: 'row',
            },
            column: {
                margin: '12px',
            },
            hideButton: {
                margin: '12px',
                alignSelf: 'flex-end',
            }
          };
        const { category, item } = this.props;
        return (
            item
            ? <CSSTransitionGroup
                  transitionName="fading"
                  transitionAppear={true}
                  transitionAppearTimeout={500}
                  transitionEnter={false}
                  transitionLeave={false}
              >
                <div
                  key={1}
                  style={style.root}
                >
                  <h3>Task info</h3>
                  <div style={style.columnsContainer}>
                    <div style={style.column}>
                      <TextField
                        id="name"
                        floatingLabelText="Task name"
                        floatingLabelFixed
                        errorText={this.state.isNameValid ? '' : 'Task name is required'}
                        value={this.state.name}
                        onChange={this.handleNameChange}
                      /><br />
                      <TextField
                        id="description"
                        floatingLabelText="Task description"
                        floatingLabelFixed
                        value={this.state.description}
                        onChange={this.handleDescriptionChange}
                      /><br />
                      <SelectField
                        autoWidth={true}
                        floatingLabelText="Category"
                        floatingLabelFixed
                        value={this.state.category}
                        onChange={this.handleCategoryChange}
                      >
                      {
                        this.props.categories.map(cat=>
                        <MenuItem key={cat.id} value={cat.id} primaryText={cat.name} />
                        )
                      }
                      </SelectField><br />
                    </div>
                    <div style={style.column}>
                      <TextField
                        id="tags"
                        floatingLabelText="Task tags"
                        floatingLabelFixed
                        errorText={this.state.isTagsValid ? '' : 'Input is not valid'}
                        value={this.state.tagsString}
                        onChange={this.handleTagsChange}
                      /><br />
                      <TextField
                        id="started"
                        disabled
                        floatingLabelText="Task started"
                        floatingLabelFixed
                        value={new Date(item.periods[0].dateStart)}
                      /><br />
                    <Checkbox
                        id="completed"
                        label="Task completed"
                        checked={this.state.isComplete}
                        style={{marginTop: '36px'}}
                        onCheck={this.handleCompleteChange}
                      /><br />
                    </div>
                  </div>
                  <Timeline />
                  <RaisedButton
                    label="update"
                    onClick={this.handleUpdate}
                    style={style.hideButton}
                  />
                  <RaisedButton
                    label="hide"
                    icon={<ArrowDropUp />}
                    onClick={this.handleHide}
                    style={style.hideButton}
                  />
              </div>
              </CSSTransitionGroup>
            : <div style={style.root}>
                  <CircularProgress />
              </div>
        );
    }
}

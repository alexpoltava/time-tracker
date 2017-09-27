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
      id: '',
      name: '',
      description: '',
      category: 0,
      tagsString: '',
      isNameValid: true,
    }

    syncStateWithProps = (item) => {
      const { id, name, description, category, tagsArray } = item;
      this.setState({
        id,
        name,
        description,
        category,
        tagsString: this.tagsArrayToString(tagsArray || []),
      });
    }

    componentDidMount() {
      this.props.item
      ? this.syncStateWithProps(this.props.item)
      : null;
    }

    componentWillReceiveProps(nextProps) {
      nextProps.item && (this.state.id !== nextProps.item.id)
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
        const { name, description, category, tagsString } = this.state;
        const { uid } = this.props;
        const tagsArray = this.tagsStringToArray(tagsString);
        this.props.updateTask(this.props.item.id, {
            name,
            description,
            category,
            tagsArray,
            uid,
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
            buttonBox: {
              display: 'flex',
              flexDirection: 'row',
              alignSelf: 'flex-end',
            },
            updateButton: {
              margin: '12px',
            },
            hideButton: {
                margin: '12px',
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
                        disabled={this.props.readOnly}
                        floatingLabelText="Task name"
                        floatingLabelFixed
                        errorText={this.state.isNameValid ? '' : 'Task name is required'}
                        value={this.state.name}
                        onChange={this.handleNameChange}
                      /><br />
                      <TextField
                        id="description"
                        disabled={this.props.readOnly}
                        floatingLabelText="Task description"
                        floatingLabelFixed
                        value={this.state.description}
                        onChange={this.handleDescriptionChange}
                      /><br />
                      <SelectField
                        autoWidth={true}
                        disabled={this.props.readOnly}
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
                        disabled={this.props.readOnly}
                        floatingLabelText="Task tags"
                        floatingLabelFixed
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
                        checked={this.props.isComplete}
                        disabled
                        style={{marginTop: '36px'}}
                      /><br />
                    </div>
                  </div>
                  <Timeline />
                  <div style={style.buttonBox}>
                    <RaisedButton
                      label="update"
                      backgroundColor="#FFEA00"
                      disabled={this.props.readOnly || !this.state.isNameValid}
                      style={style.updateButton}
                      onClick={this.handleUpdate}
                    />
                    <RaisedButton
                      label="hide"
                      icon={<ArrowDropUp />}
                      style={style.hideButton}
                      onClick={this.handleHide}
                    />
                  </div>
              </div>
              </CSSTransitionGroup>
            : <div style={style.root}>
                  <CircularProgress />
              </div>
        );
    }
}
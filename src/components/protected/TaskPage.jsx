import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up';
import moment from 'moment';

import { action, UPDATE_TASK } from '../../actions';

import '../../assets/animations.css';
import Timeline from './Timeline.jsx';

import { defaultCategories } from '../../config/constants';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

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
      data: [],
    }

    syncStateWithProps = (item) => {
      const { id, name, description, category, tagsArray, periods } = item;
      this.setState({
        id,
        name,
        description,
        category,
        tagsString: this.tagsArrayToString(tagsArray || []),
        data: this.updateData(periods),
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

    createDaysArray = (start, end) => {
      const array = [];
      for(let i = start; i <= end; i += MILLISECONDS_PER_DAY) {
          array.push(i);
      }
      return array;
    }

    updateData = (periods) => {
      return periods.reduce((result, period) => {
          const dateStart = period.dateStart;
          const dateComplete = period.dateComplete || +new Date();
          const days = this.createDaysArray(moment(dateStart).startOf('day'), moment(dateComplete).startOf('day'));
          const dailyTime = days.map(day => {
            const end = (dateComplete > moment(day).endOf('day')) ? moment(day).endOf('day') : dateComplete;
            const start = (dateStart < day) ? day : dateStart;;
            return [+new Date(day), (end - start) / (60 * 60 * 1000)];
          });
          return [...result, ...dailyTime];
        }, []);
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
            container: {
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
            },
            field: {
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
            ? <TransitionGroup>
              <CSSTransition
                classNames="fading"
                appear={true}
                key={1}
                timeout={{appear: 500}}
              >
                <div
                  style={style.root}
                >
                  <h3>Task info</h3>
                  <div style={style.container}>
                      <TextField
                        id="name"
                        disabled={this.props.readOnly}
                        floatingLabelText="Task name"
                        floatingLabelFixed
                        errorText={this.state.isNameValid ? '' : 'Task name is required'}
                        style={style.field}
                        value={this.state.name}
                        onChange={this.handleNameChange}
                      /><br />
                      <TextField
                        id="description"
                        disabled={this.props.readOnly}
                        floatingLabelText="Task description"
                        floatingLabelFixed
                        style={style.field}
                        value={this.state.description}
                        onChange={this.handleDescriptionChange}
                      /><br />
                      <SelectField
                        autoWidth={true}
                        disabled={this.props.readOnly}
                        floatingLabelText="Category"
                        floatingLabelFixed
                        style={style.field}
                        value={this.state.category}
                        onChange={this.handleCategoryChange}
                      >
                      {
                        this.props.categories.map(cat=>
                        <MenuItem key={cat.id} value={cat.id} primaryText={cat.name} />
                        )
                      }
                      </SelectField><br />
                      <TextField
                        id="tags"
                        disabled={this.props.readOnly}
                        floatingLabelText="Task tags"
                        floatingLabelFixed
                        style={style.field}
                        value={this.state.tagsString}
                        onChange={this.handleTagsChange}
                      /><br />
                  </div>
                  <Timeline
                    data={this.state.data}
                    id={this.state.id}
                  />
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
               </CSSTransition>
               </TransitionGroup>
              : <div style={style.root}>
                    <CircularProgress />
                </div>
        );
    }
}

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import { CSSTransitionGroup } from 'react-transition-group';

import Task from './Task.jsx';
import { action, UPDATE_TASK } from '../actions';
import { removeTask } from '../actions';
import { defaultCategories } from '../config/constants';

import styles from './TasksList.less';
import '../assets/animations.css';

const mapStateToProps = state => ({
    categories: [...defaultCategories, ...state.settings.categories],
    list: state.tasks.list,
    isFetching: state.tasks.isFetching,
    timers: state.timers,
    hideCompleted: state.settings.hideCompleted,
});

const mapDispatchToProps = dispatch => ({
        removeTask: (key) => dispatch(removeTask(key)),
        start: (id, params) => dispatch(action(UPDATE_TASK, { key: id, isPaused: false, ...params })),
        stop: (id, params) => dispatch(action(UPDATE_TASK, { key: id, isPaused: true, ...params })),
        reset: (id, params) => dispatch(action(UPDATE_TASK, { key: id, periods: [], ...params })),
        onUpdate: (id, params) =>  dispatch(action(UPDATE_TASK, { key: id, ...params })),
    });

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class TaskList extends Component {
    state = {
      openSB: false,
    }

    onDelete = (payload) => {
      this.setState({ openSB: true });
      this.props.removeTask(payload);
    }

    onDoubleClick = (id) => {
      const { match, history } = this.props;
      const url = match.url;
      history.push(`${url}${url.endsWith("/") ? "" : "/"}${id}`);
    }

    handleRequestCloseSB = () => { this.setState({ openSB: false })}

    render() {
      const { list, filter, isFetching, timers } = this.props;
        return (
          <div className={styles.root}>
            {
              !isFetching
              ? <CSSTransitionGroup
                    transitionName="fading"
                    transitionEnter={true}
                    transitionEnterTimeout={500}
                    transitionLeave={true}
                    transitionLeaveTimeout={500}
                    style={{width: '100%'}}
                >{
                  Object.keys(list).filter(key => list[key].name ? list[key].name.toLowerCase().includes(filter.value.toLowerCase()) : false)
                  .filter(key => (list[key].category === filter.category) || !filter.category)
                  .filter(key => (this.props.hideCompleted ? (!list[key].isComplete) : true))
                  .reverse().map(key => {
                    const item = list[key];
                    const timer = timers.find(timer => (timer.id === key));
                    return (<Task
                      key={key}
                      id={item.id}
                      name={item.name}
                      category={this.props.categories.find(cat => cat.id === item.category).name}
                      tagsArray={item.tagsArray}
                      description={item.description}
                      dateStart={item.dateStart || 0}
                      dateComplete={item.dateComplete || 0}
                      periods={item.periods || 0}
                      isPaused={item.isPaused}
                      time={timer.time}
                      status={timer.status}
                      start={this.props.start}
                      stop={this.props.stop}
                      reset={this.props.reset}
                      onDelete={this.onDelete}
                      onUpdate={this.props.onUpdate}
                      onDoubleClick={this.onDoubleClick}
                      isComplete={item.isComplete}
                      uid={this.props.uid}
                      readOnly={this.props.readOnly}
                    />);
                    }
                  )
                 }
                </CSSTransitionGroup>
              : <CircularProgress />
            }
            <Snackbar
              open={this.state.openSB}
              message="Task was removed from your list"
              autoHideDuration={2000}
              onRequestClose={this.handleRequestCloseSB}
            />
          </div>
        );
    }
}

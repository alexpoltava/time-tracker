import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up';

import '../../assets/animations.css';
import Timeline from './Timeline.jsx';

import { defaultCategories } from '../../config/constants';

export default class TaskPage extends Component {
    state = {
        testItems: ['one', 'two', 'three']
    }

    handleAddItem = () => {
      this.setState({
        testItems: [...this.state.testItems, 'test']
      });
    }

    handleRemoveItem = (i) => {
      this.setState({
        testItems: this.state.testItems.filter((el, index) => index !== i)
      });
    }

    handleHide = () => {
      const { history, uid } = this.props;
      history.push(`/dashboard/${uid}`);
    }

    render() {
        const items = this.state.testItems.map((el, index) => (
          <div key={index} onClick={() => this.handleRemoveItem(index)}>{el}</div>
        ));
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
                        value={item.name}
                      /><br />
                      <TextField
                        id="description"
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
                    </div>
                    <div style={style.column}>
                      <TextField
                        id="tags"
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
                    </div>
                  </div>
                  <Timeline />
                  <RaisedButton
                    label="hide"
                    icon={<ArrowDropUp />}
                    onClick={this.handleHide}
                    style={style.hideButton}
                  />
              </div>
              </CSSTransitionGroup>
            : <CSSTransitionGroup
                  transitionName="fading"
                  transitionAppear={true}
                  transitionAppearTimeout={500}
                  transitionEnter={false}
                  transitionLeave={false}
              >
                <div key={1}>
                    <h3>No data...</h3>
                    <RaisedButton
                      label="hide"
                      icon={<ArrowDropUp />}
                      onClick={this.handleHide}
                      style={style.hideButton}
                    />
                </div>
              </CSSTransitionGroup>
        );
    }
}

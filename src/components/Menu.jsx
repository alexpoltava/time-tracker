import React, { Component } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Watch from 'material-ui/svg-icons/hardware/watch';
import Feedback from 'material-ui/svg-icons/action/feedback';
import Settings from 'material-ui/svg-icons/action/settings';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import Chart from 'material-ui/svg-icons/editor/multiline-chart';
import Divider from 'material-ui/Divider';

import Media from 'react-responsive';
import { SMALL_SCREEN } from '../config/constants';


const styleItem = {
    display: 'flex'
};

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends Component {
        componentWillMount() {
            this.setState({
                selectedIndex: this.props.defaultValue,
            });
        }

        handleRequestChange = (event, index) => {
            this.props.onSelectMenuItem(index);
            this.setState({
                selectedIndex: index,
            });
        }

        render() {
            return (
                <ComposedComponent
                  value={this.state.selectedIndex}
                  onChange={this.handleRequestChange}
                >
                    {this.props.children}
                </ComposedComponent>
            );
        }
  };
}

SelectableList = wrapState(SelectableList);

export default class Menu extends Component {
    render() {
        return (
          <Media maxDeviceWidth={SMALL_SCREEN}>
            {(match) =>
                <SelectableList
                    defaultValue={1}
                    onSelectMenuItem={this.props.onSelectMenuItem}
                >
                    <ListItem
                      value={1}
                      primaryText="Tasks"
                      leftIcon={<Watch />}
                      style={styleItem}
                    />
                    <ListItem
                      value={2}
                      primaryText="Analytics"
                      leftIcon={<Chart />}
                      style={styleItem}
                    />
                    <ListItem
                      value={3}
                      primaryText="Settings"
                      leftIcon={<Settings />}
                      style={styleItem}
                    />
                    <ListItem
                      value={4}
                      primaryText="About"
                      leftIcon={<Feedback />}
                      style={styleItem}
                    />
                  <Divider style={{display: match ? null : 'none'}} />
                    <ListItem
                      value={5}
                      primaryText="Logout"
                      leftIcon={<ExitToApp />}
                      style={{...styleItem, display: match ? 'flex' : 'none'}}
                    />
                </SelectableList>
              }
            </Media>
        );
    }
}

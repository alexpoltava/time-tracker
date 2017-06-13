import React, { Component } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Watch from 'material-ui/svg-icons/hardware/watch';
import Feedback from 'material-ui/svg-icons/action/feedback';
import Settings from 'material-ui/svg-icons/action/settings';
import Chart from 'material-ui/svg-icons/editor/multiline-chart';


const styleItem = {
    display: 'flex'
};

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends Component {
        constructor() {
            super();

            this.handleRequestChange = this.handleRequestChange.bind(this);
        }

        componentWillMount() {
            this.setState({
                selectedIndex: this.props.defaultValue,
            });
        }

        handleRequestChange(event, index) {
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
    constructor() {
        super();
    }

    render() {
        return (
            <SelectableList defaultValue={1}>
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
            </SelectableList>
        );
    }
}

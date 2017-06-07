import React, { Component } from 'react';

export default class LoggedInLayout extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

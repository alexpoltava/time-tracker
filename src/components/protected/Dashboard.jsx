import React, { Component } from 'react';

import Sidebar from '../Sidebar.jsx';
import View from '../View.jsx';

import styles from './Dashboard.less';

export default class Dashboard extends Component {
    state = {
        menuItem: 0
    };

    onSelectMenuItem = (item) => {
        this.setState({ menuItem: item });
    }

    render() {
        return (
            <div className={styles.root}>
                <Sidebar onSelectMenuItem={this.onSelectMenuItem} />
                <View menuItem={this.state.menuItem} />
            </div>
        );
    }
}

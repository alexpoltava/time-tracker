import React, { Component } from 'react';

import Sidebar from '../Sidebar.jsx';
import View from '../View.jsx';

import styles from './Dashboard.less';

export default class Dashboard extends Component {

    render() {
        return (
            <div className={styles.root}>
                <Sidebar />
                <View />
            </div>
        );
    }
}

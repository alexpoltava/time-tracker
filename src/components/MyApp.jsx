import React, { Component } from 'react';
import Timer from './Timer.jsx';
import styles from './MyApp.less';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class MyApp extends Component {
    render() {
        return (
            <div className={styles.app}>
                <MuiThemeProvider>
                    <div>
                        <Timer />
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
}

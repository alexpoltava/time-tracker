import React, { Component } from 'react';

import ViewTasks from './ViewTasks.jsx';
import ViewAnalytics from './ViewAnalytics.jsx';
import ViewSettings from './ViewSettings.jsx';
import ViewAbout from './ViewAbout.jsx';

export default class View extends Component {
    render() {
        switch (this.props.menuItem) {
            case 2: {
                return <ViewAnalytics />;
            }
            case 3: {
                return <ViewSettings
                          uid={this.props.uid}
                          readOnly={this.props.readOnly}
                       />;
            }
            case 4: {
                return <ViewAbout />;
            }
            default: {
                return <ViewTasks
                          uid={this.props.uid}
                          readOnly={this.props.readOnly}
                        />;
            }
        }
    }
}

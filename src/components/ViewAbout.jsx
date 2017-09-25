import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import FontAwesome from 'react-fontawesome';

export default class ViewAbout extends Component {
    render() {
        return (
            <div>
                <h2>About</h2>
                <a href="https://github.com/alexpoltava/time-tracker" target="_blank">
                    <FontAwesome
                      name="github"
                      style={{ margin: '8px' }}
                      size="2x"
                    />
                    <span>Project on GitHub</span>
                </a>
            </div>
        );
    }
}

import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

import style from './FilterTasks.less';

export default class FilterTasks extends Component {
    state = {
        value: ''
    };

    handleChange = (event) => {
      this.props.handleChange(event.target.value);
      this.setState({
        value: event.target.value,
      });
    }

    render() {
        return (
            <div className={style.root}>
                <TextField
                  hintText="Filter tasks"
                  fullWidth
                  style={{ margin: '24px' }}
                  onChange={this.handleChange}
                  value={this.state.value}
                />
            </div>
        );
    }
}

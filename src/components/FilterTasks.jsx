import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';

import { defaultCategories } from '../config/constants';
import style from './FilterTasks.less';

const mapStateToProps = (state) => ({
  categories: [...defaultCategories, ...state.settings.categories.filter(cat => !cat.isRemoved)]
});

@connect(mapStateToProps)
export default class FilterTasks extends Component {
    state = {
        value: '',
        category: '',
    };

    handleChange = (event) => {
      this.props.handleChange({ value: event.target.value });
      this.setState({
        value: event.target.value,
      });
    }

    handleSelectCategory = (event, index, category) => {
      this.props.handleChange({ category });
      this.setState({ category });
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
                <SelectField
                  value={this.state.category}
                  onChange={this.handleSelectCategory}
                >
                {
                  [
                    <MenuItem key={null} value={null} primaryText="(clear)" />,
                    ...this.props.categories.map(cat =>
                      <MenuItem key={cat.id} value={cat.id} primaryText={cat.name} />
                    )
                  ]
                }
                </SelectField>
            </div>
        );
    }
}

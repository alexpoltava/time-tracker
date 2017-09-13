import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { connect } from 'react-redux';

import { defaultCategories } from '../config/constants';
import style from './FilterTasks.less';

const mapStateToProps = (state) => ({
  usedCategories: Object.keys(state.tasks.list).reduce((result, key) =>
    result.find(cat => cat.id === state.tasks.list[key].category)
    ? result.map(el => el.id === state.tasks.list[key].category ? { id: el.id, number: el.number + 1 } : el)
    : [...result, { id: state.tasks.list[key].category, number: 1 }], []),
  categories: [...defaultCategories, ...state.settings.categories]
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
                  hintText="Filter by category"
                  value={this.state.category}
                  onChange={this.handleSelectCategory}
                >
                {
                  [
                    <MenuItem key={null} value={null} primaryText="" />,
                    ...this.props.usedCategories.map(cat =>
                        <MenuItem
                          key={cat.id}
                          value={cat.id}
                          primaryText={this.props.categories.find(el => el.id === cat.id)
                            ? `${this.props.categories.find(el => el.id === cat.id).name} (${cat.number})`
                            : null}
                        />
                      )
                  ]
                }
                </SelectField>
            </div>
        );
    }
}

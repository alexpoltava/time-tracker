import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import { connect } from 'react-redux';

import { UPDATE_SETTINGS, action } from '../actions'
import { defaultCategories, DEFAULT_CATEGORIES_NUMBER } from '../config/constants';

const style = {
  container: {
    'display': 'flex',
    'flexDirection': 'column',
    'width': '300px'
  },
  hr: {
    'width': '300px',
    'backgroundColor': 'lightgrey',
    'border': 'none',
    'height': '1px'
  }
};

const mapStateToProps = (state) => ({
  hideCompleted: state.settings.hideCompleted,
  categories: state.settings.categories,
});

const mapDispatchToProps = (dispatch) => ({
  updateSettings: (params) => dispatch(action(UPDATE_SETTINGS, {...params}))
});

@connect(mapStateToProps, mapDispatchToProps)
export default class ViewSettings extends Component {
    state = {
      categoryName: '',
      category: '',
    }

    handleUpdateSettings = (props) => {
      const { uid } = this.props;
      this.props.updateSettings({ uid, ...props });
    }

    handleHideCompletedChange = (e, hideCompleted) => {
      this.handleUpdateSettings({ hideCompleted });
    }

    handleChangeCategory = (e, categoryName) => {
      this.setState({ categoryName });
    }

    handleAddCategory = () => {
      if(defaultCategories.find(cat => cat.name === this.state.categoryName)) {
        console.log('Already exists in default categories');
        return;
      }

      const existingIndex = this.props.categories.findIndex(cat => cat.name === this.state.categoryName);
      if(existingIndex !== -1) { // category already exists
        const categories = this.props.categories.map((cat, i) =>
          i === existingIndex ? { ...cat, isRemoved: false } : cat);
        this.handleUpdateSettings({ categories });
      } else { // add new category
        const index = this.props.categories.length + DEFAULT_CATEGORIES_NUMBER;
        const categories = [...this.props.categories, {
            id: index,
            name: this.state.categoryName,
            isRemoved: false
          }];
        this.handleUpdateSettings({ categories });
      }
    }

    handleRemoveCategory = () => {
      const index = this.state.category - DEFAULT_CATEGORIES_NUMBER;
      const categories = this.props.categories.map((cat, i) =>
        i === index ? { ...cat, isRemoved: true } : cat);
      this.setState({ category: '' },
        this.handleUpdateSettings({ categories })
      );
    }

    handleSelectCategory = (event, index, category) => {
      this.setState({ category });
    }

    render() {
        return (
            <div>
                <h2>Settings</h2>
                <div style={style.container}>
                  <Checkbox
                    label="Hide completed tasks"
                    disabled={this.props.readOnly}
                    checked={this.props.hideCompleted}
                    onCheck={this.handleHideCompletedChange}
                  />
                <br />
                <hr style={style.hr} />
                <br />
                  <h3>Categories management:</h3>
                  <TextField
                    disabled={this.props.readOnly}
                    name="category"
                    value={this.state.categoryName}
                    onChange={this.handleChangeCategory}
                  />
                  <FlatButton label="Add"
                    disabled={!this.state.categoryName}
                    onTouchTap={this.handleAddCategory}
                  />
                  <SelectField
                    disabled={this.props.readOnly}
                    value={this.state.category}
                    onChange={this.handleSelectCategory}
                  >
                  {
                    this.props.categories.filter(cat => !cat.isRemoved).map(cat =>
                      <MenuItem key={cat.id} value={cat.id} primaryText={cat.name} />
                    )
                  }
                  </SelectField>
                  <FlatButton label="Remove"
                    disabled={!this.state.category}
                    onTouchTap={this.handleRemoveCategory}
                  />
                </div>
                <span></span>
            </div>
        );
    }
}

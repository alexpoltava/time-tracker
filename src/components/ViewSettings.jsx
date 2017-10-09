import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Add from 'material-ui/svg-icons/content/add';
import Delete from 'material-ui/svg-icons/action/delete';

import { connect } from 'react-redux';

import { UPDATE_SETTINGS, action } from '../actions'
import { defaultCategories, DEFAULT_CATEGORIES_NUMBER } from '../config/constants';

const style = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: '24px',
    width: '70%'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  checkbox: {
    maxWidth: '250px',
  },
  hr: {
    width: '100%',
    backgroundColor: 'lightgrey',
    border: 'none',
    height: '1px'
  },
  addNew: {
    margin: '12px',
    width: '120px',
  },
  delete: {
    margin: '12px',
    width: '120px',
  }
};

const mapStateToProps = (state) => ({
  hideCompleted: state.settings.hideCompleted,
  categories: state.settings.categories,
});

const mapDispatchToProps = (dispatch) => ({
  updateSettings: (params) => dispatch(action(UPDATE_SETTINGS, params))
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
        this.setState({ categoryName: '' },
          console.log('Already exists in default categories'));
        return;
      }

      const categories = this.props.categories.find(cat => cat.name === this.state.categoryName)
      ? this.props.categories.map(cat =>
          cat.name === this.state.categoryName ? { ...cat, isRemoved: false } : cat)
      : [...this.props.categories, {
            id: this.props.categories.length + DEFAULT_CATEGORIES_NUMBER,
            name: this.state.categoryName,
            isRemoved: false
          }];
      this.setState({ categoryName: '' },
            this.handleUpdateSettings({ categories }));

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
            <div style={{...style.root, width: this.props.isMenuOpen ? '70%' : '95%'}}>
                <h2>Settings</h2>
                <div style={style.container}>
                  <Checkbox
                    label="Hide completed tasks"
                    disabled={this.props.readOnly}
                    checked={this.props.hideCompleted}
                    style={style.checkbox}
                    onCheck={this.handleHideCompletedChange}
                  />
                <br />
                <hr style={style.hr} />
                <br />
                  <h3>Categories management:</h3>
                  <div style={{display: 'flex', flexDirection: 'row'}}>
                    <TextField
                      disabled={this.props.readOnly}
                      name="category"
                      placeholder="New category name"
                      value={this.state.categoryName}
                      onChange={this.handleChangeCategory}
                    />
                  <RaisedButton label="Add"
                      backgroundColor='#00E676'
                      icon={<Add />}
                      disabled={!this.state.categoryName}
                      label="add"
                      style={style.addNew}
                      overlayStyle={{textAlign: 'left'}}
                      onClick={this.handleAddCategory}
                  />
                  </div>
                  <div style={{display: 'flex', flexDirection: 'row'}}>
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
                    <RaisedButton label="Remove"
                      icon={<Delete />}
                      disabled={!this.state.category}
                      label="delete"
                      secondary
                      style={style.delete}
                      overlayStyle={{textAlign: 'left'}}
                      onClick={this.handleRemoveCategory}
                    />
                  </div>
                </div>
                <span></span>
            </div>
        );
    }
}

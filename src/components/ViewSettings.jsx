import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';

import { connect } from 'react-redux';

import { UPDATE_SETTINGS, action } from '../actions'

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
    handleUpdateSettings = (props) => {
      const { uid } = this.props;
      this.props.updateSettings({ uid, ...props });
    }

    handleHideCompletedChange = (e, hideCompleted) => {
      this.handleUpdateSettings({ hideCompleted });
    }

    handleHideCompletedChange = (e, hideCompleted) => {
      this.handleUpdateSettings({ hideCompleted });
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
                  <h3>Categories:</h3>
                  <SelectField
                    disabled={this.props.readOnly}
                  >
                  {
                    this.props.categories.map(cat=>
                      <MenuItem key={cat.id} value={cat.id} primaryText={cat.name} />
                    )
                  }
                  </SelectField>
                </div>
                <span></span>
            </div>
        );
    }
}

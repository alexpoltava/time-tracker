import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Media from 'react-responsive';
import { connect } from 'react-redux';

import { SMALL_SCREEN } from '../../config/constants';
import { defaultCategories } from '../../config/constants';
import { createSelector } from 'reselect';

import Sidebar from '../Sidebar.jsx';
import View from '../View.jsx';
import TaskPage from './TaskPage.jsx';

import { action, logout, CHANGE_DBSYNC_UID } from '../../actions'

import styles from './Dashboard.less';

const FadingBlock = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => {
      const task = props.match.params.task;
      const list = rest.list;
      const item = list[task];
      const category = item ? rest.categories.find(cat => cat.id === item.category) : null;
      return <Component {...props} {...{...rest, list: null, item, category: category ? category.name : null}} />;
  }}/>
);

const customCategories = state => state.settings.categories;
const getCategories = createSelector(
  customCategories,
  customCategories => [...defaultCategories, ...customCategories]
);

const mapStateToProps = state => ({
    categories: getCategories(state),
    list: state.tasks.list,
    loggedinUID: state.session.user.uid,
});

const mapDispatchToProps = dispatch => ({
    changeDBSyncUID: (uid) => dispatch(action(CHANGE_DBSYNC_UID, {uid})),
    logout: () => dispatch(logout())
});

@connect(mapStateToProps, mapDispatchToProps)
export default class Dashboard extends Component {
    state = {
      menuItem: 0
    };

    componentWillMount() {
        this.props.changeDBSyncUID(this.props.match.params.uid);
    }

    componentWillReceiveProps(props) {
      if(this.props.match.params.uid !== props.match.params.uid) {
          this.props.changeDBSyncUID(props.match.params.uid);
      }
    }

    handleSelectMenuItem = (item) => {
        this.setState({ menuItem: item });
    }

    handleSelectMenuItemAndClose = (item) => {
      if(item === 5) {
          this.props.logout();
      } else {
          this.setState({ menuItem: item });
      }
      this.props.onRequestCloseMenu();
    }

    render() {
        return (
            <div className={styles.root}>
                <Media minDeviceWidth={SMALL_SCREEN}>
                  {(match) =>
                    <Sidebar
                      isMenuOpen={this.props.isMenuOpen}
                      onSelectMenuItem={match ? this.handleSelectMenuItem : this.handleSelectMenuItemAndClose}
                    />
                  }
                </Media>
                <FadingBlock
                  path={`${this.props.match.url}/:task`}
                  isMenuOpen={this.props.isMenuOpen}
                  categories={this.props.categories}
                  list={this.props.list}
                  uid={this.props.match.params.uid}
                  readOnly={this.props.loggedinUID !== this.props.match.params.uid}
                  component={TaskPage}
                />
                <View
                  isMenuOpen={this.props.isMenuOpen}
                  menuItem={this.state.menuItem}
                  uid={this.props.match.params.uid}
                  readOnly={this.props.loggedinUID !== this.props.match.params.uid}
                />
            </div>
        );
    }
}

import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Media from 'react-responsive';
import { SMALL_SCREEN } from '../../config/constants';

import Sidebar from '../Sidebar.jsx';
import View from '../View.jsx';
import TaskPage from './TaskPage.jsx';
import { connect } from 'react-redux';

import { action, logout, CHANGE_DBSYNC_UID } from '../../actions'

import styles from './Dashboard.less';

const mapStateToProps = state => ({
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
                <Route
                  path={`${this.props.match.url}/:task`}
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

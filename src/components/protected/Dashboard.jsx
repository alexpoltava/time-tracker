import React, { Component } from 'react';

import Sidebar from '../Sidebar.jsx';
import View from '../View.jsx';
import { connect } from 'react-redux';

import { action, CHANGE_DBSYNC_UID } from '../../actions'

import styles from './Dashboard.less';

const mapStateToProps = state => ({
    loggedinUID: state.session.user.uid,
});

const mapDispatchToProps = dispatch => ({
    changeDBSyncUID: (uid) => dispatch(action(CHANGE_DBSYNC_UID, {uid}))
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

    onSelectMenuItem = (item) => {
        this.setState({ menuItem: item });
    }

    render() {
        return (
            <div className={styles.root}>
                <Sidebar
                  isMenuOpen={this.props.isMenuOpen}
                  onSelectMenuItem={this.onSelectMenuItem}
                />
                <View
                  menuItem={this.state.menuItem}
                  uid={this.props.match.params.uid}
                  readOnly={this.props.loggedinUID !== this.props.match.params.uid}
                />
            </div>
        );
    }
}

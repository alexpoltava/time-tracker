import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class DialogAlert extends Component {
    handleClose = () => {
        this.props.closeDialog();
    }

    render() {
        const actions = [
            <FlatButton
              label="OK"
              primary
              onTouchTap={this.handleClose}
            />
        ];

        return (
            <div>
                <Dialog
                  actions={actions}
                  modal={false}
                  open={this.props.open}
                  onRequestClose={this.handleClose}
                >
                    {this.props.children}
                </Dialog>
            </div>
        );
    }
}

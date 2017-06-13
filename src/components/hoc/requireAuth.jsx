import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    isLoggedIn: state.session.isLoggedIn
});

export default function requireAuth(Component) {
    @connect(mapStateToProps)
    class AuthentificatedComponent extends React.Component {
        componentWillMount() {
            this.checkAuth(this.props);
        }

        componentWillReceiveProps(nextProps) {
            this.checkAuth(nextProps);
        }

        checkAuth(props) {
            if (!props.isLoggedIn) {
                // console.log(props.isLoggedIn);
                this.props.history.replace({
                    pathname: '/login',
                    state: {
                        nextLocation: {
                            pathname: props.location.pathname,
                            search: props.location.search,
                        }
                    }
                });
            }
        }

        render() {
            const { isLoggedIn, ...otherProps } = this.props;

            return isLoggedIn
                ? <Component {...otherProps} />
                : null;
        }
    }

    return AuthentificatedComponent;
}

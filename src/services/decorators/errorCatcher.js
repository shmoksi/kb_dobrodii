import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { resetData } from 'app/actions/updateData';

const mapDispatchToProps = dispatch =>
  bindActionCreators({ resetData }, dispatch);

export default function errorCatcher(reduxRuntimeName, noReset) {
  return function(Child) {
    const mapStateToProps = ({ runtime }) => ({
      error: runtime[`${reduxRuntimeName}Error`],
    });

    @connect(mapStateToProps, mapDispatchToProps)
    class ErrorCatcher extends Component {
      state = { hasError: false };

      componentDidCatch() {
        this.setState({ hasError: true });
      }

      componentWillUnmount() {
        if (reduxRuntimeName && !noReset) {
          this.props.resetData(reduxRuntimeName);
        }
      }

      render() {
        if (this.props.error || this.state.hasError) {
          return <h4>Error</h4>;
        }
        return <Child {...this.props} />;
      }
    }
    return ErrorCatcher;
  };
}

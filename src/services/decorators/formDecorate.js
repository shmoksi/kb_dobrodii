import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { invoke } from 'lodash';

import handleSubmit from '../form';
import addLoad from './addLoad';

export default function formDecorate({ i18Name = 'form', loadName } = {}) {
  return function(Child) {

    @addLoad({ i18Name, name: loadName })
    @Form.create({})
    class FormDecorator extends Component {
      static propTypes = {
        closeWindow: PropTypes.func,
        redirect: PropTypes.func,
      };

      state = { editableRow: null };

      static childContextTypes = {
        form: PropTypes.object,
        handleReset: PropTypes.func,
        getStatus: PropTypes.func,
        setStatus: PropTypes.func,
      };

      getChildContext() {
        return {
          form: this.props.form,
          handleReset: this.handleReset,
          getStatus: this.getEditableRow,
          setStatus: this.setEditableRow,
        };
      }

      getEditableRow = () => this.state.editableRow;

      setEditableRow = name => this.setState({ editableRow: name });

      wrapSubmit = onSubmit => async e => {
        const { props } = this;
        const values = await handleSubmit(e, props.form);
        const data = await props.stateloading(onSubmit(values));
        props.redirect && props.redirect(data);
        this.handleReset();
      };

      handleReset = () => {
        this.props.form.resetFields();
        invoke(this.props, 'closeWindow');
      };

      render() {
        return (
          <Child
            {...this.props}
            wrapSubmit={this.wrapSubmit}
            handleReset={this.handleReset}
          />
        );
      }
    }
    return FormDecorator;
  };
}

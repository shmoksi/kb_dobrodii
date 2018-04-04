import React, { PureComponent } from 'react';

import { notification } from 'antd';
import { pick } from 'lodash';

import i18n from 'app/services/i18n';

export default function notif(i18Name = 'form') {
  return function(Child) {
    @i18n(i18Name)
    class NotifyDecorator extends PureComponent {
      componentWillMount() {
        this.methods = pick(this, [
          'notifyError',
          'notifySuccess',
          'notifyWarning',
        ]);
      }

      notifyWarning = (...args) =>
        notification.warning({
          message: this.props.translate(...args),
        });

      notifyError = (...args) =>
        notification.error({
          message: this.props.translate(...args),
        });

      notifySuccess = (...args) =>
        notification.success({
          message: this.props.translate(...args),
        });

      render() {
        return <Child {...this.props} {...this.methods} />;
      }
    }
    return NotifyDecorator;
  };
}

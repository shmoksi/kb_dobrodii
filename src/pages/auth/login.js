import React, { Component } from 'react';
import { withRouter } from 'react-router';

import formDecorate from '../../services/decorators/formDecorate';

import './loginStyles.less';

@withRouter
@formDecorate()
export default class Login extends Component {
  render() {
    return null;
  }
}

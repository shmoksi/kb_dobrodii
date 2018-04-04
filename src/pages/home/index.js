import React, { PureComponent } from 'react';
import Auth from 'components/Auth';
import Type from 'components/Type';
import Table from './Table';

export default class Home extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Auth />
        <Type />
        <Table />
      </React.Fragment>
    );
  }
}
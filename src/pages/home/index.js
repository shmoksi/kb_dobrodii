import React, { PureComponent } from 'react';
// import { push } from 'react-router-redux';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

// import addLoad from '../../services/decorators/addLoad';
// import { bookCRUD } from '../../actions/cruds';

export default class Home extends PureComponent {
  render() {
    return (
      <Row>
        <Col sm={5} />
      </Row>
    );
  }
}

// const mapDispatchToProps = dispatch =>
//   bindActionCreators(
//     {
//       increment,
//       incrementAsync,
//       decrement,
//       decrementAsync,
//       changePage: () => push('/about-us')
//     },
//     dispatch
//   );

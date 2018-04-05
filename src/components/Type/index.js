import React, { PureComponent } from 'react';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { get, map, find } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { TYPES } from 'constants/options';
import { updateData } from 'actions/updateData';

import firebase from 'firebase.js';

const mapStateToProps = ({ runtime }) => ({
  type: get(runtime, 'selectedTypeData'),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ updateData }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
export default class Type extends PureComponent {
  componentWillMount() {
    this.props.updateData('administration', 'selectedType');
  }

  handleSelect = key => {
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', snapshot => {
      const items = snapshot.val();
      const newState = [];
      map(items, (item, id) => {
        if (key === 'all') {
          item.id = id;
          newState.push(item);
        } else if (item.type === key) {
          item.id = id;
          newState.push(item);
        }
      });
      this.props.updateData(newState, 'items');
      this.props.updateData(key, 'selectedType');
    });
  };

  render() {
    return (
      <Row>
        <Col xs={8} xsOffset={2}>
          <Nav
            bsStyle="pills"
            justified
            activeKey={this.props.type}
            onSelect={key => this.handleSelect(key)}>
            {TYPES.map((item, index) => (
              <NavItem key={index + 1} eventKey={item.value}>
                <img src={item.value === this.props.type ? `images/${item.value}_active.svg` : `images/${item.value}.svg`} alt={item.value} />
              </NavItem>
            ))}
          </Nav>
          <h3 className="title-type">{this.props.type && find(TYPES, { value: this.props.type }).label}</h3>
        </Col>
      </Row>
    );
  }
}

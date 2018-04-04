import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
} from 'react-bootstrap';
import { get, map } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import firebase from 'firebase.js';
import { TYPES } from 'constants/options';
import Auth from 'components/Auth';
import Type from 'components/Type';
import { updateData } from 'actions/updateData';
import Table from './Table';

const mapStateToProps = ({ runtime }) => ({
  user: get(runtime, 'userData'),
  type: get(runtime, 'selectedTypeData'),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ updateData }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
export default class AddItem extends PureComponent {
  constructor() {
    super();
    this.state = {
      namePerson: '',
      city: '',
      type: '',
      description: '',
    };
  }

  componentDidMount() {
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', snapshot => {
      const items = snapshot.val();
      const newState = [];
      map(items, (item, id) => {
        if (item.type === 'administration') {
          item.id = id;
          newState.push(item);
        }
      });
      this.props.updateData(newState, 'items');
    });
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    itemsRef.push({
      type: this.state.type,
      namePerson: this.state.namePerson,
      city: this.state.city,
      description: this.state.description,
      voices: 0,
    });
    this.setState({
      namePerson: '',
      city: '',
      type: '',
      description: '',
    });
  };

  removeItem = itemId => {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  };

  render() {
    return (
      <React.Fragment>
        <Auth />
        {this.props.user ? (
          <React.Fragment>
            <Row>
              <Col xsOffset={2} xs={8}>
                <form onSubmit={this.handleSubmit}>
                  <legend>Додати кандидата</legend>
                  <FormGroup controlId="type">
                    <ControlLabel>Номінація</ControlLabel>
                    <FormControl
                      componentClass="select"
                      value={this.state.type}
                      onChange={this.handleChange}>
                      {TYPES.map(item => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </FormControl>
                  </FormGroup>
                  <FormGroup controlId="namePerson">
                    <ControlLabel>
                      Пл.ступінь, ім'я, прізвище, курінь кандидата
                    </ControlLabel>
                    <FormControl
                      type="text"
                      placeholder="Введіть ім'я"
                      onChange={this.handleChange}
                      value={this.state.namePerson}
                    />
                  </FormGroup>
                  <FormGroup controlId="city">
                    <ControlLabel>Місто</ControlLabel>
                    <FormControl
                      type="text"
                      placeholder="Введіть місто"
                      onChange={this.handleChange}
                      value={this.state.city}
                    />
                  </FormGroup>
                  <FormGroup controlId="description">
                    <ControlLabel>Опис діяльності</ControlLabel>
                    <FormControl
                      rows="5"
                      componentClass="textarea"
                      placeholder="Введіть опис"
                      onChange={this.handleChange}
                      value={this.state.description}
                    />
                  </FormGroup>
                  <Button type="submit" className="btn-black">
                    Додати
                  </Button>
                </form>
              </Col>
            </Row>
            <Type />
            <Table />
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

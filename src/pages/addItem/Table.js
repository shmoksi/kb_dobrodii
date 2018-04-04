import React, { PureComponent } from 'react';
import { find, get } from 'lodash';
import { connect } from 'react-redux';
import { Row, Col, Button, Table } from 'react-bootstrap';

import { TYPES } from 'constants/options';

const mapStateToProps = ({ runtime }) => ({
  items: get(runtime, 'itemsData') || [],
});

@connect(mapStateToProps)
export default class AddItem extends PureComponent {
  loadType = value => find(TYPES, { value }).label;

  render() {
    return (
      <Row>
        <Col xs={12}>
          <Table responsive style={{ marginBottom: '30px' }}>
            <thead>
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '10%' }}>Тип</th>
                <th style={{ width: '20%' }}>Прізвище та ім'я</th>
                <th style={{ width: '7%' }}>Місто</th>
                <th style={{ width: '45%' }}>Опис</th>
                <th style={{ width: '3%' }}>Голосів</th>
                <th style={{ width: '10%' }} />
              </tr>
            </thead>
            <tbody>
              {this.props.items.length ? (
                this.props.items.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{this.loadType(item.type)}</td>
                    <td>{item.namePerson}</td>
                    <td>{item.city}</td>
                    <td>{item.description}</td>
                    <td>{item.voices}</td>
                    <td>
                      <Button
                        className="btn-black"
                        onClick={() => this.removeItem(item.id)}>
                        Видалити
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" align="center">
                    Немає результатів
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    );
  }
}

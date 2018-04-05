import React, { PureComponent } from 'react';
import { find, get } from 'lodash';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Button,
  Table,
  Glyphicon,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap';

import firebase from 'firebase.js';
import { TYPES } from 'constants/options';
import ModalPhoto from './ModalPhoto';
import ModalDescription from './ModalDescription';

const mapStateToProps = ({ runtime }) => ({
  items: get(runtime, 'itemsData') || [],
});

@connect(mapStateToProps)
export default class AddItem extends PureComponent {
  state = { showModal: false, showModalDesc: false };
  loadType = value => find(TYPES, { value }).label;

  editItem = item => {
    this.props.editUser(item);
  };

  removeItem = itemId => {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  };

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
                <th style={{ width: '20%' }}>Опис</th>
                <th style={{ width: '20%' }}>Фото</th>
                <th style={{ width: '5%' }}>Відео</th>
                <th style={{ width: '8%' }}>Голосів</th>
                <th style={{ width: '5%' }}>Дії</th>
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
                    <td>
                      <Button
                        bsStyle="link"
                        bsSize="xsmall"
                        onClick={() =>
                          this.setState({
                            desc: item.description,
                            showModalDesc: true,
                          })
                        }>
                        Опис
                      </Button>
                    </td>
                    <td>
                      {item.photo && (
                        <Button
                          bsStyle="link"
                          bsSize="xsmall"
                          onClick={() =>
                            this.setState({
                              photo: item.photo,
                              showModal: true,
                            })
                          }>
                          Фото
                        </Button>
                      )}
                    </td>
                    <td>
                      {item.video && (
                        <a href={item.video} target="_blank">
                          Відео
                        </a>
                      )}
                    </td>
                    <td>{(item.voices && item.voices.length) || 0}</td>
                    <td>
                      <Button
                        bsStyle="link"
                        className="simple-btn"
                        onClick={() => this.editItem(item)}>
                        <Glyphicon glyph="pencil" />
                      </Button>
                      <OverlayTrigger
                        rootClose
                        trigger="click"
                        placement="bottom"
                        overlay={
                          <Popover
                            id="popover-positioned-bottom"
                            title="Перевірка">
                            <label>Ти впевнений?</label>
                            <Button
                              bsSize="xsmall"
                              style={{ marginLeft: '10px' }}
                              className="btn-black"
                              onClick={() => this.removeItem(item.id)}>
                              Так
                            </Button>
                          </Popover>
                        }>
                        <Button bsStyle="link" className="simple-btn">
                          <Glyphicon glyph="trash" />
                        </Button>
                      </OverlayTrigger>
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
          <ModalPhoto
            photo={this.state.photo}
            show={this.state.showModal}
            handleClose={() => this.setState({ showModal: false })}
          />
          <ModalDescription
            desc={this.state.desc}
            show={this.state.showModalDesc}
            handleClose={() => this.setState({ showModalDesc: false })}
          />
        </Col>
      </Row>
    );
  }
}

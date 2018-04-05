import React, { PureComponent } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default class ModalCropper extends PureComponent {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose}>
        <Modal.Header>
          <Modal.Title>Фото</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <img src={this.props.photo} className="photo-window"/>
        </Modal.Body>

        <Modal.Footer>
          <Button className="btn-cancel" onClick={this.props.handleClose}>
            Закрити
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

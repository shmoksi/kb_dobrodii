import React, { PureComponent } from 'react';
import { Modal, Button } from 'react-bootstrap';


export default class ModalCropper extends PureComponent {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose}>
        <Modal.Header>
          <Modal.Title>Опис</Modal.Title>
        </Modal.Header>

        <Modal.Body>{this.props.desc}</Modal.Body>

        <Modal.Footer>
          <Button className="btn-cancel" onClick={this.props.handleClose}>
            Закрити
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

import React, { PureComponent } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Cropper from 'react-cropper';

import { storageRef } from 'firebase.js';

export default class ModalCropper extends PureComponent {
  crop = () => {
    const peopleRef = storageRef.child(this.props.filename);
    this.cropper.getCroppedCanvas().toBlob(blob => {
      peopleRef.put(blob).then(snapshot => {
        this.props.handleClose();
      });
    });
  };

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose}>
        <Modal.Header>
          <Modal.Title>Загрузка фото</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Cropper
            ref={c => {
              this.cropper = c;
            }}
            src={this.props.src}
            style={{ height: 400, width: '100%' }}
            aspectRatio={1}
            guides={false}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.handleClose}>Close</Button>
          <Button bsStyle="primary" onClick={this.crop}>
            Обрізати
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

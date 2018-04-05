import React, { PureComponent } from 'react';
import { Modal, Button } from 'react-bootstrap';

import { storageRef } from 'firebase.js';

export default class ModalCropper extends PureComponent {
  state = { photo: '' };

  componentWillReceiveProps(nextProp) {
    if (this.props.photo !== nextProp.photo) {
      this.showImg(nextProp.photo);
    }
  }

  showImg = async photo => {
    const src = await storageRef.child(photo).getDownloadURL();
    this.setState({ photo: src });
  };
  //
  // remove = async () => {
  //   const photoRef = await storageRef.child(photo);
  //   photoRef.delete().then(() => {
  //     this.props.handleClose();
  //   });
  // };

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose}>
        <Modal.Header>
          <Modal.Title>Фото</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <img src={this.state.photo} />
        </Modal.Body>

        <Modal.Footer>
          {/*<Button className="btn-black" onClick={this.remove}>*/}
            {/*Видалити*/}
          {/*</Button>*/}
          <Button className="btn-cancel" onClick={this.props.handleClose}>
            Закрити
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

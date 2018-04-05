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
import { updateData } from 'actions/updateData';
import { TYPES } from 'constants/options';
import Auth from 'components/Auth';
import Type from 'components/Type';
import ModalCropper from './ModalCropper';
import Table from './Table';

import './style.less';

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
      type: 'administration',
      description: '',
      video: '',
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

  handleSubmit = async e => {
    e.preventDefault();
    const { state } = this;
    const item = {
      type: state.type,
      namePerson: state.namePerson,
      city: state.city,
      description: state.description,
      video: state.video,
      photo: state.photo,
    };
    if (state.id) {
      item.voices = state.voices;
      await firebase
        .database()
        .ref(`items/${state.id}`)
        .set(item);
    } else {
      item.voices = 0;
      await firebase
        .database()
        .ref('items')
        .push(item);
    }
    this.clearForm();
  };

  handlePhoto = async e => {
    const file = e.target.files[0]
    const image = document.createElement('img');
    await new Promise(res => {
      const reader = new FileReader();
      reader.onload = function(event) {
        image.src = event.target.result;
        res();
      };
      reader.readAsDataURL(file);
    });
    this.setState({
      showModal: true,
      src: image.src,
      photo: file.name,
    });
  };

  clearForm = () => {
    this.setState({
      id: '',
      namePerson: '',
      city: '',
      type: 'administration',
      description: '',
      video: '',
      photo: '',
    });
  };

  render() {
    const { user } = this.props;
    return (
      <React.Fragment>
        <Auth />
        {user &&
          (user.id === 'WlrlNjhfi7fbukni9D6bNMvgbRp1' ||
            user.id === 'xlg68GKwyBTY8NzhOfSue3uB3zp2') && (
            <React.Fragment>
              <Row>
                <Col xsOffset={2} xs={8}>
                  <form className="formAdd" onSubmit={this.handleSubmit}>
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
                    <FormGroup controlId="video">
                      <ControlLabel>Відео</ControlLabel>
                      <FormControl
                        type="text"
                        placeholder="Вставте ссилку на відео"
                        onChange={this.handleChange}
                        value={this.state.video}
                      />
                    </FormGroup>

                    <FormGroup controlId="">
                      <ControlLabel>Фото</ControlLabel>
                      <FormControl
                        accept="image/*"
                        type="file"
                        onChange={this.handlePhoto}
                      />
                    </FormGroup>

                    <ModalCropper
                      src={this.state.src}
                      filename={this.state.photo}
                      show={this.state.showModal}
                      handleClose={() => this.setState({ showModal: false })}
                    />

                    <Button type="submit" className="btn-black">
                      {this.state.id ? 'Редагувати' : 'Додати'}
                    </Button>
                    <Button className="btn-cancel" onClick={this.clearForm}>
                      Очистити
                    </Button>
                  </form>
                </Col>
              </Row>
              <Type />
              <Table editUser={obj => this.setState(obj)} />
            </React.Fragment>
          )}
      </React.Fragment>
    );
  }
}

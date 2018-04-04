import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { get, map } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { updateData } from 'actions/updateData';
import firebase from 'firebase.js';
import './style.less';

const mapStateToProps = ({ runtime }) => ({
  user: get(runtime, 'userData'),
  items: get(runtime, 'itemsData') || [],
  type: get(runtime, 'selectedTypeData'),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ updateData }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
export default class Table extends PureComponent {
  componentWillMount() {
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', snapshot => {
      const items = snapshot.val();
      const newState = [];
      map(items, (item, id) => {
        if (item.type === this.props.type) {
          item.id = id;
          newState.push(item);
        }
      });
      this.props.updateData(newState, 'items');
    });
  }

  vote = item => {
    const { user } = this.props;
    // firebase
    //   .database()
    //   .ref(`users/${user.id}`)
    //   .on('value', snapshot => {
    //     const userObj = snapshot.val();
    //     if (userObj) {
    //       const { type } = this.props;
    //       debugger;
    //       if (!userObj.voices[type]) {
    //         userObj.voices[type] = true;
    //         firebase
    //           .database()
    //           .ref(`users/${user.id}/voices`)
    //           .set(userObj.voices);
    //         if (item.voices.indexOf(user.uid) !== -1) {
    //           item.voices.push(user.uid);
    //           firebase
    //             .database()
    //             .ref(`items/${item.id}/voices`)
    //             .set(item.voices);
    //         } else {
    //           alert('Ви вже голосували за цю людину!');
    //         }
    //       } else {
    //         alert('Ви вже голосували в цій номінації!');
    //       }
    //     } else {
    //       alert('Cталася помилка!');
    //     }
    //   });
  };

  render() {
    const { type, user } = this.props;
    return this.props.items.map(item => (
      <Row className="item" key={item.id}>
        <Col xs={5}>
          <div className="item_photo" />
          <div className="item_name">{item.namePerson}</div>
          <div className="item_city">{item.city}</div>
          <Button
            // disabled={get(user, `voices[${type}]`)}
            className="btn-red"
            onClick={() => this.vote(item)}>
            Голосую!
          </Button>
        </Col>
        <Col xs={7}>
          <div className="item_description">{item.description}</div>
          <div className="item_voices">Голосів: {item.voices}</div>
        </Col>
      </Row>
    ));
  }
}

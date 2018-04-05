import React, { PureComponent } from 'react';
import { Row, Col, Button, Popover, OverlayTrigger } from 'react-bootstrap';
import { get, map } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { notify } from 'react-notify-toast';

import { updateData } from 'actions/updateData';
import { VOICES } from 'constants/options';
import firebase, { auth, providerGM, providerFB } from 'firebase.js';
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
  popoverLogin = (
    <Popover id="popover-positioned-bottom" title="Авторизуйтеся">
      <span className="icon-auth" onClick={() => this.login('fb')}>
        <img src="images/facebook-icon.svg" alt="facebook" />
      </span>
      <span className="icon-auth" onClick={() => this.login('gm')}>
        <img src="images/gmail-icon.svg" alt="facebook" />
      </span>
    </Popover>
  );

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

  vote = async item => {
    const { user, type } = this.props;
    const userRef = await firebase
      .database()
      .ref(`users/${user.id}`)
      .once('value');
    const userObj = userRef.val();
    if (userObj.voices[type]) {
      notify.show('Ви вже голосували в цій номінації!', 'error');
      return false;
    }
    if (item.voices && item.voices.indexOf(user.uid) !== -1) {
      notify.show('Ви вже голосували в цій номінації!', 'error');
      return false;
    }
    const userVoices = { ...userObj.voices };
    userVoices[type] = true;
    await firebase
      .database()
      .ref(`users/${user.id}/voices`)
      .set(userVoices);
    item.voices = [];
    item.voices.push(user.id);
    await firebase
      .database()
      .ref(`items/${item.id}/voices`)
      .set(item.voices);
    return true;
  };

  login = async type => {
    const { props } = this;
    let authResp;
    if (type === 'fb') {
      authResp = await auth.signInWithPopup(providerFB);
    } else if (type === 'gm') {
      authResp = await auth.signInWithPopup(providerGM);
    }
    return firebase
      .database()
      .ref(`users/${authResp.user.uid}`)
      .on('value', function(snapshot) {
        const user = snapshot.val();
        let userObj = user;
        if (!user) {
          userObj = Object.assign(
            authResp.user.providerData[0],
            { id: authResp.user.uid },
            VOICES,
          );
          firebase
            .database()
            .ref(`users/${authResp.user.uid}`)
            .set(userObj);
        }
        return props.updateData(userObj, 'user');
      });
  };

  render() {
    const { type, user } = this.props;
    return this.props.items.map(item => (
      <Row className="item" key={item.id}>
        <Col xs={5}>
          <div className="item_photo" />
          <div className="item_name">{item.namePerson}</div>
          <div className="item_city">{item.city}</div>
          {this.props.user ? (
            <Button
              disabled={get(user, `voices[${type}]`)}
              className="btn-red"
              onClick={() => this.vote(item)}>
              {get(user, `voices[${type}]`) ? 'Вже проголосовано' : 'Голосую!'}
            </Button>
          ) : (
            <OverlayTrigger
              rootClose
              trigger="click"
              placement="bottom"
              overlay={this.popoverLogin}>
              <Button className="btn-red">Голосую!</Button>
            </OverlayTrigger>
          )}
        </Col>
        <Col xs={7}>
          <div className="item_description">{item.description}</div>
          {item.video && (
            <div className="item_video">
              <a href={item.video} target="_blank">
                Відео
              </a>
            </div>
          )}
        </Col>
      </Row>
    ));
  }
}

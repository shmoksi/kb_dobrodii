import React, { PureComponent } from 'react';
import { Button } from 'react-bootstrap';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import firebase, { auth, provider } from 'firebase.js';
import { updateData } from 'actions/updateData';
import { VOICES } from 'constants/options';

const mapStateToProps = ({ runtime }) => ({
  user: get(runtime, 'userData'),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ updateData }, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
export default class Auth extends PureComponent {
  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        const usersRef = firebase.database().ref(`users/${user.uid}`);
        usersRef.on('value', snapshot => {
          this.props.updateData(snapshot.val(), 'user');
        });
      }
    });
  }

  logout = () => {
    auth.signOut().then(() => {
      this.props.updateData(null, 'user');
    });
  };

  login = () => {
    auth.signInWithPopup(provider).then(result => {
      const usersRef = firebase.database().ref(`users/${result.user.uid}`);
      return usersRef.on('value', snapshot => {
        const user = snapshot.val();
        let userObj = user;
        if (!user) {
          userObj = Object.assign(
            result.user.providerData[0],
            { id: result.user.uid },
            VOICES,
          );
          firebase
            .database()
            .ref(`users/${result.user.uid}`)
            .set(userObj);
        }
        return this.props.updateData(userObj, 'user');
      });
    });
  };

  render() {
    return this.props.user ? (
      <span>
        Hi, {this.props.user.displayName}!
        <Button onClick={this.logout}>Log Out</Button>
      </span>
    ) : (
      <Button onClick={this.login}>Log In</Button>
    );
  }
}

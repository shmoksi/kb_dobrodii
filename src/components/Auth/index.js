import React, { PureComponent } from 'react';
import { Button } from 'react-bootstrap';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import firebase, { auth, providerGM } from 'firebase.js';
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
    auth.signInWithPopup(providerGM).then(result => {
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
      <div className="exit">
        Привіт, {this.props.user.displayName}!
        <Button bsStyle="link" className="simple-btn" onClick={this.logout}>
          Вихід
        </Button>
      </div>
    ) : (
      <div className="exit" />
    );
  }
}

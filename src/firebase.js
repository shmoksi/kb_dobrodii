import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyDQbefPKNGWMc6Q6Oln-nbCixDXD2mKKOQ',
  authDomain: 'dobrodii-2bc94.firebaseapp.com',
  databaseURL: 'https://dobrodii-2bc94.firebaseio.com',
  projectId: 'dobrodii-2bc94',
  storageBucket: 'gs://dobrodii-2bc94.appspot.com',
  messagingSenderId: '907000206238',
};
firebase.initializeApp(config);

export default firebase;
export const providerGM = new firebase.auth.GoogleAuthProvider();
export const providerFB = new firebase.auth.FacebookAuthProvider();
export const auth = firebase.auth();
export const storageRef = firebase.storage().ref();

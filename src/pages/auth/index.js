import React from 'react';
import { Route } from 'react-router-dom';
import Login from './login';

const Auth = () => (
  <Route exact path="/auth/login" component={Login} />
);

export default Auth;

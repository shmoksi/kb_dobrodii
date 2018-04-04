import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer } from 'redux-form';
import runtime from './runtime';

export default combineReducers({
  router: routerReducer,
  runtime,
  form: reducer,
});

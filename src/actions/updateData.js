import {
  END_LOAD,
  RESET_RUNTIME,
  SET_RUNTIME_VARIABLE,
  UPDATE_SPEC_DATA,
  ADD_ARR_ELEM,
  SPLICE_ARR_ELEM,
  LAZY_START,
} from '../constants/actions';
import dispatchSend from '../services/dispatchSend';

export const updateData = (data, name) => dispatch =>
  dispatch({
    type: END_LOAD,
    name: name,
    data,
  });

export const setData = (value, name) => dispatch =>
  dispatch({
    type: SET_RUNTIME_VARIABLE,
    name: name,
    value,
  });

export const resetData = name => dispatch =>
  dispatch({
    type: RESET_RUNTIME,
    name,
  });

export const updateSpecData = (name, data) => dispatch =>
  dispatch({
    type: UPDATE_SPEC_DATA,
    name,
    data,
  });

export const addSpecArr = (path, data) => dispatch =>
  dispatch({
    type: ADD_ARR_ELEM,
    path,
    data,
  });

export const spliceSpecArr = (path, searcher, index) => dispatch =>
  dispatch({
    type: SPLICE_ARR_ELEM,
    path,
    searcher,
    index,
  });

export const replaceSpecArr = (path, searcher, newElement) => dispatch =>
  dispatch({
    type: SPLICE_ARR_ELEM,
    path,
    searcher,
    newElement,
  });

export const reloadTableData = (name, action) =>
  dispatchSend(name, action.getList(), {
    timeout: 0,
    startAction: LAZY_START,
    adaptData: resp => {
      let key = 0;
      resp.data.forEach(item => (item.key = key++));
      return resp;
    },
  });

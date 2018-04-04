import { differenceWith, isEqual, get, findIndex, merge, set } from 'lodash';
import {
  SET_RUNTIME_VARIABLE,
  START_LOAD,
  END_LOAD,
  ERROR_LOAD,
  ADD_PAGE_LOAD,
  END_LOAD_FIRST,
  END_LOAD_FIRST_EMPTY,
  RESET_RUNTIME,
  CUSTOM_ERROR_LOAD,
  END_LOAD_REMOVE,
  END_LOAD_LAST,
  UPDATE_SPEC_DATA,
  ADD_ARR_ELEM,
  SPLICE_ARR_ELEM,
  MERGE_RUNTIME,
  LAZY_START,
} from '../constants/actions';

export default function runtime(state = {}, action) {
  const { name, path, data } = action;
  const newArray = get(data, 'data') || data;
  const oldArray = state[`${name}Array`] || [];
  let { names, index } = action;

  let el = path && get(state, path);
  let diff = [];
  if (action.name && !names) {
    names = [action.name];
  }
  switch (action.type) {
    case SET_RUNTIME_VARIABLE:
      return {
        ...state,
        [action.name]: action.value,
      };
    case START_LOAD:
      return {
        ...state,
        [`${name}Loading`]: true,
        [`${name}Loaded`]: false,
        [`${name}Data`]: null,
        [`${name}Error`]: null,
      };
    case END_LOAD:
      return {
        ...state,
        [`${name}Loading`]: false,
        [`${name}Loaded`]: true,
        [`${name}Data`]: data,
        [`${name}Error`]: null,
      };
    case ERROR_LOAD:
      return {
        ...state,
        [`${name}Loading`]: false,
        [`${name}Loaded`]: true,
        [`${name}Data`]: null,
        [`${name}Error`]: action.error,
      };
    case CUSTOM_ERROR_LOAD:
      return {
        ...state,
        [`${name}Loading`]: false,
        [`${name}Loaded`]: true,
        [`${name}Error`]: action.error,
        ...action.payload,
      };
    case ADD_PAGE_LOAD:
      return {
        ...state,
        [`${name}Loading`]: false,
        [`${name}Loaded`]: true,
        [`${name}Data`]: data,
        [`${name}Array`]: oldArray.concat(newArray),
        [`${name}Error`]: null,
      };
    case END_LOAD_REMOVE: //eslint-disable-line
      index = findIndex(oldArray, data);
      if (index !== -1) {
        oldArray.splice(index, 1);
      } else {
        console.warn('no item found in REMOVE_ITEM_LOAD');
      }
      return {
        ...state,
        [`${name}Loading`]: false,
        [`${name}Loaded`]: true,
        [`${name}Array`]: oldArray.slice(),
        [`${name}Error`]: null,
      };
    case END_LOAD_FIRST:
      diff = differenceWith(newArray, oldArray, isEqual);
      return {
        ...state,
        [`${name}Loading`]: false,
        [`${name}Loaded`]: true,
        [`${name}Array`]: diff.concat(oldArray),
        [`${name}Data`]: data,
        [`${name}Error`]: null,
      };
    case END_LOAD_LAST:
      diff = differenceWith(newArray, oldArray, isEqual);
      return {
        ...state,
        [`${name}Loading`]: false,
        [`${name}Loaded`]: true,
        [`${name}Array`]: oldArray.concat(diff),
        [`${name}Data`]: data,
        [`${name}Error`]: null,
      };
    case END_LOAD_FIRST_EMPTY:
      return {
        ...state,
        [`${name}Loading`]: false,
        [`${name}Loaded`]: true,
        [`${name}Array`]: newArray,
        [`${name}Data`]: data,
        [`${name}Error`]: null,
      };
    case RESET_RUNTIME:
      if (names) {
        names.forEach(item => {
          state[`${item}Loading`] = undefined;
          state[`${item}Loaded`] = undefined;
          state[`${item}Data`] = undefined;
          state[`${item}Error`] = undefined;
          state[`${item}Array`] = undefined;
        });
        return { ...state };
      }
      return {};
    case UPDATE_SPEC_DATA:
      return {
        ...state,
        [`${name}Data`]: merge(state[`${name}Data`], data),
      };
    case ADD_ARR_ELEM:
      if (Array.isArray(el)) {
        set(state, path, el.concat(data));
      } else {
        set(state, path, data);
      }
      return { ...state };
    case SPLICE_ARR_ELEM:
      el = el || [];
      if (action.searcher) {
        index = findIndex(el, action.searcher);
      }
      if (index !== -1) {
        if (action.newElement === undefined) {
          el.splice(index, 1);
        } else {
          el.splice(index, 1, action.newElement);
        }
      }
      set(state, path, el.slice());
      return { ...state };
    case MERGE_RUNTIME:
      if (action.finishLoad) {
        state[`${name}Loading`] = false;
        state[`${name}Loaded`] = true;
      }
      if (action.startLoad) {
        state[`${name}Loading`] = true;
        state[`${name}Loaded`] = false;
      }
      return { ...merge(state, data) };
    case LAZY_START:
      return {
        ...state,
        [`${name}Loading`]: true,
        [`${name}Loaded`]: false,
      };
    default:
      return state;
  }
}

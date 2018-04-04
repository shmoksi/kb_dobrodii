import axios from 'axios';
import { msgError } from './errorHandler';
import { START_LOAD, END_LOAD, ERROR_LOAD } from '../constants/actions';

const demyFunc = data => data;

const dispatchSend = (
  name,
  promise,
  {
    timeout = 100,
    customError,
    isBackground,
    adaptData = demyFunc,
    adaptError = demyFunc,
    receiveAction = END_LOAD,
    startAction = START_LOAD,
  } = {},
) => async dispatch => {
  const timeoutFunc = setTimeout(
    () => !isBackground && dispatch({ type: startAction, name }),
    timeout,
  );
  let resp;
  try {
    resp = await promise;
    dispatch({
      type: receiveAction,
      name,
      data: adaptData(resp.data),
    });
    clearTimeout(timeoutFunc);
  } catch (e) {
    clearTimeout(timeoutFunc);
    console.error(e);
    if (customError) {
      return customError(e);
    }
    if (axios.isCancel(e)) {
      return Promise.resolve({ canceledByAxios: true, e });
    }
    msgError(e);
    dispatch({
      name,
      type: ERROR_LOAD,
      error: adaptError(e),
    });
    throw e;
  }
  return resp;
};

export default dispatchSend;

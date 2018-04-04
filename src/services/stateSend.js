import axios from 'axios';
import { get } from 'lodash';
import { msgError as msgErrorFunc } from './errorHandler';

export default async (
  setLoading,
  promise,
  { timeout, translate, msgError = true } = {},
) => {
  let timeoutFunc;
  if (timeout) {
    timeoutFunc = setTimeout(() => setLoading(true), timeout);
  } else {
    setLoading(true);
  }
  let resp;
  try {
    let forAwait = promise;
    if (typeof forAwait === 'function') {
      forAwait = promise();
    }
    resp = await forAwait;
  } catch (e) {
    console.error(e);
    if (!axios.isCancel(e)) {
      msgErrorFunc(e);
    }
    throw e;
  } finally {
    timeoutFunc && clearTimeout(timeoutFunc);
    setLoading(false);
  }
  return get(resp, 'data');
};

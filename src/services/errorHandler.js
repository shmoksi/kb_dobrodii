import { notify } from 'react-notify-toast';
import { get } from 'lodash';

const DEFAULT_ERROR_MSG = 'Something went wrong';
// const KNOWN_ERROR_CODES = [1451, 1062, 'invalidOptionsCount'];
// const KNOWN_ERROR_TYPES = ['missed'];

export const getErrorMsg = (e, defaultErrorMsg = DEFAULT_ERROR_MSG) =>
  get(e, 'response.data.status') ||
  get(e, 'message') ||
  (typeof e === 'string' ? e : defaultErrorMsg);

export const msgError = (e, defaultErrorMsg) =>
  notify.show(getErrorMsg(e, defaultErrorMsg), 'error');

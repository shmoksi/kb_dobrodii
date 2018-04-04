import numeral from 'numeral';
import moment from 'moment';
import { get } from 'lodash';

import { DATE, GENERAL_NUMBER, DATE_SEND } from '../constants/formats';

export const formatDate = value => (value ? value.format(DATE) : '');
export const momentFormatDate = value =>
  value ? moment(value).format(DATE) : '';
export const formatDateSend = value =>
  value ? `${value.format(DATE_SEND)}T00:00:00Z` : '';
export const parseDate = value =>
  value ? moment(value, DATE_SEND) : undefined;
export const parseAge = value => (value ? parseDate(value).toNow(true) : '');
export const formatNumber = value => numeral(value).format(GENERAL_NUMBER);
export const generateSaveGet = name => value => get(value, name);
export const getName = generateSaveGet('name');
export const getId = generateSaveGet('id');

export const capitalizeFirstLetter = str =>
  str.charAt(0).toUpperCase() + str.slice(1);

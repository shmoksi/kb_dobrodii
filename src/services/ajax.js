import axios from 'axios';
import { get } from 'lodash';
import { browserHistory } from 'react-router';

import { SERVER_URL } from '../constants/global';

export const getAuthHeaders = () => ({
  'X-Auth-Token': sessionStorage.getItem('token'),
  'Access-Control-Allow-Origin': '*', // temp
});

const getDefHeaders = () => ({
  'Content-Type': 'application/json',
  ...getAuthHeaders(),
});

const buildUrl = url => {
  if (url.indexOf(SERVER_URL) === -1) {
    return SERVER_URL + url;
  }
  return url;
};

export const wrapRequest = options =>
  axios({
    headers: getDefHeaders(),
    ...options,
    url: buildUrl(options.url || options),
  });

export const buildCRUD = url => {
  if (!url) return Promise.reject('Need URL');
  return {
    post: data => {
      if (!data) return Promise.reject('Need Data');
      return wrapRequest({ method: 'POST', url: `${url}.json`, data });
    },
    put: (id, data) => {
      if (!data || !id) return Promise.reject('Need Data or id');
      return wrapRequest({ method: 'PUT', url: `${url}/${id}.json`, data });
    },
    deleteRequest: id => {
      if (!id) return Promise.reject('Need id');
      return wrapRequest({ method: 'DELETE', url: `${url}/${id}.json` });
    },
    get: id => {
      if (!id) return Promise.reject('Need id');
      return wrapRequest({ method: 'GET', url: `${url}/${id}.json` });
    },
    getList: ({ params, method = 'GET' } = {}, data) => {
      return wrapRequest({
        method,
        url: `${url}.json`,
        params,
        data,
      });
    },
  };
};

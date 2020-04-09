import axios from 'axios';
import { transformHttpBody } from '../helper';
/* eslint-disable no-console */
const log = console.log;

let isSucc = resp => resp.code === 0;


const _fetch = options => {
  const {
    data,
    url,
    timeout = 5000,
    contentType = 'queryString',
    withCredentials = false
  } = options;
  const method = (options.method || 'get').toLowerCase();
  const params = (method === 'get') ? options.data : {};

  log('request body==>', data);
  const { type, transform } = transformHttpBody(contentType);
  const instance = axios.create({
    timeout,
    headers: { 'Content-Type': type },
    withCredentials
  });

  return instance({
    url,
    data,
    method,
    params,
    transformRequest: [transform]
  });
};


export default function request(options) {
  const opts = { ...options };
  const success = opts.success;
  const error = opts.error;
  opts.params = { ...opts.params };
  opts.data = { ...opts.params };

  delete opts.success;
  delete opts.error;
  isSucc = request.isSucc || isSucc;
  return _fetch(opts).then(response => {
    const resp = response.data;
    log(`response success: ${opts.url}`);
    log(resp);
    if (isSucc(resp)) {
      (typeof success === 'function') && success(resp);
    } else {
      (typeof error === 'function') && error(resp.message || resp.msg);
    }
    return Promise.resolve(resp);
  }).catch(_error => {
    log(`response fail: ${opts.url}`);
    log(_error);
    const msg = _error.message || '网络错误';
    return Promise.reject(new Error(msg));
  });
}

request.axios = axios;

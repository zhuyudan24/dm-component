import axios from 'axios';
import qs from 'qs';

axios.defaults.timeout = 10000;

let base = 'http://192.168.1.164:8282/gic/';
const timeout = 10000;
let token = ''; //sessionStorage.getItem('user');

/*
 *
 * 统一 get 请求方法
 * @url: 请求的 url
 * @params: 请求带的参数
 * @header: 带 token
 *
 */

export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    data: {},
    params: params,
    headers: { 'content-type': 'application/x-www-form-urlencoded' } // "token": token
  });
};

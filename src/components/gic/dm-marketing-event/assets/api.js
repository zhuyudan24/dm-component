import qs from 'qs';
import axios from 'axios';
import Router from 'vue-router';
const router = new Router();
const host = window.location.origin;
const PREFIX = '/api-marketing/';
const PLUG_PREFIX = '/api-plug/';

// 加载最小时间
const MINI_TIME = 300;
// 超时时间
let TIME_OUT_MAX = 20000;
// 环境value
// let _isDev = process.env.NODE_ENV === 'development';
// 请求接口host
let _apiHost = host.indexOf('localhost') !== -1 ? '/dmApi/' : host;
// 请求组（判断当前请求数）
let _requests = [];

//创建一个请求实例
const instance = axios.create({
  baseURL: _apiHost,
  timeout: TIME_OUT_MAX,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  withCredentials: true // 允许携带cookie
});

/**
 * 添加请求，显示loading
 * @param {请求配置} config
 */
function pushRequest(config) {
  _requests.push(config);
}

/**
 * 移除请求，无请求时关闭loading
 * @param {请求配置} config
 */
function popRequest(config) {
  let _index = _requests.findIndex(r => {
    return r === config;
  });
  if (_index > -1) {
    _requests.splice(_index, 1);
  }
}
/**
 * 错误的处理
 * @param {*} code
 * @param {string} [message='请求错误']
 */
function handlerErr(code, message = '请求错误') {
  switch (code) {
    case 404:
      message = '404,错误请求';
      router.push('/404');
      break;
    case 401:
      message = '登录失效';
      break;
    case 403:
      message = '禁止访问';
      router.push('/403');
      break;
    case 408:
      message = '请求超时';
      break;
    case 500:
      message = '服务器内部错误';
      // router.push('/500')
      break;
    case 501:
      message = '功能未实现';
      break;
    case 503:
      message = '服务不可用';
      break;
    case 504:
      message = '网关错误';
      break;
  }
  this.$message({ type: 'warning', message: message });
}

/**
 * 请求地址，请求数据，是否静默，请求方法
 */
const requests = (url, data = {}, contentTypeIsJSON = false, isSilence = false, method = 'POST') => {
  let _opts = { method, url };
  const _query = {};
  let _timer = null;
  if (method.toLocaleUpperCase() === 'POST') {
    if (contentTypeIsJSON) {
      _opts.data = data;
      _opts.headers = { 'Content-Type': 'application/json' };
      _opts.url += '?requestProject=marketing';
    } else {
      _opts.data = qs.stringify(Object.assign({ requestProject: 'gic-web' }, data));
    }
  } else {
    _opts.params = _query;
  }
  return new Promise((resolve, reject) => {
    let _random = { stamp: Date.now(), url: `${_apiHost + url}` };
    if (!isSilence) {
      _timer = setTimeout(() => {
        pushRequest(_random);
      }, MINI_TIME);
    }
    instance(_opts)
      .then(res => {
        clearTimeout(_timer);
        popRequest(_random);
        if (res.data.errorCode !== 0) {
          reject(res);
          handlerErr(res.data.errorCode, res.data.message);
        } else {
          resolve(res.data);
        }
      })
      .catch(res => {
        clearTimeout(_timer);
        popRequest(_random);
        if (res) {
          handlerErr(res.response.status, '接口异常');
        }
        reject(res);
      });
  });
};
// 获取营销事件配置信息(类型, 最大条数)
export const getMarketingEvent = params => requests(PREFIX + 'get-marketing-event', params);

//素材库 图文 图文分页列表
export const loadImgTextList = params => requests(PREFIX + 'page-marketing-wechat-image-text', params);

//获取卡券列表
export const getCardList = params => requests(PLUG_PREFIX + 'get-coupon-list', params);

//素材库--图片--图片分页列表
export const loadImgList = params => requests(PREFIX + 'page-marketing-wechat-image', params);

//素材库--图片--编辑图片名称
export const updateImgName = params => requests(PREFIX + 'update-marketing-wechat-image-titlename', params);

//素材库--图片--新建图片分组
export const addGroupService = params => requests(PREFIX + 'save-marketing-wechat-image-group', params);

//素材库--图片--修改图片分组
export const updateGroupName = params => requests(PREFIX + 'update-marketing-wechat-image-group', params);

//素材库--图片--删除图片分组
export const deleteGroupService = params => requests(PREFIX + 'delete-marketing-wechat-image-group', params);

// 智能营销--ECM营销引擎-- 新建/修改 --回显营销事件类型详情
export const getMarketingTypeDetails = params => requests(PREFIX + 'get-marketing-type-details', params);

// 智能营销--新增/修改营销事件类型
export const saveUpdateMarketingType = params => requests(PREFIX + 'save-update-marketing-type', params);

// 智能营销 --删除营销事件
export const deleteMarketingType = params => requests(PREFIX + 'delete-marketing-Type', params);

//模板库--分页列表 （有效）
export const LoadTempList = params => requests(PREFIX + 'load-message-templateList', params);

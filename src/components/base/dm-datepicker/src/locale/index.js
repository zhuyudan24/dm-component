/* eslint-disable */
import defaultLang from './dateconfig';
import Vue from 'vue';
import deepmerge from 'deepmerge';
import Format from './format';

const format = Format(Vue);

// 默认时间配置
let lang = defaultLang;
let merged = false;

let handler = function() {
  const vuei18n = Object.getPrototypeOf(this || Vue).$t;
  if (typeof vuei18n === 'function' && !!Vue.locale) {
    if (!merged) {
      merged = true;
      Vue.locale(Vue.config.lang, deepmerge(lang, Vue.locale(Vue.config.lang) || {}, { clone: true }));
    }
    return vuei18n.apply(this, arguments);
  }
};

export const t = function(path, options) {
  let value = handler.apply(this, arguments);
  if (value != null) return value;

  const array = path.split('.');
  let current = lang;

  // 找到对应的时间 月份 星期
  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i];
    value = current[property];
    if (i === j - 1) return format(value, options);
    if (!value) return '';
    current = value;
  }
  return '';
};

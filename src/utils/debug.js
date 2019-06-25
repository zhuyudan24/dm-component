
import { noop } from './utils';

export let warn = noop;
export let tip = noop;

if (process.env.NODE_ENV !== 'production') {
  const hasConsole = typeof console !== 'undefined';
  
  warn = (msg, vm) => {
    console.error(`[damo warn]: ${msg}${trace}`);
  }

  tip = (msg, vm) => {
    console.warn(`[damo tip]: ${msg}${trace}`);
  }
}


const _isDev = process.env.NODE_ENV === 'development';

/**
 * 开发输出log
 * @param {消息} msg
 */
export const log = msg => {
  // eslint-disable-next-line
  if (_isDev && console && console.log) {
    // eslint-disable-next-line
    console.log(msg);
  }
};

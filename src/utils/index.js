// 环境value
// eslint-disable-next-line
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

// 防抖
export function debounce(fn, delay) {
  delay = delay || 200;
  let timer;
  return function() {
    let that = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      timer = null;
      fn.apply(that, args);
    }, delay);
  };
}

// 节流
export function throttle(fn, interval) {
  let last;
  let timer;
  interval = interval || 200;
  return function() {
    let that = this;
    let args = arguments;
    let now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(function() {
        last = now;
        fn.apply(that, args);
      }, interval);
    } else {
      last = now;
      fn.apply(that, args);
    }
  };
}

/*
 * 一个汉字算两个字符,一个英文字母或数字算一个字符
 */
export const getByteLen = val => {
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    let a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/gi) != null) {
      len += 2;
    } else {
      len += 1;
    }
  }
  return len;
};
/*
 * 一个汉字算一个字,一个英文字母或数字算半个字
 */
export const getZhLen = val => {
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    let a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/gi) != null) {
      len += 1;
    } else {
      len += 0.5;
    }
  }
  return Math.ceil(len);
};

/*暂无用*/
export const cutStr = (str, len, type) => {
  let char_length = 0;
  for (let i = 0; i < str.length; i++) {
    let son_str = str.charAt(i);
    if (type == 1) {
      encodeURI(son_str).length > 2 ? (char_length += 1) : (char_length += 0.5);
    }
    if (type == 2) {
      char_length += 1;
    }
    if (char_length >= len) {
      let sub_len = char_length == len ? i + 1 : i;
      return str.substr(0, sub_len);
    }
  }
};
/*
 * 一个汉字算一个字,两个英文/字母算一个字
 */
export const getByteVal2 = val => {
  let returnValue = '';
  // eslint-disable-next-line
  let byteValLen = 0;
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      byteValLen += 1;
    } else {
      byteValLen += 0.5;
    }
    returnValue += val[i];
  }
  return returnValue;
};

/*
 * 限制字数用, 一个汉字算一个字,两个英文/字母算一个字
 */
export const getByteVal = (val, max) => {
  let returnValue = '';
  let byteValLen = 0;
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) byteValLen += 1;
    else byteValLen += 0.5;
    if (byteValLen > max) break;
    returnValue += val[i];
  }
  return returnValue;
};

/*
 * 限制字符数用, 一个汉字算两个字符,一个英文/字母算一个字符
 */
export const getCharVal = (val, max) => {
  let returnValue = '';
  let byteValLen = 0;
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) byteValLen += 2;
    else byteValLen += 1;
    if (byteValLen > max) break;
    returnValue += val[i];
  }
  return returnValue;
};

/*
 * 正则校验,校验非负数字
 */
export const regPos = v => {
  let regTest = /^\d+(\.\d+)?$/;
  return regTest.test(v);
};

export const setScrollTop = top => {
  document.documentElement.scrollTop = document.body.scrollTop = top;
};

/*
 * 1 一个汉字算1个字，字母数字0.5个字
 * 2 一个汉字算2个字，字母数字1个字
 * 0 一个汉字算1个字，字母数字1个字
 */
export const getByte = (str, max, type = 0) => {
  let char_length = 0;
  for (let i = 0; i < str.length; i++) {
    let son_str = str.charAt(i);

    if (type == 1) {
      encodeURI(son_str).length > 2 ? (char_length += 1) : (char_length += 0.5);
    }

    if (type == 2) {
      encodeURI(son_str).length > 2 ? (char_length += 2) : (char_length += 1);
    }

    if (type == 0) {
      char_length += 1;
    }
    if (char_length >= max) {
      let sub_len = char_length == max ? i + 1 : i;
      return str.substr(0, sub_len);
      break;
    }
  }
};

export const getZhLength = (str, type = 0) => {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    let son_str = str.charAt(i);
    if (type == 1) {
      encodeURI(son_str).length > 2 ? (len += 1) : (len += 0.5);
    }

    if (type == 2) {
      encodeURI(son_str).length > 2 ? (len += 2) : (len += 1);
    }

    if (type == 0) {
      len += 1;
    }
  }
  return Math.ceil(len);
};

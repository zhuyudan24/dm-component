/**
 * 补零
 * @param {String/Number} num
 */
export const fillZero = num => {
  num = num * 1;
  if (num < 10) {
    return '0' + num;
  } else {
    return num;
  }
};

/**
 * @param {*时间} date
 * @param {*转换的格式} type
 */
export const formateDateTimeByType = (date, type = 'yyyy-MM-dd-HH-mm-ss') => {
  if (!date) {
    return '';
  }
  if (typeof date === 'number') {
    date = new Date(date);
  }
  if (typeof date === 'string') {
    return date;
  } else {
    let year = type.indexOf('yyyy') >= 0 ? fillZero(date.getFullYear()) : '';
    let month = type.indexOf('MM') >= 0 ? '-' + fillZero(date.getMonth() + 1) : '';
    let day = type.indexOf('dd') >= 0 ? '-' + fillZero(date.getDate()) + '' : '';
    let hours = type.indexOf('HH') >= 0 ? ' ' + fillZero(date.getHours()) : '';
    let min = type.indexOf('mm') >= 0 ? ':' + fillZero(date.getMinutes()) : '';
    let sec = type.indexOf('ss') >= 0 ? ':' + fillZero(date.getSeconds()) : '';
    return year + month + day + hours + min + sec;
  }
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

/*
 * 一个汉字算一个字,两个英文/字母算一个字
 */
export const getByteVal2 = val => {
  let returnValue = '';
  // eslint-disable-next-line
  let byteValLen = 0;
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) byteValLen += 1;
    else byteValLen += 0.5;
    returnValue += val[i];
  }
  return returnValue;
};

/* eslint-disable */
const hasOwnProperty = Object.prototype.hasOwnProperty;

function noop() {}

// 是否是自有属性 不是原型链上的
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

// 匹配 %出现或不出现
const RE_NARGS = /(%|)\{([0-9a-zA-Z]+)\}/g;

export default function(Vue) {
  /**
   * @param { String } string
   * @param {Array} ...args
   * @return {String}
   */

  function template(string, ...args) {
    // debugger;
    if (args.length === 1 && typeof args[0] === 'object') {
      args = args[0];
    }

    if (!args || !args.hasOwnProperty) {
      args = {};
    }

    return string.replace(RE_NARGS, (match, prefix, i, index) => {
      let result;

      if (string[index + 1] === '{' && string[index + macth.length] === '}') {
        return i;
      } else {
        result = hasOwn(args, i) ? args[i] : null;
        if (result == null) {
          return '';
        }
        return result;
      }
    });
  }
  return template;
}

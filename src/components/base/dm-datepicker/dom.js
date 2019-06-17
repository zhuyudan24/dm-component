/* eslint-disable */
import Vue from 'vue';

const isServer = Vue.prototype.$isServer;
const ieVersion = isServer ? 0 : Number(document.documentMode);

export function hasClass(el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}

export function addClass(el, cls) {
  if (hasClass(el, cls)) return;

  const newClass = el.className.split(' ');
  newClass.push(cls);
  el.className = newClass.join(' ');
}

export function removeClass(el, className) {
  if (!hasClass(el, className)) {
    return;
  }

  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
  el.className = el.className.replace(reg, ' ');
}

export function createDom(tag, cls) {
  const dom = document.createElement(tag);
  dom.className = cls;
  return dom;
}

export const on = (() => {
  if (!isServer && document.addEventListener) {
    return function(ele, event, handler) {
      if (ele && event && handler) {
        ele.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(ele, event, handle) {
      if (ele && event && handler) {
        ele.attachEvent('on' + event, handler);
      }
    };
  }
})();

export const getStyle =
  ieVersion < 9
    ? function(element, styleName) {
        if (isServer) return;
        if (!element || !styleName) return null;
        styleName = camelCase(styleName);
        if (styleName === 'float') {
          styleName = 'styleFloat';
        }
        try {
          switch (styleName) {
            case 'opacity':
              try {
                return element.filters.item('alpha').opacity / 100;
              } catch (e) {
                return 1.0;
              }
            default:
              return element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null;
          }
        } catch (e) {
          return element.style[styleName];
        }
      }
    : function(element, styleName) {
        if (isServer) return;
        if (!element || !styleName) return null;
        styleName = camelCase(styleName);
        if (styleName === 'float') {
          styleName = 'cssFloat';
        }
        try {
          var computed = document.defaultView.getComputedStyle(element, '');
          return element.style[styleName] || computed ? computed[styleName] : null;
        } catch (e) {
          return element.style[styleName];
        }
      };

/* istanbul ignore next */
export function setStyle(element, styleName, value) {
  if (!element || !styleName) return;

  if (typeof styleName === 'object') {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop]);
      }
    }
  } else {
    styleName = camelCase(styleName);
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
    } else {
      element.style[styleName] = value;
    }
  }
}

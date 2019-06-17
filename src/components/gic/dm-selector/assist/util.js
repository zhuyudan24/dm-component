export function debounce(func, wait) {
  let timeout;

  return function(...args) {
    let that = this;
    clearTimeout(timeout);
    timeout = setTimeout(_ => {
      func.apply(that, args);
    }, wait);
  };
}

export function throttle(func, wait) {
  let timeout;
  // let previous = 0; // 时间戳

  return function(...args) {
    let that = this;
    if (!timeout) {
      timeout = setTimeout(_ => {
        timeout = null;
        func.apply(that, args);
      }, wait);
    }
  };
}

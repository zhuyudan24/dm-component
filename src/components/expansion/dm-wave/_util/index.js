import DWave from './wave';

/* istanbul ignore next */
DWave.install = function(Vue) {
  Vue.component(DWave.name, DWave);
};

export default DWave;

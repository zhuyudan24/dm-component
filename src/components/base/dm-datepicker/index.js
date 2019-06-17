import VueGicDatepicker from './date-picker/date-picker';

VueGicDatepicker.install = function(Vue) {
  Vue.component(VueGicDatepicker.name, VueGicDatepicker);
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueGicDatepicker);
}

export default VueGicDatepicker;

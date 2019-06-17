import component from './index.vue';

const install = {
  install(Vue, options) {
    Vue.component(component.name, component);
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
export default install;

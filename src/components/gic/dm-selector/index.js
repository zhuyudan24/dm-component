import vueGicSelector from './index.vue';
const gicSelector = {
  install(Vue, options) {
    Vue.component(vueGicSelector.name, vueGicSelector);
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(gicSelector);
}
export default gicSelector;

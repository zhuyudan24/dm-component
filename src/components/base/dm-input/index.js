import vueGicInput from './index.vue'; // 导入组件

const GicInput = {
  install(Vue, options) {
    Vue.component(vueGicInput.name, vueGicInput);
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(GicInput);
}
export default GicInput;

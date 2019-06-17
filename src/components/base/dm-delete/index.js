import vueGicDelete from './index.vue'; // 导入组件

const GicDelete = {
  install(Vue, options) {
    Vue.component(vueGicDelete.name, vueGicDelete);
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(GicDelete);
}
export default GicDelete;

import vueGicStore from './index.vue'; // 导入组件

const GicStore = {
  install(Vue, options) {
    Vue.component(vueGicStore.name, vueGicStore);
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(GicStore);
}
export default GicStore;

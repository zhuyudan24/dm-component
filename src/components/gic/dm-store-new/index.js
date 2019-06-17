import storeNew from './index.vue';
const gicStoreNew = {
  install(Vue, options) {
    Vue.component(storeNew.name, storeNew);
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(gicStoreNew);
}
export default gicStoreNew;

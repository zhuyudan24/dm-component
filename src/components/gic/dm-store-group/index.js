import storeGroup from './index.vue';
const gicstoreGroup = {
  install(Vue, options) {
    Vue.component(storeGroup.name, storeGroup);
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(gicstoreGroup);
}
export default gicstoreGroup;

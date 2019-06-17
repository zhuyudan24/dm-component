import vueGicPeople from './index.vue';
const GicPeople = {
  install(Vue, options) {
    Vue.component(vueGicPeople.name, vueGicPeople);
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(GicPeople);
}
export default GicPeople;

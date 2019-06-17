import storeCard from './index.vue';
const gicstoreCard = {
  install(Vue, options) {
    Vue.component(storeCard.name, storeCard);
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(gicstoreCard);
}
export default gicstoreCard;

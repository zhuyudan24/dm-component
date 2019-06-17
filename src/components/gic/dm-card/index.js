import vueGicCard from './index.vue'; // 导入组件

const GicCard = {
  install(Vue, options) {
    Vue.component(vueGicCard.name, vueGicCard);
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(GicCard);
}
export default GicCard;

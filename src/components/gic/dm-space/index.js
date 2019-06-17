import vueGicSpace from './index.vue';

const gicSpace = {
  install(Vue, options) {
    Vue.component(vueGicSpace.name, vueGicSpace);
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(gicSpace);
}

export default gicSpace;

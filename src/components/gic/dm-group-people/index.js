import vueGicGroupPeople from './index.vue'; // 导入组件

vueGicGroupPeople.install = function(Vue) {
  Vue.component(vueGicGroupPeople.name, vueGicGroupPeople);
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vueGicGroupPeople);
}

export default vueGicGroupPeople;

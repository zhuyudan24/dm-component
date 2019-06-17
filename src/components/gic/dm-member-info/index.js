import vueMemberInfo from './index.vue';
const memberInfo = {
  install(Vue, options) {
    Vue.component(vueMemberInfo.name, vueMemberInfo);
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(memberInfo);
}
export default memberInfo;

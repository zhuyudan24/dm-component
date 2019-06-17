import vueGicExportExcel from './index.vue'; // 导入组件

const GicExportExcel = {
  install(Vue, options) {
    Vue.component(vueGicExportExcel.name, vueGicExportExcel);
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(GicExportExcel);
}
export default GicExportExcel;

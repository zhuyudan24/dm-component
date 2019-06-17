import marketingEvent from './index.vue';

const gicMarketingEvent = {
  install(Vue, options) {
    Vue.component(marketingEvent.name, marketingEvent);
  }
};
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(gicMarketingEvent);
}

export default gicMarketingEvent;

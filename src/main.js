// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Axios from 'axios';
import App from './App';
import router from './router';
import '../static/font/iconfont.css';
import '../static/css/reset.css';
import ElementUI from 'element-ui';
Vue.config.productionTip = false;
Vue.prototype.axios = Axios;
Vue.prototype.axios.withCredentials = true;
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

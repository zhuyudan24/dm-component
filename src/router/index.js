import Vue from 'vue';
import Router from 'vue-router';
import Home from '../Home.vue';
import introduction from '../docs/introduction.vue';
import quickStart from '../docs/quick-start.vue';
import log from '../docs/log.vue';

import componentsList from '../../components.json';
let gic = componentsList.gic;
let base = componentsList.base;

Vue.use(Router);

const gicComponentRoutes = Object.keys(gic).map(v => ({
  path: '/gic/' + v + '.' + gic[v].version,
  name: v,
  // eslint-disable-next-line
  component: resolve => require([`../views/gic/${v}.vue`], resolve),
  meta: {
    adminName: gic[v].adminName
  }
}));

const baseComponentRoutes = Object.keys(base).map(v => ({
  path: '/base/' + v + '.' + base[v].version,
  name: v,
  // eslint-disable-next-line
  component: resolve => require([`../views/base/${v}.vue`], resolve),
  meta: {
    adminName: base[v].adminName
  }
}));

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: Home,
      redirect: '/introduction',
      children: baseComponentRoutes.concat(gicComponentRoutes).concat([
        {
          path: '/introduction',
          name: 'introduction',
          component: introduction
        },
        {
          path: '/quick-start',
          name: 'quickStart',
          component: quickStart
        },
        {
          path: '/log',
          name: 'log',
          component: log
        }
      ])
    },
    {
      path: '*',
      name: 'Home',
      component: Home
    }
  ]
});

import Vue from 'vue';
import Router from 'vue-router';
import Home from '../Home.vue';
import introduction from '../docs/introduction.vue';
import quickStart from '../docs/quick-start.vue';
import log from '../docs/log.vue';

import componentsList from '../../components.json';
let gic = componentsList.gic;
let base = componentsList.base;
let expansion = componentsList.expansion;
console.log(expansion);

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

const expansComponentRoutes = Object.keys(expansion).map(v => ({
  path: '/expansion/' + v + '.' + expansion[v].version,
  name: v,
  // eslint-disable-next-line
  component: resolve => require([`../views/expansion/${v}.vue`], resolve),
  meta: {
    adminName: expansion[v].adminName
  }
}));

const finalRoutes = baseComponentRoutes.concat(gicComponentRoutes).concat(expansComponentRoutes);

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: Home,
      redirect: '/introduction',
      children: finalRoutes.concat([
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

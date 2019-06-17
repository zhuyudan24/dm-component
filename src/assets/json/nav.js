import componentsList from '../../../components.json';
let gic = componentsList.gic;
let base = componentsList.base;
const gicComponentsList = Object.keys(gic).map(v => ({ router: '/gic/' + v + '.' + gic[v].version, key: gic[v].name + '.' + gic[v].version }));
const baseComponentsList = Object.keys(base).map(v => ({ router: '/base/' + v + '.' + base[v].version, key: base[v].name + '.' + base[v].version }));

let menuList = [
  {
    num: '01',
    name: '概览',
    'max-height': '130px',
    items: [
      {
        key: '介绍',
        router: '/introduction'
      },
      {
        key: '快速上手',
        router: '/quick-start'
      },
      {
        key: '更新记录',
        router: '/log'
      }
    ]
  },
  {
    num: '02',
    name: 'GIC组件',
    'max-height': '1200px',
    items: []
  },
  {
    num: '03',
    name: '静态组件',
    'max-height': '1200px',
    items: []
  },
  {
    num: '04',
    name: '拓展',
    items: []
  }
];

menuList[1].items = gicComponentsList;
menuList[2].items = baseComponentsList;
export default menuList;

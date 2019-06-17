<template>
  <layout>
    <template slot="component">
      <dm-aside-menu :projectName="projectName" :leftModulesName="leftModulesName" :collapseFlag="collapseFlag"></dm-aside-menu>
    </template>
    <template slot="data">
      {{ data }}
    </template>
    <template slot="markdown">
      <MyMarkdown></MyMarkdown>
    </template>
  </layout>
</template>
<script>
import layout from '../layout.vue';
import dmAsideMenu from '../../components/gic/dm-aside-menu/index.vue';
import MyMarkdown from '../../components/gic/dm-aside-menu/readme.md';

export default {
  name: 'aside-menu-view',
  components: {
    layout,
    'dm-aside-menu': dmAsideMenu,
    MyMarkdown
  },
  data() {
    return {
      // 可传参数
      projectName: '',
      collapseFlag: false, // 折叠参数
      // 模块名
      leftModulesName: '公众号配置',
      // 路由菜单
      // 修改成插件内请求
      data: {}
    };
  }
};
</script>

<template>
  <layout>
    <template slot="component">
      <dm-header :projectName="projectName" :collapseFlag="collapseFlag" @collapseTag="collapseTag" :hideUdesk="false" @toRouterView="toRouterView"></dm-header>
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
import dmHeader from '../../components/gic/dm-header/index.vue';
import { log } from '@/utils/index.js';
import MyMarkdown from '../../components/gic/dm-header/readme.md';

export default {
  name: 'header-view',
  components: {
    layout,
    'dm-header': dmHeader,
    MyMarkdown
  },
  data() {
    return {
      data: {},
      // 可传参数
      projectName: '', // 当前项目名
      collapseFlag: false // 折叠参数
      // 路由菜单
      // 修改成插件内请求
    };
  },
  methods: {
    // 处理路由跳转
    toRouterView(val) {
      var that = this;
      // 模拟检查数据
      // //有两个参数
      //{
      //  name:,
      //  path:
      //}
      log(val);
      that.$router.push({
        path: val.path
      });
    },

    // 折叠事件
    collapseTag(val) {
      log(val);
    }
  }
};
</script>

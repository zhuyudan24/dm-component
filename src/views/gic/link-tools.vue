<template>
  <layout>
    <template slot="component">
      <el-button type="primary" @click="showLinkDialog">点击弹窗</el-button>
      <dm-link-tools :projectName="projectName" :linkToolsVisible="linkToolsVisible" :showType="showType" @linkSelect="linkSelect"></dm-link-tools>
    </template>
    <template slot="data">
      {{ selectedData }}
    </template>
    <template slot="markdown">
      <MyMarkdown></MyMarkdown>
    </template>
  </layout>
</template>

<script>
import layout from '../layout.vue';
// import dmLinkTools from '../../components/gic/dm-link-tools/index.vue';
// import MyMarkdown from '../../components/gic/dm-link-tools/readme.md';
export default {
  name: 'view-link-tools',
  components: {
    layout
    // 'dm-link-tools': dmLinkTools,
    // MyMarkdown
  },
  data() {
    return {
      // 链接小工具参数
      projectName: '', // 当前项目名
      linkToolsVisible: false,
      // 显示场景类型
      showType: 0, //,插件默认0:显示全部 ; 1: (底部导航);2: (公众号菜单:只有小程序的,没有h5)
      selectedData: {}
    };
  },
  methods: {
    showLinkDialog() {
      this.linkToolsVisible = true;
    },

    linkSelect(val) {
      this.selectedData = val;
      // 关闭时隐藏
      this.linkToolsVisible = false;
    }
  }
};
</script>

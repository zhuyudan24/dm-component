<template>
  <layout>
    <template slot="component">
      <el-button @click="showStoreDialog = true" type="primary">点击弹窗</el-button>
      <dm-store :projectName="projectName" :selectId="selectId" :showStoreDialog="showStoreDialog" @selectStore="selectStore"></dm-store>
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
import dmStore from '../../components/gic/dm-store/index.vue';
import MyMarkdown from '../../components/gic/dm-store/readme.md';

export default {
  name: 'store-view',
  components: {
    layout,
    'dm-store': dmStore,
    MyMarkdown
  },
  data() {
    return {
      // 可传参数
      projectName: '', // 当前项目名
      showStoreDialog: false,
      selectId: '', // 已选的门店
      data: {}
    };
  },

  methods: {
    // 显示门店弹窗
    showStore() {
      this.showStoreDialog = true;
    },

    // 子组件触发方法
    selectStore(val) {
      // 模拟检查数据
      this.data = val;
      this.showStoreDialog = false;
    }
  }
};
</script>

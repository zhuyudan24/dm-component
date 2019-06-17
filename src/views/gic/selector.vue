<template>
  <layout>
    <template slot="component">
      <dm-selector ref="selector" :projectName="projectName"></dm-selector>
      <div>
        <el-button @click="confirm">确定</el-button>
      </div>
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
import dmSelector from '../../components/gic/dm-selector/index.vue';
import MyMarkdown from '../../components/gic/dm-selector/readme.md';

export default {
  name: 'selector-view',
  components: {
    layout,
    'dm-selector': dmSelector,
    MyMarkdown
  },
  data() {
    return {
      data: {},
      // 可传参数
      projectName: '', // 当前项目名
      queryList: null // 商品选择器的筛选值 在分页查数据的时候要传过去
    };
  },
  methods: {
    confirm() {
      // 目前是同步 如果后续业务场景有需要会改成promise
      this.queryList = this.$refs.selector.collectConditions();
    }
  }
};
</script>

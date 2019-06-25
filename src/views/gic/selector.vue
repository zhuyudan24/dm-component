<template>
  <layout>
    <template slot="component">
      <dm-selector ref="selector" :projectName="projectName" @changelist="changelist"></dm-selector>
      <div>
        <el-button @click="confirm" v-show="expends">确定</el-button>
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
      expends: true,
      // 可传参数
      projectName: '', // 当前项目名
      queryList: null // 商品选择器的筛选值 在分页查数据的时候要传过去
    };
  },
  methods: {
    changelist() {
      this.expends = true;
    },
    confirm() {
      // 目前是同步 如果后续业务场景有需要会改成promise
      this.queryList = this.$refs.selector.collectConditions();
      if (this.queryList == false) {
        this.$message.warning('商品选择器条件不能为空！');
      } else {
        this.expends = false;
      }
    }
  }
};
</script>

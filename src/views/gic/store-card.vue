<template>
  <layout>
    <template slot="component">
      <el-radio-group v-model="isInfo" style="margin-bottom:10px;">
        <el-radio :label="false">可选</el-radio>
        <el-radio :label="true">只读</el-radio>
      </el-radio-group>
      <dm-store-card :readonly="isInfo" :uuid.sync="uuid" ref="storeCard"></dm-store-card>
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
import dmStoreCard from '../../components/gic/dm-store-card/index.vue';
import MyMarkdown from '../../components/gic/dm-store-new/readme.md';

export default {
  name: 'store-card-view',
  components: {
    layout,
    'dm-store-card': dmStoreCard,
    MyMarkdown
  },
  data() {
    return {
      // 参数
      uuid: '', // 新增传空，编辑必传,
      // 需要的下拉 默认为全部[0,1,2,3,4,5]
      // 0 全部 1 门店类型 2门店标签 3 门店区域 4 门店分组 5 部分门店
      options: [0, 1, 2, 3, 4, 5],
      isAdd: true,
      data: '',
      isInfo: false // 只读
    };
  }
};
</script>

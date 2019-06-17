<template>
  <layout>
    <template slot="component">
      <dm-store-group :options="options" :isAdd="isAdd" :scenesVal="scencs" :uuid.sync="uuid" ref="storeNew"></dm-store-group>
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
import dmStoreGroup from '../../components/gic/dm-store-group/index.vue';
import MyMarkdown from '../../components/gic/dm-store-group/readme.md';

export default {
  name: 'store-new-view',
  components: {
    layout,
    'dm-store-group': dmStoreGroup,
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
      scencs: 'integral'
    };
  }
};
</script>

<template>
  <layout>
    <template slot="component">
      <dm-store-linkage :msg="sendChildData" ref="selectTree" @sendSelectGroupData="getSelectGroupData"></dm-store-linkage>
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
import dmStoreLinkage from '../../components/gic/dm-store-linkage/index.vue';
import MyMarkdown from '../../components/gic/dm-store-linkage/readme.md';

export default {
  name: 'store-linkage-view',
  components: {
    layout,
    'dm-store-linkage': dmStoreLinkage,
    MyMarkdown
  },
  data() {
    return {
      data: {},
      // 可传参数
      sendChildData: {} // 向子元素传递的对象
    };
  },
  methods: {
    //获得子元素传递的数据
    getSelectGroupData(val) {
      console.log(1111, val);
    }
  }
};
</script>

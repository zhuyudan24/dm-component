<template>
  <layout>
    <template slot="component">
      <dm-footer></dm-footer>
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
import dmFooter from '../../components/gic/dm-footer/index.vue';
import MyMarkdown from '../../components/gic/dm-footer/readme.md';

export default {
  name: 'confirm-people-view',
  components: {
    layout,
    'dm-footer': dmFooter,
    MyMarkdown
  },
  data() {
    return {
      // 可传参数
      list: [], //对象数组
      idType: '', //获取的属性，如果需要拿memberId 传'memberId'，默认为'openid',
      onlyWxMember: 1, // 获取数据类型  仅为微信会员传1   不限制传0,
      data: []
    };
  },
  methods: {
    //获取指定会员  字符串数组
    getData(val) {
      this.data = val;
    }
  }
};
</script>

<template>
  <layout>
    <template slot="component">
      <el-form label-width="80px">
        <dm-form-item prop="name" label="标题" tooltip="这是一段测试文字">
          <div>内容</div>
        </dm-form-item>
      </el-form>
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
import dmFooter from '../../components/base/dm-form-item/index.vue';
import MyMarkdown from '../../components/base/dm-form-item/readme.md';

export default {
  name: 'confirm-people-view',
  components: {
    layout,
    'dm-form-item': dmFooter,
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

<template>
  <layout>
    <template slot="component">
      <wave>
        <el-button type="danger">删除</el-button>
      </wave>
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
import Wave from '../../components/expansion/dm-wave/_util';
import MyMarkdown from '../../components/expansion/dm-wave/readme.md';

export default {
  name: 'dm-wave',

  components: {
    Wave,
    layout,
    MyMarkdown
  },

  data() {
    return {
      data: []
    };
  }
};
</script>

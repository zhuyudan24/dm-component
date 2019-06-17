<template>
  <layout>
    <template slot="component">
      <p>
        0 一个汉字算1个字，字母数字1个字
        <dm-input :byteType="0" type="text" class="w400" v-model="value" :maxlength="20"></dm-input>
      </p>
      <p>
        1 一个汉字算1个字，字母数字0.5个字
        <dm-input :byteType="1" type="text" class="w400" v-model="value" :maxlength="20"></dm-input>
      </p>
      <p>
        2 一个汉字算2个字，字母数字1个字
        <dm-input :byteType="2" type="text" class="w400" v-model="value" :maxlength="20"></dm-input>
      </p>
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
import dmInput from '../../components/base/dm-input/index.vue';
import MyMarkdown from '../../components/base/dm-input/readme.md';

export default {
  name: 'input-view',
  components: {
    layout,
    'dm-input': dmInput,
    MyMarkdown
  },
  data() {
    return {
      // 可传参数
      value: '',
      data: []
    };
  }
};
</script>

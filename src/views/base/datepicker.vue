<template>
  <layout>
    <template slot="component">
      <dm-datepicker></dm-datepicker>
    </template>
    <template slot="data"></template>
    <template slot="markdown">
      <MyMarkdown></MyMarkdown>
    </template>
  </layout>
</template>
<script>
import layout from '../layout.vue';
import MyMarkdown from '../../components/base/dm-datepicker/readme.md';
import dmDatepicker from '../../components/base/dm-datepicker/date-picker/date-picker';
export default {
  name: 'datepicker-view',
  components: {
    layout,
    'dm-datepicker': dmDatepicker,
    MyMarkdown
  },
  data() {
    return {
      data: {}
    };
  }
};
</script>

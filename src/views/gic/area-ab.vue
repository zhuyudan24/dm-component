<template>
  <layout>
    <template slot="component">
      <dm-area-ab :projectName="projectName" :areaOptions="areaOptions" @selected="selected"></dm-area-ab>
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
import dmAreaAb from '../../components/gic/dm-area-ab/index.vue';
import MyMarkdown from '../../components/gic/dm-area-ab/readme.md';
export default {
  name: 'store-view',
  components: {
    layout,
    'dm-area-ab': dmAreaAb,
    MyMarkdown
  },
  data() {
    return {
      // 可传参数
      projectName: '', // 当前项目名
      areaOptions: {
        provinceName: '',
        provinceId: '',
        cityName: '',
        cityId: '',
        countryName: '',
        countyId: ''
      },
      data: {}
    };
  },
  methods: {
    selected(val) {
      this.data = val;
    }
  }
};
</script>

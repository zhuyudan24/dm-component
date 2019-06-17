<template>
  <layout>
    <template slot="component">
      <img :src="src" alt="img" @mouseover="showImage(src)" />
      <dm-img-preview :imgUrl="imgUrl" :imgShowFlag="imgShowFlag" @hideImage="hideImage"></dm-img-preview>
    </template>
    <template slot="data"> </template>
    <template slot="markdown">
      <MyMarkdown></MyMarkdown>
    </template>
  </layout>
</template>
<script>
import layout from '../layout.vue';
import dmImgPreview from '../../components/gic/dm-img-preview/index.vue';
import MyMarkdown from '../../components/gic/dm-img-preview/readme.md';

export default {
  name: 'img-preview-view',
  components: {
    layout,
    'dm-img-preview': dmImgPreview,
    MyMarkdown
  },
  data() {
    return {
      // 可传参数
      // eslint-disable-next-line
      src: require('@/assets/img/goods.jpg'),
      imgShowFlag: false, // 是否弹框显示,true: 显示；false: 不显示
      imgUrl: '' // 传递的图片 src
    };
  },
  methods: {
    showImage(src) {
      var that = this;
      if (!src || src == '') {
        return false;
      }
      that.imgShowFlag = true;
      that.imgUrl = src;
    },
    hideImage(val) {
      var that = this;
      that.imgShowFlag = val;
    }
  }
};
</script>

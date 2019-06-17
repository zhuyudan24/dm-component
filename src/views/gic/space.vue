<template>
  <layout>
    <template slot="component">
      <vue-gic-space id="dropzone" ref="myDropzone" :options="dropzoneOptions" :action="folderUrl" :parentId="parentId" :useCustomSlot="true" @upload-complete="uploadComplete">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将图片或文件夹拖到此处上传，或点击<b>上传</b>图片</div>
        <div class="upload-tips">仅支持5M以内的jpg、png、gif格式的图片</div>
      </vue-gic-space>
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
import VueGicSpace from '../../components/gic/dm-space/index.vue';
import MyMarkdown from '../../components/gic/dm-space/readme.md';

export default {
  name: 'space-view',
  components: {
    layout,
    VueGicSpace,
    MyMarkdown
  },
  data() {
    return {
      // 必传参数
      dropzoneOptions: {
        autoProcessQueue: false, // 由于上传文件夹的限制 设置为false
        url: 'XXX?requestProject=mall', // 上传地址图片 必选
        headers: { header: 'value' }
      },
      parentId: 'xxx', // 上传到那个文件夹目录下 必选
      folderUrl: 'xxx?requestProject=mall', // 创建文件夹地址 必选
      data: ''
    };
  },
  methods: {
    // 对外暴露了一个file
    uploadComplete() {
      // 这就是上次完成的回调
    }
  }
};
</script>

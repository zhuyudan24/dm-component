<template>
  <layout>
    <template slot="component">
      <el-button type="primary" @click="dialogVisible = true">点击弹窗</el-button>
      <dm-export-excel :dialogVisible.sync="dialogVisible" :type="1" :excelUrl="excelUrl" :params="params" :projectName="projectName"> </dm-export-excel>
    </template>
    <template slot="data"></template>
    <template slot="markdown">
      <MyMarkdown></MyMarkdown>
    </template>
  </layout>
</template>
<script>
import layout from '../layout.vue';
import dmExportExcel from '../../components/gic/dm-export-excel/index.vue';
import MyMarkdown from '../../components/gic/dm-export-excel/readme.md';

export default {
  name: 'export-excel-view',
  components: {
    layout,
    'dm-export-excel': dmExportExcel,
    MyMarkdown
  },
  data() {
    return {
      projectName: '', // 当前项目名
      dialogVisible: false,
      excelUrl: '', // 下载数据的地址
      params: {} // 传递的参数
    };
  },
  methods: {
    // 上传成功 返回的图片对象 里面有图片 大小 类型 等相关信息
    uploadOnSuccess(obj) {
      // 目前返回两个参数 {res:res,file:file}
      obj.file.url = obj.res.result[0].qcloudImageUrl;
      this.imageList.push(obj.file);
    },
    // 删除图片 返回图片列表的索引 你可以根据这个索引去找对应图片的id
    deleteImage(i) {
      this.imageList.splice(i, 1);
    },
    // 排序图片
    sortImg(val) {
      this.imageList = val;
    }
  }
};
</script>

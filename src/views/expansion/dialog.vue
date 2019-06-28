<template>
  <layout>
    <template slot="component">
      <el-button type="text" @click="dialogVisible = true">点击打开</el-button>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
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
import MyMarkdown from '../../components/expansion/dm-dialog/readme.md';

export default {
  name: 'dm-wave',

  components: {
    layout,
    MyMarkdown
  },

  data() {
    return {
      data: [],
      dialogVisible: false,
      show: false
    };
  }
};
</script>

<style>
.page-guide {
  padding: 55px 30px 95px;
  box-sizing: border-box;
  .content {
    padding-left: 25px;
    margin-left: -1px;
    h2 {
      margin-bottom: 10px;
    }

    h3 {
      font-size: 22px;
      font-weight: normal;
      margin: 0 0 30px;
      color: #1f2d3d;
    }
    p {
      line-height: 1.6;
      font-size: 14px;
      color: #5e6d82;
    }
    ul {
      margin-bottom: 50px;
      padding-left: 0;
    }
    li {
      font-size: 14px;
      margin-bottom: 10px;
      color: #99a9bf;
      list-style: none;
      &:before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        vertical-align: middle;
        background-color: #5e6d82;
        margin-right: 5px;
      }
      strong {
        color: #5e6d82;
        font-weight: 400;
      }
    }
  }
}

@media (max-width: 768px) {
  .page-guide {
    .content {
      padding-left: 0;
    }
  }
}
</style>

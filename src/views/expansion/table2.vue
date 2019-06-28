<template>
  <layout>
    <template slot="component">
      <div class="table">
        <el-table :data="tableData" border>
          <el-table-column prop="date" label="日期" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button @click="handleDelete(scope.$index)" type="danger"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="add" type="primary">新增</el-button>
      </div>
    </template>
    <template slot="data">
      {{ data }}
    </template>
    <template slot="markdown">
      <!-- <MyMarkdown></MyMarkdown> -->
    </template>
  </layout>
</template>

<script>
import layout from '../layout.vue';

export default {
  components: {
    layout
  },
  data() {
    return {
      data: [],
      tableData: [{ name: '张三', date: '20190123', address: '杭州市文三路', id: 'asdqw2' }]
    };
  },

  methods: {
    handleDelete(i) {
      this.tableData.splice(i, 1);
    },
    add() {
      console.log(this.tableData);
      this.tableData.push(this.tableData[0]);
    }
  }
};
</script>

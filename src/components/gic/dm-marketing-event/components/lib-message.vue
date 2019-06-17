<template>
  <el-dialog title="" :visible.sync="show" width="800px" :before-close="close">
    <span slot="title">
      <span class="el-dialog__title">选择短信</span>
      <span class="pl10 fz13 gray"><i class="el-icon-info pr10"></i>短信运营商限制：为避免骚扰用户，营销短信只允许在8点到22点发送</span>
    </span>
    <div class="pb22 clearfix">
      <div class="fl">
        <span class="pr10">共{{ total }}条</span><el-input clearable v-model="listParams.search" class="w200" placeholder="请输入标题/作者" @change="refresh"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
      </div>
      <div class="fr">
        <el-button type="primary" @click="add">新建短信</el-button>
        <el-button @click="refresh">刷新列表</el-button>
      </div>
    </div>
    <el-table tooltipEffect="light" :data="smsTempList" height="400" style="width: 100%" row-class-name="cursor-pointer" v-loading="loading" @row-click="rowClick">
      <el-table-column :show-overflow-tooltip="false" :width="60" align="center" prop="smsTemplateId">
        <template slot-scope="scope">
          <div class="label-hidden">
            <el-radio v-model="selectedData" :label="scope.row" class="pr10"></el-radio>
          </div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="false" :width="200" :min-width="200" align="left" prop="title" label="模板名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="false" :width="200" :min-width="200" align="left" prop="content" label="模板类型">
        <template slot-scope="scope">
          <p class="gray">{{ scope.row.type === 0 ? '普通短信' : scope.row.type === 1 ? '营销短信' : '验证码' }}</p>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="false" :min-width="200" align="left" prop="content" label="模板内容">
        <template slot-scope="scope">
          <div class="ellipsis-l3">{{ scope.row.content }}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-show="smsTempList.length" class="dm-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listParams.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="listParams.pageSize" layout="prev, pager, next" :total="total"></el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">关 闭</el-button>
      <el-button type="primary" @click="addItem">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { LoadTempList } from '../assets/api.js';
export default {
  name: 'lib-message',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listParams: {
        search: '',
        currentPage: 1,
        pageSize: 20
      },
      total: 0,
      smsTempList: [],
      selectedData: {}
    };
  },
  created() {
    this.LoadTempList();
  },
  methods: {
    handleSizeChange(val) {
      this.listParams.pageSize = val;
      this.LoadTempList();
    },
    handleCurrentChange(val) {
      this.listParams.currentPage = val;
      this.LoadTempList();
    },
    LoadTempList() {
      this.loading = true;
      LoadTempList(this.listParams).then(res => {
        if (res.errorCode === 0) {
          this.smsTempList = (res.result && res.result.result) || [];
          this.total = res.result && res.result.totalCount;
        }
        this.loading = false;
      });
    },
    rowClick(row) {
      row.comName = 'message';
      this.selectedData = row;
    },
    addItem() {
      if (!this.selectedData.comName) {
        this.$message({ type: 'warning', message: '未选择短信' });
        return;
      }
      this.$emit('sendItem', this.selectedData);
      this.close();
    },
    close() {
      this.$emit('update:show', false);
    },
    add() {
      window.open('/marketing/#/message/temp/add');
    },
    refresh() {
      this.listParams.currentPage = 1;
      this.LoadTempList();
    }
  }
};
</script>

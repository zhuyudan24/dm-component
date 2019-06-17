<template>
  <el-dialog title="选择图文" :visible.sync="show" width="800px" :before-close="close">
    <div class="pb22 clearfix">
      <div class="fl">
        图文消息(共{{ total }}条) <el-input v-model="listParams.searchName" clearable class="w200 ml10" placeholder="请输入标题/作者" @change="refresh"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
      </div>
      <div class="fr">
        <el-button type="primary" @click="add">新建图文</el-button>
        <el-button @click="refresh">刷新列表</el-button>
      </div>
    </div>
    <el-radio-group class="dm-imgtext-list" v-model="selectedData" v-loading="loading">
      <el-table tooltipEffect="light" :data="textImgList" height="360" style="width: 100%" row-class-name="cursor-pointer" @row-click="rowClick">
        <el-table-column label="" align="center" width="55px">
          <template slot-scope="scope">
            <div class="label-hidden"><el-radio :label="scope.row"></el-radio></div>
          </template>
        </el-table-column>
        <el-table-column label="图片" align="left" width="120px" class-name="table-img">
          <template slot-scope="scope">
            <img width="100" height="50" class="border-radius__default" :src="scope.row.itemList.length ? scope.row.itemList[0].qcloudImageUrl || '' : ''" alt="" />
          </template>
        </el-table-column>
        <el-table-column label="图文标题" align="left" min-width="100px">
          <template slot-scope="scope">
            <a class="blue" :href="scope.row.itemList.length ? scope.row.itemList[0].mediaUrl || '' : ''" target="_blank">{{ scope.row.itemList.length ? scope.row.itemList[0].titleName || '' : '' }}</a>
          </template>
        </el-table-column>
        <el-table-column label="作者" prop="updateTimeStr" align="left" width="120px">
          <template slot-scope="scope">
            <p>{{ scope.row.itemList.length ? scope.row.itemList[0].authorName || '--' : '' }}</p>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTimeStr" align="left" width="160px">
          <template slot-scope="scope">
            {{ scope.row.updateTimeStr }}
          </template>
        </el-table-column>
      </el-table>
    </el-radio-group>
    <el-pagination v-show="textImgList.length" class="dm-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listParams.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="listParams.pageSize" layout="prev, pager, next" :total="total"></el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">关 闭</el-button>
      <el-button type="primary" @click="addItem">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { loadImgTextList } from '../assets/api.js';
import { formateDateTimeByType } from '../assets/utils.js';
import { log } from '@/utils/index.js';
export default {
  name: 'lib-teletext',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.loadImgTextList();
  },
  data() {
    return {
      textImgList: [],
      listParams: {
        currentPage: 1,
        pageSize: 20,
        searchName: ''
      },
      total: 0,
      loading: false,
      selectedData: {}
    };
  },
  methods: {
    loadImgTextList() {
      this.loading = true;
      loadImgTextList(this.listParams).then(res => {
        if (res.errorCode === 0) {
          this.textImgList = res.result.result || [];
          this.total = res.result.totalCount;
          this.textImgList.map(v => {
            v.createTimeStr = formateDateTimeByType(v.createTime, 'yyyy-MM-dd-HH-mm');
            v.updateTimeStr = formateDateTimeByType(v.updateTime, 'yyyy-MM-dd-HH-mm');
          });
        }
        this.loading = false;
      });
    },
    rowClick(row) {
      row.comName = 'teletext';
      row.title = row.itemList[0] && row.itemList[0].titleName;
      log(row);
      this.selectedData = row;
    },
    addItem() {
      if (!this.selectedData.comName) {
        this.$message({ type: 'warning', message: '未选择图文消息' });
        return;
      }
      this.$emit('sendItem', this.selectedData);
      this.close();
    },
    close() {
      this.$emit('update:show', false);
    },
    add() {
      window.open('/marketing/#/wechat/editor');
    },
    refresh() {
      this.listParams.currentPage = 1;
      this.loadImgTextList();
    },
    handleSizeChange(val) {
      this.listParams.pageSize = val;
      this.loadImgTextList();
    },
    handleCurrentChange(val) {
      this.listParams.currentPage = val;
      this.loadImgTextList();
    }
  }
};
</script>

<style lang="scss" scoped>
.dm-imgtext-list {
  width: 100%;
}
</style>

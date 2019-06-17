<template>
  <!-- 选择门店 -->
  <el-dialog class="choose-wrap" title="选择门店" :visible.sync="dialogStore" :before-close="handleStoreClose" width="800px" :append-to-body="appendToBody">
    <div class="choose-content-wrap">
      <div class="search">
        <el-input class="input-search" placeholder="请输门店名称/code" prefix-icon="el-icon-search" v-model="searchStoreValue" @change="toSearchInput" clearable></el-input>
      </div>
      <div class="choose-shop-list">
        <el-table ref="multipleTable" :data="tableStoreData" tooltip-effect="dark" style="width: 100%" @row-click="handleChangeSelectStore">
          <el-table-column label="" width="55">
            <template slot-scope="scope">
              <el-radio class="radio-style" v-model="radioStore" :label="scope.row.storeId">
                &nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column label="门店名称">
            <template slot-scope="scope">
              <h2 class="text-normal" style="color: #606266;font-size: 14px;margin: 0;">{{ scope.row.storeName }}</h2>
            </template>
          </el-table-column>
          <el-table-column label="门店地址">
            <template slot-scope="scope">
              <p class="text-normal" style="color: #909399;font-size: 14px;margin: 0;">{{ scope.row.proName }}/{{ scope.row.cityName }}/{{ scope.row.countyName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="门店代码" width="200">
            <template slot-scope="scope">{{ scope.row.storeCode }}</template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="tableStoreData.length > 0" class="pagination" @size-change="storeSizeChange" @current-change="storeCurrentChange" :current-page="storeCurrentPage" :page-size="storePageSize" layout="prev, pager, next" :total="total"> </el-pagination>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogStorecancel">取 消</el-button>
      <el-button type="primary" @click="dialogStoreConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import qs from 'qs';
import { baseUrl } from '@/config/index.js';
import { log } from '@/utils/index.js';
export default {
  name: 'vue-gic-store',
  props: ['showStoreDialog', 'projectName', 'selectId', 'appendToBody'],
  data() {
    return {
      repProjectName: 'gic-web', // 项目名
      searchText: '',
      /*门店列表*/
      tableStoreData: [],
      showShopDetail: '', // 用于显示选中的门店
      currentRow: null,
      radioStore: null,
      dialogStore: false,

      storeCurrentPage: 1,
      storePageSize: 5,
      total: 1,
      searchStoreValue: ''
    };
  },
  methods: {
    handleChangeSelectStore(val) {
      // 当前格发生变化时触发
      this.radioStore = val.storeId;
      this.currentRow = val;
    },

    // 页码变化
    storeSizeChange(val) {
      // 选择分页符
      log(`每页 ${val} 条`);
    },

    // 当前页变化
    storeCurrentChange(val) {
      this.storeCurrentPage = val;
      this.getStoreList();
    },

    // 设置接收参数
    setNewData(storeFlag) {
      this.dialogStore = storeFlag;
    },

    // 搜索输入
    toSearchInput(value) {
      this.storeCurrentPage = 1;
      this.getStoreList();
    },

    //  确认
    dialogStoreConfirm() {
      if (!this.currentRow || !Object.keys(this.currentRow).length || !Object.values(this.currentRow).length) {
        this.$message.error({
          duration: 1000,
          message: '请选择门店'
        });
        return;
      }

      this.$emit('selectStore', this.currentRow);
      this.currentRow = {};
      this.radioStore = null;
    },

    handleStoreClose() {
      this.dialogStorecancel();
    },

    //  取消
    dialogStorecancel() {
      this.dialogStore = false;
      this.currentRow = {};
      this.radioStore = null;
      this.$emit('selectStore', this.currentRow);
    },

    // 获取门店列表
    getStoreList() {
      var para = {
        currentPage: this.storeCurrentPage,
        pageSize: this.storePageSize,
        searchName: this.searchStoreValue || '',
        requestProject: this.repProjectName
      };
      this.axios
        .post(baseUrl + '/api-admin/store-list-paging', qs.stringify(para))
        .then(res => {
          log(res, res.data, res.data.errorCode);
          var resData = res.data;
          if (resData.errorCode == 0) {
            this.tableStoreData = resData.result.list;
            this.total = resData.result.page.totalCount;
            return;
          }
          this.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(error => {
          log(error);
          this.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    }
  },
  watch: {
    showStoreDialog(newData, oldData) {
      this.setNewData(newData);
    },
    projectName(newData, oldData) {
      this.repProjectName = newData || 'gic-web';
    },
    selectId(newData, oldData) {
      this.radioStore = newData;
    }
  },

  /* 接收数据 */
  mounted() {
    // 项目名
    this.repProjectName = this.projectName || 'gic-web';
    this.radioStore = this.selectId;
    // 获取门店列表
    this.getStoreList();
    this.setNewData(this.showStoreDialog);
  }
};
</script>

<style lang="scss" scoped>
.choose-wrap {
  .search {
    width: 260px;
    margin-bottom: 22px;
  }
  .text-normal {
    margin: 0;
    color: #606266;
    font-size: 14px;
    font-weight: normal;
  }
  .choose-list {
    max-height: 404px;
    border-top: 1px solid #ebeef5;
    .list-img {
      width: 80px;
      height: 80px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .pagination {
    text-align: right;
    margin-top: 20px;
    line-height: 1;
  }
  /deep/ .el-dialog {
    // height: 677px;
    // top: 50%;
    // transform: translate(0, -50%);
  }

  /deep/ .el-dialog__header {
    line-height: 24px;
  }
}

.choose-shop-list /deep/ .el-table__row {
  cursor: pointer;
}
.choose-shop-list /deep/ .el-table .has-gutter {
  line-height: 1;
}
.choose-wrap /deep/ .el-dialog__body {
  padding: 10px 20px;
}
</style>

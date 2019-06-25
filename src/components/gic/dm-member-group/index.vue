<template>
  <div class="group-set-transfer">
    <div class="flex-1 table-container select-list">
      <div class="input-div">
        <el-input class="w-220" placeholder="请输入关键字搜索分组" prefix-icon="el-icon-search" v-model="dataSearch" @keyup.enter.native="searchEnterFun" clearable @clear="clearSearch('dataSearch')"> </el-input>
        <el-select class="w-100" placeholder="请选择" v-model="select.selectedItem" @change="selectChange">
          <el-option v-for="item in select.selectList" :key="item.memberTagGroupClassifyId" :label="item.classifyName" :value="item.memberTagGroupClassifyId"></el-option>
        </el-select>
        <div style="float: right">
          <a :href="createGroupLink">
            <el-button type="primary">新增分组</el-button>
          </a>
          <el-button @click="refreshTable">刷新列表</el-button>
        </div>
      </div>
      <el-table @row-click="selectRow" v-loading="loading" v-loadmore="loadmore" ref="originTable" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange" :height="height - 72">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="分组名称" min-width="170" prop="groupName"> </el-table-column>
        <el-table-column v-if="headerList.indexOf('isRealTime') > -1" label="是否实时" min-width="80px">
          <template slot-scope="scope">
            {{ scope.row.isRealTime == 1 ? '实时' : '非实时' }}
          </template>
        </el-table-column>
        <el-table-column v-if="headerList.indexOf('latestUpdateTime') > -1" label="最近更新时间" min-width="120px">
          <template slot-scope="scope">
            <p class="h-18">{{ scope.row.latestUpdateTime | formatTimeYMD }}</p>
            <p class="h-18">{{ scope.row.latestUpdateTime | formatTimeHMS }}</p>
          </template>
        </el-table-column>
        <el-table-column v-if="headerList.indexOf('updateType') > -1" label="更新频率" min-width="100px">
          <template slot-scope="scope">
            <template v-if="scope.row.isRealTime == 0">
              {{ (scope.row.updateType, scope.row.updateDay | formatUpdateFrequency) }}
            </template>
            <template v-else>
              --
            </template>
          </template>
        </el-table-column>
        <el-table-column v-if="headerList.indexOf('effectiveStatus') > -1" prop="state" label="状态" min-width="60px">
          <template slot-scope="scope">
            {{ scope.row.effectiveStatus == 1 ? '有效' : '失效' }}
          </template>
        </el-table-column>
        <el-table-column v-if="headerList.indexOf('effectiveDate') > -1" prop="recentUpdateDate" label="到期时间" min-width="100px">
          <template slot-scope="scope">
            <p class="h-18">{{ scope.row.effectiveDate | formatTimeYMD }}</p>
            <p class="h-18">{{ scope.row.effectiveDate | formatTimeHMS }}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btn-box" :style="'height:' + height + 'px'">
      <div class="icon-container">
        <el-button class="transfer-icon m-b-26" size="mini" :type="selectionToTransfer.length > 0 ? 'primary' : ''" :disabled="selectionToTransfer.length < 1" icon="el-icon-arrow-right" @click="selectToTransfer" circle> </el-button>
        <el-button class="transfer-icon" size="mini" :type="selectionToRemove.length > 0 ? 'primary' : ''" :disabled="selectionToRemove.length < 1" icon="el-icon-close" @click="selectToRemove" circle> </el-button>
      </div>
    </div>
    <div class="selected-list table-container">
      <div class="input-div">
        <el-input placeholder="请输入关键字搜索分组" prefix-icon="el-icon-search" v-model="dataSearchSelected" clearable @clear="clearSearch('dataSearchSelected')"> </el-input>
      </div>
      <el-table ref="selectedTable" @row-click="selectRowToMove" :data="selectedData" @selection-change="handleSelectedSelectionChange" :height="height - 114">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="分组名称" prop="groupName"> </el-table-column>
        <el-table-column label="是否实时" width="116px">
          <template slot-scope="scope">
            {{ scope.row.isRealTime == 1 ? '实时' : '非实时' }}
          </template>
        </el-table-column>
      </el-table>
      <p class="cover-count">
        已选中<span class="count">{{ countOfCoverTotal }}</span
        >人
      </p>
    </div>
  </div>
</template>
<script>
import { baseUrl } from '@/config/index.js';
import { log } from '@/utils/index.js';
export default {
  name: 'vue-gic-member-group',
  props: {
    defaltSelected: {
      type: Array,
      default() {
        return [];
      }
    },
    height: {
      type: Number,
      default: 543
    },
    projectName: {
      type: String,
      default: 'memberTag'
    },
    headerList: {
      type: Array,
      default() {
        return ['isRealTime', 'latestUpdateTime', 'updateType', 'effectiveStatus', 'effectiveDate'];
      }
    },
    effectiveStatus: {
      type: [String, Number],
      default: 1
    }
  },
  data() {
    return {
      // 下拉列表相关的数据
      select: {
        selectList: [],
        selectedItem: ''
      },
      tableData: [],
      pageSize: 20,
      currentPage: 1,
      dataSearch: '',
      baseUrl,
      dataSearchSelected: '',
      selectedData: [], // 穿梭窗已选入数据
      staticSelectedData: [],
      selectionToTransfer: [], // 穿梭窗选入数据
      selectionToRemove: [], // 已选的将要删除的选入数据
      canClick: false,
      countOfCoverTotal: 0,
      totalPage: 1,
      loading: false,
      createGroupLink: ''
    };
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper');
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          /*
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           *
           */
          let sign = 1; // 定义默认的向上滚于乡下滚的边界
          const CONDITION = this.scrollHeight - this.scrollTop < this.clientHeight + 1 && this.scrollTop > sign; // 注意: && this.scrollTop

          if (this.scrollTop > sign) {
            sign = this.scrollTop;
          }
          if (this.scrollTop < sign) {
            sign = this.scrollTop;
          }

          if (CONDITION) {
            binding.value();
          }
        });
      }
    }
  },
  methods: {
    /**
     * 拉到底部加载更多
     */
    loadmore() {
      if (this.currentPage < this.totalPage) {
        this.currentPage += 1;
        this.getGroupList();
      }
    },
    /**
     * 点击整行勾引
     */
    selectRow(row, event, column) {
      this.$refs.originTable.toggleRowSelection(row);
    },

    selectRowToMove(row, event, column) {
      this.$refs.selectedTable.toggleRowSelection(row);
    },

    // 刷新表格
    refreshTable() {
      this.currentPage = 1;
      this.tableData = [];
      this.getGroupList();
    },
    // 获取分类
    getClassList() {
      this.axios
        .get(`${this.baseUrl}/gic-member-tag-web/member-tag-group-classify/list?requestProject=gic-member-tag-web`)
        .then(res => {
          let { errorCode, message, result } = res.data;
          if (errorCode === 1) {
            if (result.length > 0) {
              this.select.selectList = result;
              this.select.selectedItem = result[0].memberTagGroupClassifyId;
            }
            return;
          }
          this.$message.error({
            duration: 1000,
            message
          });
        })
        .catch(err => {
          this.$message.error({
            duration: 1000,
            message: err.message
          });
        });
    },
    /**
     * 获取分组列表数据
     */
    getGroupList() {
      const that = this;
      that.loading = true;
      that.axios
        .get(`${that.baseUrl}/gic-member-tag-web/member-tag-group/findList.json?requestProject=${that.projectName}&pageSize=${that.pageSize}&pageNum=${that.currentPage}&groupName=${that.dataSearch}&effectiveStatus=${that.effectiveStatus}&memberTagGroupClassifyId=${that.select.selectedItem}`)
        .then(res => {
          log(res, 'group list');
          if (res.data.errorCode == 1) {
            that.tableData = that.tableData.concat(res.data.result.result);
            that.totalPage = res.data.result.totalPage;
            that.loading = false;
            return;
          }
          that.loading = false;
          that.$message.error({
            duration: 1000,
            message: res.data.message
          });
        })
        .catch(error => {
          that.loading = false;
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    selectChange() {
      this.currentPage = 1;
      this.dataSearch = '';
      this.tableData = [];
      this.getGroupList();
    },
    searchEnterFun() {
      const { selectList } = this.select;
      this.currentPage = 1;
      this.tableData = [];
      this.select.selectedItem = selectList.length > 0 ? selectList[0].memberTagGroupClassifyId : '';
      this.getGroupList();
    },

    /**
     * 清除搜索框
     */
    clearSearch(prop) {
      this[prop] = '';
      if (prop == 'dataSearch') {
        this.getGroupList();
      }
    },

    /**
     * 处理穿梭窗选入数据
     */
    handleSelectionChange(val) {
      this.selectionToTransfer = val;
    },

    selectToTransfer() {
      this.selectedData = this.uniqueByGroupId(this.selectedData.concat(this.selectionToTransfer)); // 数组拼接并去重
      this.staticSelectedData = [].concat(JSON.parse(JSON.stringify(this.selectedData)));
      this.getMemberCountByGroups();
      this.$emit('handleDataTransferred', this.selectedData, this.selectionToTransfer);
      this.$refs.originTable.clearSelection();
    },

    /**
     * 根据分组ID去重
     */
    uniqueByGroupId(arr, type = 'memberTagGroupId') {
      let res = [];
      let json = {};
      for (let i = 0; i < arr.length; i++) {
        if (!json[arr[i][type]]) {
          res.push(arr[i]);
          json[arr[i][type]] = 1;
        }
      }
      return res;
    },

    /**
     * 处理已选的将要删除的选入数据
     */
    handleSelectedSelectionChange(val) {
      this.selectionToRemove = [];
      this.selectionToRemove = val;
    },

    selectToRemove() {
      let that = this;
      let seleced = that.selectedData;
      let setection = that.selectionToRemove;
      let aSet = new Set(seleced);
      let bSet = new Set(setection);
      that.selectedData = seleced.concat(setection).filter(v => !aSet.has(v) || !bSet.has(v)); // 两数组非交集部分即为剔除后剩下的数据
      let arr = that.staticSelectedData.slice(0);
      arr.forEach((father, idx) => {
        setection.forEach(son => {
          if (son.memberTagGroupId == father.memberTagGroupId) {
            let index = that.staticSelectedData.indexOf(father);
            that.staticSelectedData.splice(index, 1);
          }
        });
      });
      that.searchSelectedByKey(that.dataSearchSelected);
      that.getMemberCountByGroups();
      that.$emit('handleDataLeft', that.selectedData, that.selectionToRemove);
      that.$refs.selectedTable.clearSelection();
    },

    /**
     * 获取已选分组去重后的分组数据
     */
    getMemberCountByGroups() {
      const that = this;
      let selectedData = that.selectedData;
      if (selectedData.length < 1) {
        that.countOfCoverTotal = 0;
        return false;
      }
      let idsArr = [];
      selectedData.forEach(group => {
        idsArr.push(group.memberTagGroupId);
      });
      let ids = idsArr.join(',');
      that.axios.get(`${that.baseUrl}/gic-member-tag-web/member-tag-member/findMemberListByGroupIds.json?requestProject=${that.projectName}&memberTagGroupIds=${ids}&pageName=memberSign`).then(res => {
        if (res.data.errorCode == 1) {
          that.countOfCoverTotal = res.data.result.page.totalCount;
        }
      });
    },

    searchSelectedByKey(key) {
      let arr = [];
      this.staticSelectedData.forEach(data => {
        if (data.groupName.toLowerCase().includes(key.toLowerCase())) {
          arr.push(data);
        }
      });
      this.selectedData = arr;
    }
  },
  filters: {
    formatTimeYMD(data) {
      return data && data != '- -' ? data.split(' ')[0] : '--';
    },
    formatTimeHMS(data) {
      return data && data != '- -' ? data.split(' ')[1] : '--';
    },
    formatNum(data) {
      const reg = /\d{1,3}(?=(\d{3})+$)/g;
      return (data + '').replace(reg, '$&,');
    },
    formatUpdateFrequency(type, day) {
      switch (type) {
        case 1:
          return '每天一次';
          break;
        case 2:
          let weekArr = ['一', '二', '三', '四', '五', '六', '日'];
          return day ? `每周${weekArr[day - 1]}` : '每周一次';
          break;
        case 3:
          return day ? `每月${day}号` : '每月一次';
          break;
        default:
          return '--';
      }
    }
  },
  mounted() {
    log(this.defaltSelected, 'defaltSelected');
    this.createGroupLink = `${window.location.origin}/member-tag/#/memberGroupEdit`;
    this.getGroupList();
    this.getClassList();
    if (this.defaltSelected.length > 0) {
      this.selectedData = this.uniqueByGroupId(this.selectedData.concat(this.defaltSelected)); // 数组拼接并去重
      this.staticSelectedData = [].concat(JSON.parse(JSON.stringify(this.selectedData)));
    }
    this.getMemberCountByGroups();
  },
  watch: {
    dataSearchSelected(now, old) {
      this.searchSelectedByKey(now);
    }
  }
};
</script>
<style lang="scss">
.group-set-transfer {
  display: flex;
  width: 100%;
  min-width: 1160px;
  background: #fff;
  padding: 10px 30px 20px;
  box-sizing: border-box;
  a {
    color: #606266;
  }
  .flex-1 {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  .w-220 {
    width: 220px;
  }
  .w-100 {
    width: 100px;
  }
  .m-b-26 {
    margin-bottom: 26px;
  }
  .input-div {
    padding: 20px 14px;
  }
  > .table-container {
    height: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    &.select-list {
      min-width: 230px;
    }
    .el-table tr {
      cursor: pointer;
      .h-18 {
        height: 18px;
        line-height: 18px;
      }
    }
    .cover-count {
      height: 42px;
      line-height: 42px;
      text-align: center;
      border: none;
      color: #7e8c8d;
      font-size: 14px;
      .count {
        color: #606266;
        margin: 0 5px;
      }
    }
  }
  .btn-box {
    width: 62px;
    position: relative;
    .icon-container {
      height: 120px;
      position: absolute;
      top: 50%;
      margin-top: -60px;
      width: 100%;
      padding: 13px;
      box-sizing: border-box;
      .transfer-icon {
        color: #fff;
        // font-size: 20px;
        margin-left: 0;
        margin-right: 0;
      }
    }
    .el-button.is-disabled {
      color: #dcdfe6;
    }
  }
  .selected-list {
    width: 356px;
    height: 100%;
  }
}
</style>

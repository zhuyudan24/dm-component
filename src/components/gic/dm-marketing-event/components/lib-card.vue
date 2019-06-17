<template>
  <el-dialog title="选择卡券" :visible.sync="show" width="800px" :before-close="close">
    <div class="clearfix pb22">
      <div class="fl">
        <el-input v-model="listParams.searchParam" class="w200" clearable placeholder="请输入卡券名/备注名" @change="refresh"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
        <span class="fz12 gray">{{ limitTips }}{{ total }}张。 </span>
      </div>
      <div class="fr">
        <el-button type="primary" @click="add">新建卡券</el-button>
        <el-button @click="refresh">刷新列表</el-button>
      </div>
    </div>
    <el-table tooltipEffect="light" :data="tableList" row-class-name="cursor-pointer" style="width: 100%" v-loading="loading" @row-click="rowClick">
      <el-table-column :show-overflow-tooltip="false" width="60" align="center" prop="coupCardId">
        <template slot-scope="scope">
          <div class="sms-record_left label-hidden">
            <el-radio v-model="selectedData" :label="scope.row" class="pr10"></el-radio>
          </div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" :min-width="100" align="left" prop="cardName" label="卡券名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" :min-width="100" align="left" prop="subName" label="备注名"></el-table-column>
      <el-table-column prop="" label="有效期" :min-width="100" :show-overflow-tooltip="false">
        <template slot-scope="scope">
          <div v-if="scope.row.cardEffectiveMode == 0">固定日期：{{ formateDateTimeByType(scope.row.beginDate, 'yyyy-MM-dd') + '至' + formateDateTimeByType(scope.row.endDate, 'yyyy-MM-dd') }}</div>
          <div v-if="scope.row.cardEffectiveMode == 1">领取后{{ (scope.row.startDay === 0 ? '当' : scope.row.startDay) + '天，有效天数' + scope.row.limitDay }}天</div>
        </template>
      </el-table-column>
      <el-table-column prop="cardLimit" :show-overflow-tooltip="false" label="领取限制" width="90">
        <template slot-scope="scope">
          {{ scope.row.cardLimit }}张/人
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="false" :width="90" align="left" prop="storeMode" label="适用门店">
        <template slot-scope="scope">
          {{ scope.row.storeMode === 0 ? '所有门店' : scope.row.storeMode === 1 ? '部分分组' : '部分门店' }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="false" :width="100" align="left" prop="couponStock" label="库存"></el-table-column>
    </el-table>
    <el-pagination v-show="tableList.length" class="dm-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listParams.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="listParams.pageSize" layout="prev, pager, next" :total="total"></el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">关 闭</el-button>
      <el-button type="primary" @click="addItem">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCardList } from '../assets/api.js';
import { formateDateTimeByType } from '../assets/utils.js';
export default {
  name: 'lib-card',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    cardLimitType: {
      type: Number,
      default: 1
    }
  },
  computed: {
    limitTips() {
      if (this.cardLimitType === 2) {
        return '领取限制领取1~100的卡券，系统已过滤，符合条件共';
      } else if (this.cardLimitType === 3) {
        return '领取限制领取<100的卡券不支持选择，系统已过滤，符合条件共';
      } else {
        return '领取限制>1的卡券不支持选择，系统已过滤，符合条件共';
      }
    }
  },
  data() {
    return {
      formateDateTimeByType,
      listParams: {
        searchParam: '',
        currentPage: 1,
        pageSize: 5,
        requestProject: 'gic-web',
        cardLimitType: this.cardLimitType,
        cardType: ''
      },
      total: 0,
      tableList: [],
      selectedData: {}
    };
  },
  created() {
    this.getCardList();
  },
  methods: {
    handleSizeChange(val) {
      this.listParams.pageSize = val;
      this.getCardList();
    },
    handleCurrentChange(val) {
      this.listParams.currentPage = val;
      this.getCardList();
    },
    getCardList() {
      this.loading = true;
      getCardList(this.listParams).then(res => {
        if (res.errorCode === 0) {
          this.tableList = res.result.result || [];
          this.total = res.result.totalCount;
        }
        this.loading = false;
      });
    },
    reset() {
      this.listParams.searchParams = '';
      this.getCardList();
    },
    close() {
      this.$emit('update:show', false);
    },
    rowClick(row) {
      row.comName = 'card';
      this.selectedData = row;
    },
    addItem() {
      if (!this.selectedData.comName) {
        this.$message({ type: 'warning', message: '未选择卡券' });
        return;
      }
      this.$emit('sendItem', this.selectedData);
      this.close();
    },
    add() {
      window.open('/marketing/#/card/add');
    },
    refresh() {
      this.listParams.currentPage = 1;
      this.getCardList();
    }
  }
};
</script>

<template>
  <!-- 部分商品 -->
  <div class="some-goods">
    <div class="check-title">
      <el-input style="width: 200px; margin-right: 10px;" v-model="allGood" prefix-icon="el-icon-search" placeholder="输入商品名称/货号" clearable @keyup.native.enter="keyWordSearch" @input="handleChange"> </el-input>

      <el-checkbox v-model="skuCheck" @change="handleSwitchSku">以SKU筛选</el-checkbox>
      <el-input style="width: 200px; float: right" v-model="chooseGood" prefix-icon="el-icon-search" clearable @keyup.native.enter="filterRightGoods" placeholder="输入商品名称/货号"> </el-input>
    </div>

    <div class="sku-content">
      <!-- 如果是sku筛选 skuCheck true 就有具体sku的列表 否则有勾选筛选 skuCheck false -->
      <div class="sku-table-before">
        <sku-filter-table :data="tableData" :skufilter="skuCheck" @resiverSku="resiverSku" @change-box="changeCheckbox" v-loading="loading"> </sku-filter-table>
        <span class="load-more" @click="loadMoreGoods">加载更多</span>
      </div>

      <div class="sku-btn">
        <el-button type="primary" @click.native="addGoodsToLeft" :disabled="!goodsCheched.length" v-if="!skuCheck" class="el-transfer__button">
          <i class="el-icon-arrow-right"></i>
        </el-button>

        <el-button type="primary" @click.native="addSkuToLeft" :disabled="!skuCheched.length" v-if="skuCheck" class="el-transfer__button">
          <i class="el-icon-arrow-right"></i>
        </el-button>
      </div>

      <!-- 筛选之后的表格 -->
      <div class="sku-table-filter">
        <div class="title">
          <el-checkbox v-model="filterBox" :indeterminate="isIndeterminate" @change="handleCheckAllChange"> </el-checkbox>
          &nbsp;&nbsp;商品信息

          <el-button type="text" class="button-txt" @click="deleteGoods">删除</el-button>
        </div>
        <ul class="right-box">
          <!-- skuCheck是跨级给右边控制是sku的 -->
          <sku-item v-for="(sku, i) in targetData" :key="i" :sku-list="sku" @pass-check="passCheck" :pop-show="skuCheck" :check.sync="sku.check"></sku-item>
        </ul>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import Emitter from './assist/emitter';
import TableCheckbox from './table-checkbox';
import SkuFilterTable from './sku-filter-table';
import SkuItem from './sku-item';
import { baseUrl } from '@/config/index.js';
import { log } from '@/utils/index.js';
export default {
  name: 'goods-some',

  components: {
    TableCheckbox,
    SkuFilterTable,
    SkuItem
  },

  mixins: [Emitter],

  props: {
    goodsIndex: Array
  },

  data() {
    return {
      loading: false,
      filterBox: false,
      isIndeterminate: false,
      skuCheck: false, // 是否以SKU筛选
      chooseGood: '', // 已经选择的商品和sku
      allGood: '', // 所有商品筛选
      tableData: [], // 左边的商品数据
      filterData: [], // 过滤之后的数据
      skuCheched: [], // sku集合
      goodsCheched: [] // 商品集合
    };
  },

  computed: {
    targetData() {
      return this.filterData.filter(item => item.goodsName.indexOf(this.chooseGood) !== -1);
    }
  },

  methods: {
    handleChange(val) {
      log(val);
    },
    // 把左边选中的商品添加到右边
    addGoodsToLeft() {
      const middle = this.tableData.filter(el => el.check);
      const middleData = JSON.parse(JSON.stringify(middle));
      this.filterData = middleData.map(ele => {
        ele.check = false;
        return ele;
      });
    },
    // 把左边的筛选的sku移到右边
    addSkuToLeft() {
      this.filterData = this.skuCheched.filter(el => el.hasSku);
    },

    handleCheckAllChange(val) {
      // 全选
      this.filterData = this.filterData.map(el => ({
        ...el,
        check: val
      }));
      this.isIndeterminate = false;
    },
    passCheck() {
      this.rightChecked = this.filterData.filter(ele => ele.check);
      this.filterBox = this.rightChecked.length === this.filterData.length;
      this.isIndeterminate = this.rightChecked.length > 0 && this.rightChecked.length < this.filterData.length;
    },
    // 接收skus
    resiverSku(list) {
      if (list) {
        this.tableData = JSON.parse(JSON.stringify(list));
        this.goodsCheched = this.tableData && this.tableData.filter(el => el.check);
      } else {
        if (!this.skuCheck) {
          this.goodsCheched = this.tableData.filter(el => el.check);
        } else {
          // sku
          this.skuCheched = JSON.parse(JSON.stringify(this.tableData));
          this.skuCheched = this.skuCheched.map(el => {
            // 每次勾选sku 其实我们要筛选的是勾选了sku的good商品 所以可以在goods里面增加一个标识
            el.skus = el.skus && el.skus.filter(sku => sku.check);
            if (el.skus && el.skus.length) {
              el.hasSku = true;
            }
            return el;
          });
        }
      }
    },
    // sku筛选切换 缓存一下之前的数据
    handleSwitchSku(val) {
      this.skuCheched.length = 0;
      if (val) {
        // 如果是真 就缓存商品信息
        this.cacheGoodList = JSON.parse(JSON.stringify(this.filterData));

        this.filterData.length = 0;
        if (this.cacheSkuList.length) {
          this.filterData = JSON.parse(JSON.stringify(this.cacheSkuList));
          this.filterData = this.filterData.map(el => {
            el.check = false;
            return el;
          });
        }
      } else {
        // 缓存商品信息和sku信息
        this.cacheSkuList = JSON.parse(JSON.stringify(this.filterData));
        this.filterData.length = 0;
        if (this.cacheGoodList.length) {
          this.filterData = JSON.parse(JSON.stringify(this.cacheGoodList));
        }
      }
    },
    // 获取商品列表
    getGoodsList(cfg = {}) {
      const param = {
        keyWord: this.allGood,
        regionName: cfg.regionName || '', // 价格区间:PRICE，库存区间:STOCK
        lowerLimit: cfg.lowerLimit || null,
        upperLimit: cfg.upperLimit || null,
        currentPage: this.currentPage || 1,
        pageSize: 20
      };
      this.axios
        .get(`${baseUrl}/api-goods/list-store-goods-select`, {
          params: param
        })
        .then(res => {
          if (res.data.errorCode === 0) {
            const data = res.data.result;
            if (data.result && data.result.length) {
              const middleList = data.result.map(el => ({
                ...el,
                skus: []
              }));
              this.tableData = this.tableData.concat(middleList);
              setTimeout(_ => {
                this.loading = false;
              }, 500);
            } else {
              this.tableData = [];
            }
          }
        })
        .catch(err => {
          log(err);
        });
    },
    // 商品信息全选传递选中的值
    changeCheckbox(lists) {
      log(lists);
    },
    loadMoreGoods() {
      this.currentPage++;
      this.loading = true;
      this.getGoodsList({ loadMore: true });
    },
    // 关键字搜索
    keyWordSearch() {
      this.currentPage = 1;
      this.tableData.length = 0;
      this.getGoodsList();
    },

    // 左边删除勾选的商品
    deleteGoods() {
      // 没有商品
      if (!this.filterData.length) {
        this.$message.warning('没有可以删除的商品！');
        return;
      }
      // 先勾选
      if (!this.rightChecked.length) {
        this.$message.warning('请先勾选商品！');
        return;
      }
      this.filterData = this.filterData.filter(el => !el.check);
      this.filterBox = false;
    },
    // 过滤右边的
    filterRightGoods() {
      // log(this.);
      this.filterData = this.filterData.filter(el => el.goodsName.includes(this.chooseGood));
    }
  },

  watch: {
    allGood(newval) {
      if (newval === '') {
        this.getGoodsList();
      }
    },
    filterData(newval) {
      this.dispatch('vue-gic-selector', 'pass-goodslist', {
        index: this.goodsIndex,
        items: newval
      });
    },
    chooseGood() {
      // 占位
    }
  },

  beforeMount() {
    this.currentPage = 1;
    // 右边勾选之后的商品列表
    this.rightChecked = [];
    this.getGoodsList();
  },

  mounted() {
    // 用来保存从左边移过去的数据的id
    this.cacheSkuList = [];
    this.cacheGoodList = [];
  }
};
</script>

<style lang="scss" scoped>
.some-goods {
  .check-title {
    height: 48px;
    line-height: 48px;
    padding: 0 20px;
    background-color: #ebeef5;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    .choose-good {
      float: right;
    }
  }
  .sku-content {
    padding: 10px 19px;
    height: 350px;
    font-size: 0px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    overflow: hidden;
    .sku-table-before {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      width: 350px;
      height: 350px;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      box-sizing: border-box;
      .load-more {
        position: absolute;
        bottom: 0;
        right: 6px;
        left: 1px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        color: #1890ff;
        background-color: hsla(0, 0%, 100%, 0.9);
      }
    }
    .sku-btn {
      display: inline-block;
      vertical-align: middle;
      width: 60px;
      text-align: center;
      .transfer-btn {
        border-radius: 50%;
      }
    }
  }
  .sku-table-filter {
    display: inline-block;
    vertical-align: middle;
    width: 178px;
    height: 350px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    border-radius: 5px;
    font-size: 12px;
    .title {
      height: 20px;
      padding: 12px;
      font-size: 14px;
      background-color: #f5f7fa;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      color: #9d9fa5;
    }
  }
  .button-txt {
    float: right;
    line-height: 20px;
    color: #a4a7aa;
    &:hover {
      color: #1890ff;
    }
  }
  .right-box {
    height: 303px;
    overflow: auto;
    list-style: none;
  }
}
</style>

<template>
  <div class="sku-filter">
    <div class="title">
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange" v-if="!skuFlt"></el-checkbox>
      <span class="arrow-bottom" v-if="skuFlt"></span>
      <span class="good-info">
        商品信息
      </span>
      <el-popover placement="bottom" width="280" trigger="click" v-model="showPopPrice">
        <el-input placeholder="最低单价" :minlength="1" :maxlength="6" style="width: 90px;" v-model="lowPrice"></el-input>
        —
        <el-input placeholder="最高单价" :minlength="1" :maxlength="6" style="width: 90px;" v-model="mostPrice"></el-input>
        &nbsp;
        <el-button type="primary" @click="searchGoods">搜索</el-button>
        <span class="price" :class="{ 'showpop-price': showPopPrice }" slot="reference" @click="showPopPrice = !showPopPrice">
          单价
          <i class="icon iconfont icon-shaixuan-shi icon-filter"></i>
        </span>
      </el-popover>
      <el-popover placement="bottom" width="280" trigger="click" v-model="showPopNum">
        <el-input placeholder="最低数量" :minlength="1" :maxlength="6" style="width: 90px;" v-model="lowStore"></el-input>
        —
        <el-input placeholder="最高数量" :minlength="1" :maxlength="6" style="width: 90px;" v-model="mostStore"></el-input>
        &nbsp;
        <el-button type="primary" @click="storeSearch">搜索</el-button>
        <span class="price store" :class="{ 'showpop-num': showPopNum }" slot="reference" @click="showPopNum = !showPopNum">
          库存
          <i class="icon iconfont icon-shaixuan-shi icon-filter"></i>
        </span>
      </el-popover>
    </div>

    <ul class="goods-sku-lists">
      <sku-left-item v-for="(item, i) in items" :key="i" :goods="item" :inx="i" :check="skuFlt" :checkbox.sync="item.check" @changeIndeterminate="handleIndeter"></sku-left-item>
      <span class="el-table__empty-text no-data" v-if="!items || !items.length">暂无数据</span>
    </ul>
  </div>
</template>

<script>
import SkuLeftItem from './sku-left-item';
import { throttle } from './assist/util';
import { log } from '@/utils/index.js';
// 正则
const INTEGER_REG = /^[1-9]{1}[0-9]{0,5}$/; // 最小1 最大999999 的整数

export default {
  name: 'SkuFilterTable',

  components: {
    SkuLeftItem
  },

  props: {
    data: Array,
    skufilter: Boolean // sku筛选
  },

  data() {
    return {
      skuFlt: null,
      checkAll: false,
      visiable: false,
      items: [],
      mostPrice: null,
      lowPrice: null,
      lowStore: null,
      mostStore: null,
      showPopPrice: false,
      showPopNum: false,
      isIndeterminate: false,
      checkedGoods: [] // 选中的商品
    };
  },

  methods: {
    // 处理最低的库存
    handleLowStore() {
      // 占位
    },
    // 处理最高的库存
    handleMostStore() {
      // 占位
    },
    // item 是勾选的sku信息
    resiverSku() {
      this.$emit('resiverSku');
    },
    // 单价搜索
    searchGoods() {
      // 占位
    },
    // 库存搜索
    storeSearch() {
      // 占位
    },
    handleCheckAllChange(val) {
      this.items = this.items.map(el => ({
        ...el,
        check: val
      }));
      this.isIndeterminate = false;
      this.$emit('resiverSku', this.items);
    },
    // 修改checkbox的状态
    handleIndeter() {
      log(this.items);
      this.checkedGoods = this.items.filter(el => el.check);
      this.checkAll = this.checkedGoods.length === this.items.length;
      this.isIndeterminate = this.checkedGoods.length > 0 && this.checkedGoods.length < this.items.length;
    },
    // 正则限制输入价格和库存
    regInput(val) {
      if (!INTEGER_REG.test(val)) {
        this.$message.warning('单价必须大于0!');
      }
    }
  },

  mounted() {
    this.$on('passku', this.resiverSku);
    // 低价
    this.$watch(
      'lowPrice',
      throttle(newval => {
        this.regInput(newval);
      }, 500)
    );
    // 高级
    this.$watch(
      'mostPrice',
      throttle(newval => {
        this.regInput(newval);
      }, 500)
    );
  },

  watch: {
    skufilter: {
      immediate: true,
      handler(newval) {
        this.skuFlt = newval;
      }
    },
    data: {
      immediate: true,
      handler(newval) {
        this.items = newval;
      }
    },
    checkedGoods: {
      immediate: true,
      handler(newval) {
        this.$emit('resiverSku');
      }
    }
  }
};
</script>

<style lang="less" scoped>
.sku-filter {
  height: 350px;
  padding-bottom: 20px;
  .title {
    height: 44px;
    line-height: 44px;
    padding: 0 10px;
    font-size: 14px;
    background-color: #f5f7fa;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    color: #909399;
    .arrow-bottom {
      display: inline-block;
      vertical-align: middle;
      width: 14px;
    }
    span {
      display: inline-block;
      text-align: center;
      height: 44px;
    }
    .good-info {
      width: 160px;
      text-align: left;
      padding-left: 10px;
    }
    .price {
      position: relative;
      width: 60px;
      outline: none;
      border: none;
      .icon-filter::before {
        top: 10px;
      }
    }
    .store {
      position: relative;
      width: 60px;
    }
    .showpop-price,
    .showpop-num {
      background-color: #e3e5eb;
    }
  }
  .goods-sku-lists {
    height: 303px;
    overflow: auto;
    list-style: none;
    .no-data {
      display: inline-block;
      width: 100%;
      text-align: center;
      font-size: 14px;
    }
  }
}
</style>

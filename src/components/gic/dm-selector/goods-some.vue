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
        <sku-filter-table :data="tableData" @scrollload="scrollload" :skufilter="skuCheck" @resiverAllSku="resiverAllSku" @resiverSku="resiverSku" @change-box="changeCheckbox" @search-store="searchList" v-loading="loading"></sku-filter-table>
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
          <sku-item v-for="(sku, i) in rightData" :key="i" :sku-list="sku" @pass-check="passCheck" :pop-show="skuCheck" :check.sync="sku.check"></sku-item>
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

export default {
  name: 'goods-some',

  components: {
    TableCheckbox,
    SkuFilterTable,
    SkuItem
  },

  mixins: [Emitter],

  props: {
    goodsIndex: Array,
    listReback: [Array, Object]
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
      goodsCheched: [], // 商品集合
      filterRightData: [], // 右边搜索缓存
      rightData: [] // 右边的
    };
  },

  // computed: {
  //   targetData() {
  //     if (this.filterData.length) {
  //       return this.filterData.filter(item => item.goodsName.indexOf(this.chooseGood) !== -1);
  //     } else {
  //       return [];
  //     }
  //   }
  // },

  methods: {
    searchList(item) {
      this.getGoodsList({
        regionName: item.regionName,
        lowerLimit: Number(item.lowerLimit),
        upperLimit: Number(item.upperLimit)
      });
    },
    handleChange(val) {
      console.log(val);
    },
    // 把左边选中的商品添加到右边
    addGoodsToLeft() {
      const middle = this.tableData.filter(el => el.check);
      const middleData = JSON.parse(JSON.stringify(middle));
      this.rightData = middleData.map(ele => {
        ele.check = false;
        return ele;
      });
      // this.rightData = JSON.parse(JSON.stringify(this.filterData));
    },
    // 把左边的筛选的sku移到右边
    addSkuToLeft() {
      this.filterData = this.skuCheched.filter(el => el.hasSku);
      this.filterData = this.filterData.map(el => ({
        ...el,
        check: false
      }));
      this.filterBox = false;
      this.rightData = JSON.parse(JSON.stringify(this.filterData));
    },
    handleCheckAllChange(val) {
      // 全选
      this.rightData = this.rightData.map(el => ({
        ...el,
        check: val
      }));

      this.rightChecked = JSON.parse(JSON.stringify(this.rightData));
      // this.rightData = JSON.parse(JSON.stringify(this.filterData));
      this.isIndeterminate = false;
    },
    // 商品单个选择传出的
    passCheck() {
      this.rightChecked = this.rightData.filter(ele => ele.check);
      this.filterBox = this.rightChecked.length === this.rightData.length;
      this.isIndeterminate = this.rightChecked.length > 0 && this.rightChecked.length < this.rightData.length;
    },
    // 接收 单个 skus
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

    // resiverAllSku 全选sku选择的时候 传出来
    resiverAllSku(skuItem) {
      this.tableData = this.tableData.map((el, i) => {
        if (skuItem.inx == i) {
          el.skus = skuItem.skus && skuItem.skus.filter(sku => sku.check);
          if (el.skus && el.skus.length) {
            el.hasSku = true;
          }
        }
        return el;
      });
      this.skuCheched = JSON.parse(JSON.stringify(this.tableData));
      // this.tableData = JSON.stringify(JSON.stringify(this.skuCheched));
      // console.log(this.skuCheched);
    },
    // sku筛选切换 缓存一下之前的数据
    handleSwitchSku(val) {
      this.skuCheched.length = 0;
      if (val) {
        // 如果是真 就缓存商品信息
        this.cacheGoodList = JSON.parse(JSON.stringify(this.rightData));
        if (this.cacheSkuList.length) {
          this.rightData = JSON.parse(JSON.stringify(this.cacheSkuList));
          this.rightData = this.rightData.map(el => {
            el.check = false;
            return el;
          });
        }
        if (this.cacheSkuList.length) {
          this.rightData = JSON.parse(JSON.stringify(this.cacheSkuList));
        } else {
          this.rightData.length = 0;
        }
      } else {
        // 缓存商品信息和sku信息
        this.cacheSkuList = JSON.parse(JSON.stringify(this.rightData));
        if (this.cacheGoodList.length) {
          this.rightData = JSON.parse(JSON.stringify(this.cacheGoodList));
        } else {
          this.rightData.length = 0;
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
        .get(`${baseUrl}/api-goods/list-store-goods-select?requestProject=goods`, {
          params: param
        })
        .then(res => {
          if (res.data.errorCode === 0) {
            let data = res.data.result;
            if (data.result && data.result.length) {
              const middleList = data.result.map(el => ({
                ...el,
                skus: []
              }));
              this.tableData = JSON.parse(JSON.stringify(middleList));
              // 回显
              if (this.listReback.ids && this.listReback.ids.length) {
                this.listReback.ids.forEach(el => {
                  let i = middleList.findIndex(item => item.goodsId == el.goodsId);
                  if (i > -1) {
                    this.rightData.push(el);
                  }
                });
                // 是否有sku
                if (this.rightData && this.rightData.length) {
                  // 如果是SKU
                  if (this.rightData[0].hasSku) {
                    this.skuCheck = true;
                  }
                }
              }
              setTimeout(_ => {
                this.loading = false;
              }, 500);
            } else {
              this.tableData = [];
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    scrollload(cfg = {}) {
      this.currentPage++;
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
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 商品信息全选传递选中的值
    changeCheckbox(lists) {
      console.log(lists);
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
      this.skuCheck = false;
      this.getGoodsList();
    },

    // 左边删除勾选的商品
    deleteGoods() {
      // 没有商品 filterData 是左边移过来的商品
      if (!this.rightData.length) {
        this.$message.warning('没有可以删除的商品！');
        return;
      }
      // 先勾选
      if (!this.rightChecked.length) {
        this.$message.warning('请先勾选商品！');
        return;
      }
      let middle = JSON.parse(JSON.stringify(this.tableData));
      let filterList = JSON.parse(JSON.stringify(this.filterData));

      this.rightData = this.rightData.filter((el, i) => {
        if (el.check) {
          let index = this.filterRightData.findIndex(item => item.goodsId == el.goodsId);
          if (index > -1) {
            this.filterRightData.splice(index, 1);
          }
          // 没删除一个左边对应的状态也要修改sku的值 否则无法保持一致
          // 如果找到之后就把sku给重置
          let resetIndex = middle.findIndex(ele => ele.goodsId == el.goodsId);
          // 重置左边的sku
          middle[resetIndex].skus = middle[resetIndex].skus.map(sku => ({
            ...sku,
            check: false
          }));

          let filterIndex = filterList.findIndex(fl => fl.goodsId == el.goodsId);

          if (filterIndex > -1) {
            filterList[filterIndex].skus = filterList[filterIndex].skus.map(sku => ({
              ...sku,
              check: false,
              hasSku: false
            }));
          }
          return false;
        }
        return true;
      });

      this.tableData = JSON.parse(JSON.stringify(middle));
      this.skuCheched = this.tableData.filter(el => el.hasSku);
      this.filterData = JSON.parse(JSON.stringify(filterList));
      this.filterBox = false;
      this.rightChecked = [];
      this.isIndeterminate = false;
    },
    // 过滤右边的
    filterRightGoods() {
      if (!this.filterRightData.length) {
        this.filterRightData = JSON.parse(JSON.stringify(this.rightData));
      }
      this.rightData = this.filterRightData.filter(el => el.goodsName.indexOf(this.chooseGood) > -1 || el.goodsCode.indexOf(this.chooseGood) > -1);
    },
    reciverSkusList(list) {
      this.tableData[list.inx].skus = list.skus;
      let middleData = JSON.parse(JSON.stringify(this.tableData));
      /* eslint-disable */
      middleData = middleData.map(el => {
        el.skus = el.skus && el.skus.filter(sku => sku.check);
        if (el.skus && el.skus.length) {
          el.hasSku = true;
        }
        return el;
      })
        .filter(item => item.hasSku);
      this.skuCheched = JSON.parse(JSON.stringify(middleData));
    },
    changeSkuData(data) {
      data = data.map((el, i) => {
        if (el.skus && el.skus.length) {
          let checkAll = el.skus.every(sku => sku.check);
          if (!checkAll) {
            el.hasSku = false
          }
        }
        return el;
      })
        .filter(item => item.hasSku);
      this.skuCheched = JSON.parse(JSON.stringify(data));
    }
  },

  watch: {
    allGood(newval) {
      if (newval === '') {
        this.getGoodsList();
      }
    },
    rightData(newval) {
      this.dispatch('vue-gic-goods-selector', 'pass-goodslist', {
        index: this.goodsIndex,
        items: newval
      });
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
    this.$on('pass-sku', this.reciverSkusList);
    this.$on('changeSkuData', this.changeSkuData);
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
    height: 360px;
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
    width: 190px;
    height: 350px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    border-radius: 5px;
    font-size: 12px;
    .title {
      height: 20px;
      font-size: 14px;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-right: 10px;
      background-color: #f5f7fa;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      color: #9d9fa5;
      box-sizing: content-box;
    }
  }
  .button-txt {
    float: right;
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

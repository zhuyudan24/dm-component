<template>
  <div class="gic-goods-selector">
    <div class="good-container" v-for="(condition, index) in conditions" :key="index">
      <!-- 商品条件 -->
      <el-collapse-transition>
        <div class="goods-condition" v-show="condition.expendStatus == '收起'">
          <goods-item class="goods-box" :type="list.type" v-for="(list, i) in condition.goodsList" :key="i + 1" :tags="list.tags" :goods-brands="list.brands" :goods-index="[index, i]">
            <goods-collection :disabled="condition.goodsList.length == i + 1" :length="condition.goodsList.length" :condition="list.condition" :good-index="[index, i]"> </goods-collection>
          </goods-item>
        </div>
      </el-collapse-transition>
      <ul class="goods-lists">
        <li class="good-type" :class="[condition.goodsList.length == 5 ? 'good-forbid' : '']" v-for="(good, inx) in condition.goods" :key="inx + 1" @click="addGoodsCondition(good, index)">
          <i class="el-icon-plus"></i>
          {{ good.label }}
        </li>
      </ul>

      <div class="goods-tips">
        <el-button type="text" @click="expendList(index)" v-if="condition.goodsList.length != 0">{{ condition.expendStatus }}</el-button>
        <el-button type="text" v-else></el-button>
        <div class="tip-txt">
          还可插入 <span class="tip-count"> {{ 5 - condition.goodsList.length }} </span> 个条件
          <el-button type="text" v-if="index > 0" @click="removeCondition(index)">删除</el-button>
        </div>
      </div>

      <p class="goods-chain" v-if="conditions[index + 1]">
        { 并且 }
      </p>
    </div>
  </div>
</template>

<script>
import ElCollapseTransition from './collapse-transition';
import GoodsItem from './goods-item'; // 商品项
import GoodsCollection from './goods-collection'; // 商品集合条件

// 循环的key
let key = 1;
// let goodId = 2001;

// 商品选择器单个最多5个 三个并且的条件
const singleCount = 5;
// const allCount = 3;

const goodsType = [{ type: 'brand', label: '商品品牌' }, { type: 'ategory', label: '商品品类' }, { type: 'specifications', label: '商品规格' }, { type: 'properties', label: '商品属性' }, { type: 'some', label: '部分商品' }];

const Type = ['brand', 'ategory', 'specifications', 'properties', 'some'];

const filterList = {
  ids: [],
  type: '', // 品牌类型 brand category standard property goods sku
  operate: null // 并且 或者 删除
};

export default {
  name: 'vue-gic-selector',

  components: {
    GoodsItem,
    GoodsCollection,
    ElCollapseTransition
  },

  props: {
    projectName: String
  },

  data() {
    return {
      // 商品选择器的条件集合
      conditions: [
        {
          expendStatus: '',
          goods: [{ type: 'brand', label: '商品品牌' }, { type: 'ategory', label: '商品品类' }, { type: 'specifications', label: '商品规格' }, { type: 'properties', label: '商品属性' }, { type: 'some', label: '部分商品' }],
          // 具体的商品选择器
          goodsList: []
        }
      ]
    };
  },

  methods: {
    loadMore() {
      this.getSelectData();
    },
    getSelectData() {
      // 占位
      this.syo = 'lisi';
    },
    // 添加查询条件
    addGoodsCondition(item, index) {
      // 不能超过五个
      if (this.conditions[index].goodsList.length === singleCount) {
        return;
      }
      this.handleGoodsType(item, index);
      this.conditions[index].expendStatus = this.conditions[index].goodsList.length ? '收起' : '';
    },

    // 删除筛选条件
    deleteGooditem(arr) {
      this.conditions[arr[0]].goodsList.splice(arr[1], 1);
      if (this.conditions.length > 1) {
        if (!this.conditions[arr[0]].goodsList.length) {
          this.conditions.splice(arr[0], 1);
        }
      }
    },

    // 展开
    expendList(i) {
      this.conditions[i].expendStatus = this.conditions[i].expendStatus == '展开' ? '收起' : '展开';
    },

    // 添加标签
    addAtegory(tags) {
      let index = tags.index;
      this.conditions[index[0]].goodsList[index[1]].tags.push(tags);
    },

    // 分类处理 品牌
    /**
     * type 类型
     * i 具体索引
     * u 是向前还是后因为有向前插入和向后插入
     */
    addBrandList(type, i, u) {
      if (u) {
        this.conditions[i].goodsList.unshift({
          type: type,
          collection: this.conditions[i].goodsList.length < singleCount - 1 ? true : false,
          condition: 0, // 并且剔除条件
          brands: []
        });
        return;
      }
      this.conditions[i].goodsList.push({
        type: type,
        collection: this.conditions[i].goodsList.length < singleCount - 1 ? true : false,
        condition: 0, // 并且剔除条件
        brands: []
      });
    },
    // 添加品类
    addAtegoryList(type, i, u) {
      if (u) {
        this.conditions[i].goodsList.push({
          type: type,
          collection: this.conditions[i].goodsList.length < singleCount - 1 ? true : false,
          condition: 0,
          tags: []
        });
        return;
      }
      this.conditions[i].goodsList.push({
        type: type,
        collection: this.conditions[i].goodsList.length < singleCount - 1 ? true : false,
        condition: 0,
        tags: []
      });
    },
    // 其他三种类型
    addOtherList(type, i, u) {
      if (u) {
        this.conditions[i].goodsList.unshift({
          type: type,
          collection: this.conditions[i].goodsList.length < singleCount - 1 ? true : false,
          condition: 0,
          ids: []
        });
        return;
      }
      this.conditions[i].goodsList.push({
        type: type,
        collection: this.conditions[i].goodsList.length < singleCount - 1 ? true : false,
        condition: 0,
        ids: []
      });
    },
    // 单独处理
    handleGoodsType(item, i) {
      // 添加商品选择条件 每个不同的条件都有不同的类型和字段
      const type = item.type;

      if (type === 'brand') {
        this.addBrandList(type, i);
      } else if (type === 'ategory') {
        // 如果是品类 ategory
        this.addAtegoryList(type, i);
      } else if (type === 'specifications') {
        // 商品规格
        this.addOtherList(type, i);
      } else if (type === 'some') {
        // 部分商品SKU
        this.addOtherList(type, i);
      } else if (type === 'properties') {
        // 商品属性
        this.addOtherList(type, i);
      }
      if (this.conditions.length == 3) {
        return;
      }
      this.conditions.push({
        goods: JSON.parse(JSON.stringify(goodsType)),
        goodsList: []
      });
    },
    // 接收传过来的并存的条件
    receiveRadio(radio) {
      let index = radio.index;
      this.conditions[index[0]].goodsList[index[1]].condition = radio.val;
    },
    // 删除外层的大条件
    removeCondition(i) {
      this.conditions.splice(i, 1);
    },
    // pass-checkbox 传递
    receiveCheckbox(check) {
      let index = check.index;
      this.conditions[index[0]].goodsList[index[1]].brands = check.items;
    },
    // 上方插入 1 2 3 4 5
    insertUselector(item) {
      const type = Type[item.type - 1];
      if (this.conditions[item.index[0]].goodsList.length > 4) {
        this.$message.warning('最多添加五个条件！');
        return;
      }
      if (type === 'brand') {
        this.addBrandList(type, item.index[0], 'u');
      } else if (type === 'ategory') {
        // 如果是品类 ategory
        this.addAtegoryList(type, item.index[0], 'u');
      } else {
        this.addOtherList(type, item.index[0], 'u');
      }
    },

    insertDselector(item) {
      const type = Type[item.type - 1];
      if (this.conditions[item.index[0]].goodsList.length > 4) {
        this.$message.warning('最多添加五个条件！');
        return;
      }

      if (type === 'brand') {
        this.addBrandList(type, item.index[0]);
      } else if (type === 'ategory') {
        // 如果是品类 ategory
        this.addAtegoryList(type, item.index[0]);
      } else {
        this.addOtherList(type, item.index[0]);
      }
    },
    getKey() {
      return key++;
    },
    // 提交取最后的筛选条件
    collectConditions() {
      let ret = [];
      this.conditions.forEach(el => {
        let cond = [];
        if (el.goodsList && el.goodsList.length) {
          el.goodsList.forEach(item => {
            const list = JSON.parse(JSON.stringify(filterList));
            list.operate = item.condition == 0 ? 'intersect' : item.condition == 1 ? 'union' : 'diff'; // 条件
            if (item.type === 'ategory') {
              item.tags.forEach(li => {
                list.ids.push(li.categoryId);
              });
              list.type = 'category';
            } else if (item.type === 'brand') {
              item.brands.forEach(li => {
                list.ids.push(li.brandId);
              });
              list.type = 'brand';
            } else if (item.type === 'specifications') {
              item.ids.forEach(el => {
                list.ids.push(el.gicStandardId);
              });
              list.type = 'standard';
            } else if (item.type === 'properties') {
              list.type = 'property';
            } else if (item.type === 'some') {
              // 如果是sku 我会主动添加一个sku标识属性
              if (item.ids[0].hasSku) {
                item.ids.forEach(el => {
                  list.ids.push(el.goodsId);
                });
                list.type = 'sku';
              } else {
                item.ids.forEach(el => {
                  list.ids.push(el.goodsId);
                });
                list.type = 'goods';
              }
            }
            cond.push(list);
          });
        }
        ret.push(cond);
      });
      // 如果没有筛选条件 就去掉
      return ret.filter(item => item.length);
      // return new Promise((resolve, reject) => {
      //   if (ret.length) {
      //     resolve(ret);
      //   } else {
      //     reject('没有筛选出数据');
      //   }
      // });
    },
    // 接收
    passSpes(spes) {
      const index = spes.index;
      this.conditions[index[0]].goodsList[index[1]].ids = spes.items;
    },
    // 部分商品信息
    passGoodslist(lists) {
      const index = lists.index;
      this.conditions[index[0]].goodsList[index[1]].ids = lists.items;
    }
  },

  mounted() {
    // 删除小筛选条件
    this.$on('delete-gooditem', this.deleteGooditem);
    this.$on('pass-radioGroup', this.receiveRadio);
    this.$on('pass-checkbox', this.receiveCheckbox);
    this.$on('handle-ategory', this.addAtegory);
    this.$on('insert-uselector', this.insertUselector);
    this.$on('insert-dselector', this.insertDselector);
    this.$on('pass-spes', this.passSpes);
    this.$on('pass-goodslist', this.passGoodslist);
  }
};
</script>

<style lang="scss" scoped>
.good-container {
  position: relative;
  width: 650px;
  margin: 0 auto;
  background-color: #fff;
  border-bottom: none;
  box-sizing: border-box;
  cursor: pointer;
  .goods-chain {
    position: relative;
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    color: #535355;
    text-align: center;
    &::after {
      position: absolute;
      display: block;
      content: '';
      height: 1px;
      width: 46%;
      left: 0;
      top: 12px;
      background-color: #ececec;
    }
    &::before {
      position: absolute;
      display: block;
      content: '';
      height: 1px;
      width: 46%;
      right: 0;
      top: 12px;
      background-color: #ececec;
    }
  }
  &:last-child {
    border-bottom: 1px solid #ececec;
  }
}
.gic-goods-selector {
  .goods-condition {
    .goods-box {
      margin-bottom: 30px;
      padding-bottom: 15px;
      box-sizing: border-box;
      box-shadow: 0 0 5px #e2e0e0;
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
    }
  }
  .goods-lists {
    padding: 30px 9px;
    .good-type {
      display: inline-block;
      vertical-align: middle;
      width: 104px;
      margin: 0 10px;
      line-height: 30px;
      height: 30px;
      text-align: center;
      font-size: 14px;
      border: 1px solid #dcdfe6;
      border-radius: 20px;
      color: #606266;
      &:hover {
        border-color: #1890ff;
      }
    }
    .good-forbid {
      color: #c0c4cc;
      background-image: none;
      background-color: #fff;
      cursor: not-allowed;
      border-color: #ebeef5;
      &:hover {
        border-color: #ebeef5;
      }
    }
  }
  .goods-tips {
    display: flex;
    justify-content: space-between;
    margin: 0 20px;
    padding: 10px;
    font-size: 14px;
    color: #acaeb1;
    .tip-count {
      font-weight: 700;
      color: #e23434;
    }
  }
}
</style>

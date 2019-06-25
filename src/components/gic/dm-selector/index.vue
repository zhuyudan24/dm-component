<template>
  <div class="gic-selector">
    <div class="gic-goods-selector" v-show="complexData.length == 0">
      <div class="good-container" v-for="(condition, index) in conditions" :key="index">
        <!-- 商品条件 -->
        <el-collapse-transition>
          <div class="goods-condition" v-show="condition.expendStatus == '收起'">
            <goods-item class="goods-box" :type="list.type" v-for="(list, i) in condition.goodsList" :list-reback="list" :key="i + 100000" :tags="list.tags" :goods-brands="list.brands" :goods-index="[index, i]">
              <!-- v-if="condition.goodsList.length > i +1" -->
              <goods-collection :disabled="condition.goodsList.length == i + 1" :length="condition.goodsList.length" :condition="list.condition" :good-index="[index, i]"> </goods-collection>
            </goods-item>
          </div>
        </el-collapse-transition>
        <ul class="goods-lists" v-show="condition.goodsList.length != 5">
          <li class="good-type" v-for="(good, inx) in condition.goods" :class="[condition.goodsList.length == 5 ? 'good-forbid' : '']" :key="inx + 1" @click="addGoodsCondition(good, index)">
            <i class="el-icon-plus"></i>
            {{ good.label }}
          </li>
        </ul>

        <div class="goods-tips">
          <el-button type="text" @click="expendList(index)">{{ condition.expendStatus }}</el-button>
          <!-- <el-button type="text" v-else></el-button> -->
          <div class="tip-txt">
            还可插入 <span class="tip-count"> {{ 5 - condition.goodsList.length }} </span> 个条件
            <el-button type="text" v-if="index > 0" @click="removeCondition(index)">删除</el-button>
          </div>
        </div>

        <p class="goods-chain" v-if="conditions[index + 1]">并且</p>
      </div>
    </div>
    <complex-info :complexData="complexData" v-if="complexData.length"></complex-info>
    <i class="el-icon-edit btn-edit-group" v-if="complexData.length" @click="changeComplexInfo"></i>
  </div>
</template>

<script>
/* eslint-disable */
import ElCollapseTransition from './collapse-transition';
import GoodsItem from './goods-item'; // 商品项
import ComplexInfo from './complex-info'; // 缩略信息
import GoodsCollection from './goods-collection'; // 商品集合条件
import { baseUrl, ERR_OK } from '@/config/index.js';
// import { request } from 'http';
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
  name: 'vue-gic-goods-selector',

  components: {
    GoodsItem,
    GoodsCollection,
    ElCollapseTransition,
    ComplexInfo
  },

  props: {
    condition: Array,
    projectName: String,
    enterpriseId: String, // 企业id
    bizType: String, //过滤器类型
    bizName: String // 过滤器名称
  },

  data() {
    return {
      complexData: [],
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
    changeComplexInfo() {
      this.complexData = [];
      this.$emit('changelist');
    },
    // passSpeGroupList 规格值传递
    passSpeGroupList(list) {
      let arr = list.index;
      this.conditions[arr[0]].goodsList[arr[1]].ids = list.item;
      this.conditions[arr[0]].goodsList[arr[1]].ids.type = list.type;
    },
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
      /**
       * 这里商品属性有个问题就是如果有多个（最少两个）商品属性 删除的时候
       * 由于商品属性没有从父组件传进来的值 所以自组件无法知道怎么去渲染
       */
      this.conditions[arr.index[0]].goodsList.splice(arr.index[1], 1);
      // 因为涉及到可以删除的问题 所以要保留一个status来知道是不是删除的选项
      if (this.conditions.length && this.conditions[arr.index[0]].goodsList.length && this.conditions[arr.index[0]].goodsList[arr.index[1]]) {
        this.conditions[arr.index[0]].goodsList[arr.index[1]].status = arr.status;
      }
      // 如果是最后一行 就删除整个大行
      // if (this.conditions.length > 1) {
      //   if (!this.conditions[arr[0]].goodsList.length) {
      //     this.conditions.splice(arr[0], 1);
      //   }
      // }
    },
    // 展开
    expendList(i) {
      this.conditions[i].expendStatus = this.conditions[i].expendStatus === '展开' ? '收起' : '展开';
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
          condition: 1, // 并且剔除条件
          brands: []
        });
        return;
      }
      this.conditions[i].goodsList.push({
        type: type,
        collection: this.conditions[i].goodsList.length < singleCount - 1 ? true : false,
        condition: 1, // 并且剔除条件
        brands: []
      });
    },
    // 添加品类
    addAtegoryList(type, i, u) {
      if (u) {
        this.conditions[i].goodsList.unshift({
          type: type,
          collection: this.conditions[i].goodsList.length < singleCount - 1 ? true : false,
          condition: 1,
          tags: []
        });
        return;
      }
      this.conditions[i].goodsList.push({
        type: type,
        collection: this.conditions[i].goodsList.length < singleCount - 1 ? true : false,
        condition: 1,
        tags: []
      });
    },
    // 其他三种类型
    addOtherList(type, i, u) {
      if (u) {
        this.conditions[i].goodsList.unshift({
          type: type,
          collection: this.conditions[i].goodsList.length < singleCount - 1 ? true : false,
          condition: 1,
          ids: []
        });
        return;
      }
      this.conditions[i].goodsList.push({
        type: type,
        collection: this.conditions[i].goodsList.length < singleCount - 1 ? true : false,
        condition: 1,
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
      // 如果下面有就不加
      // if (this.conditions.length - i == 1) {
      //   this.conditions.push({
      //     goods: JSON.parse(JSON.stringify(goodsType)),
      //     goodsList: [],
      //     expendStatus: ''
      //   });
      // }
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
    filterConditionList(list) {
      let ret = [];
      list.forEach(el => {
        let cond = [];
        if (el.goodsList && el.goodsList.length) {
          el.goodsList.forEach(item => {
            const list = JSON.parse(JSON.stringify(filterList));
            list.operate = item.condition == null ? '' : item.condition == 1 ? 'intersect' : item.condition == 0 ? 'union' : 'diff'; // 条件    
            // 品类
            if (item.type === 'ategory') {
              item.tags.forEach(li => {
                list.ids.push(li.categoryId);
              });
              list.type = 'category';
            } else if (item.type === 'brand') {
              // 品牌
              item.brands.forEach(li => {
                list.ids.push(li.brandId);
              });
              list.type = 'brand';
            } else if (item.type === 'specifications') {
              // 规格
              list.parentId = item.parentId;
              item.ids.forEach(el => {
                list.ids.push(el.valueId || el.standardId);
              });
              if (item.ids.type == 'stdGroup') {
                list.type = 'stdGroup';
              } else {
                list.type = 'standard';
              }
            } else if (item.type === 'properties') {
              // 属性
              list.parentId = item.ids.parentId;
              item.ids.propId.forEach(el => {
                list.ids.push(el.valueId);
              });
              list.condition = item.ids.condition;
              list.type = 'property';
            } else if (item.type === 'some') {
              // 如果是sku 我会主动添加一个sku标识属性 来区分是不是sku筛
              // 如果是sku 就把商品id拼起来
              if (item.ids && item.ids.length && item.ids[0].hasSku) {
                item.ids.forEach(el => {
                  let skus = el.skus.map(item => item.skuId);
                  let skulist = skus.map(sk => `${el.goodsId}_${sk}`);
                  list.ids = skulist;
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
      ret = ret.map(el => {
        for (let i = el.length - 1; i > 0; i--) {
          el[i].operate = el[i - 1].operate;
        }
        return el;
      })
      return ret;
    },

    // 提交取最后的筛选条件
    async collectConditions() {
      let ret = this.filterConditionList(this.conditions);
      // 如果没有筛选条件 就去掉
      const filterCondition = ret.filter(item => item.length);
      // 如果没有选就直接报错
      if (!filterCondition.length) {
        return false;
      }
      // 如果有条件但是没有选择内容 只要有一个选择了就可以
      let idLen = filterCondition[0].every(el => el.ids.length > 0); // 返回布尔值 是否有选择内容
      if (!idLen) {
        return false;
      }

      return new Promise((resolve, reject) => {
        this.axios.post(`${baseUrl}/api-plug/save-store-goods-sku-filter?requestProject=goods`, {filterCondition: filterCondition}).then(res => {
          if (res.data.errorCode === ERR_OK) {
            const data = res.data.result;
            // 缩略信息
            this.complexData = data.filterAbbrInfo;
            if (this.complexData && this.complexData.length) {
              data.conditions = filterCondition.map(el => {
                el = el.map(goods => {
                  if (goods.type == 'sku') {
                    goods.ids = goods.ids.map(id => id.split('_')[1]);
                  }
                  return goods;
                });
                return el;
              });
              data.conditionList = this.conditions;
              resolve(data);
            }
          } else {
            reject(res);
          }
        }).catch(err => {
          console.log(err);
        });
      });
    },
    // 接收
    passSpes(spes) {
      const index = spes.index;
      this.conditions[index[0]].goodsList[index[1]].ids = spes.items;
      this.conditions[index[0]].goodsList[index[1]].ids.type = spes.type;
    },
    // 部分商品信息
    passGoodslist(lists) {
      const index = lists.index;
      this.conditions[index[0]].goodsList[index[1]].ids = lists.items;
    },
    // 接收 商品属性
    receiveProperty(property) {
      const index = property.index;
      this.conditions[index[0]].goodsList[index[1]].ids = property.items;
    },
     receivestandardId(property) {
      const index = property.index;
      this.conditions[index[0]].goodsList[index[1]].parentId = property.items.parentId;
    },
    deleteStatus(index) {
      if ('status' in this.conditions[index[0]].goodsList[index[1]]) {
        this.conditions[index[0]].goodsList[index[1]].status = '';
      }
    }
  },

  mounted() {
    // 删除小筛选条件
    this.$on('delete-gooditem', this.deleteGooditem);
    this.$on('pass-radioGroup', this.receiveRadio);
    this.$on('pass-checkbox', this.receiveCheckbox);
    this.$on('pass-property', this.receiveProperty);
    this.$on('pass-standardId', this.receivestandardId); 
    this.$on('handle-ategory', this.addAtegory);
    this.$on('insert-uselector', this.insertUselector);
    this.$on('insert-dselector', this.insertDselector);
    this.$on('pass-spes', this.passSpes);
    this.$on('pass-goodslist', this.passGoodslist);
    this.$on('pass-spe-group-list', this.passSpeGroupList);
    this.$on('delete-status', this.deleteStatus); // 删除删除的状态
  }
};
</script>

<style lang="scss" scoped>
.good-container {
  position: relative;
  width: 650px;
  margin-bottom: 20px;
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
  width: 650px;
  .goods-condition {
    .goods-box {
      margin-bottom: 20px;
      padding-bottom: 15px;
      box-sizing: border-box;
      box-shadow: 0 0 5px #e2e0e0;
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
      border: 1px solid rgba(266, 244, 244, 0.9);
      &:hover {
        border-color: #1890ff;
      }
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
.goods-bounce {
  animation: bounce 0.3s;
}
@keyframes bounce {
  0% {
    transform: scale(0);
    transform-origin: 50% 100% 0;
  }
  50% {
    transform: scale(0.5);
    transform-origin: 50% 100% 0;
  }
  100% {
    transform: scale(1);
    transform-origin: 50% 100% 0;
  }
}
.btn-edit-group {
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
}
</style>

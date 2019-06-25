<template>
  <div class="goods-properties">
    <div class="check-title">
      选择属性
      <load-select v-model="propVal" @scrollload="loadMore" :load="load" @change-load="changeLoad">
        <gic-load-item v-for="item in propOptions" :key="item.propertyId" :value="item.propertyId" :label="item.propertyName" @pass-item="resiver"> </gic-load-item>
      </load-select>

      <!-- 多选有 包含其一 和 包含所有-->
      <!-- <el-select v-model="exclude" placeholder="请选择" style="width: 120px" v-if="propType === 'TYP_CHECK'">
        <el-option
          v-for="item in excludeOption"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select> -->
    </div>

    <div class="prop-content">
      <!-- 单选 属性勾选 TYP_SINGLE -->
      <!-- v-if="propType === 'TYP_SINGLE' || propType === 'TYP_CHECK'"  -->
      <div v-if="propType === 'TYP_SINGLE' || propType === 'TYP_CHECK'" class="prop-type">
        <el-checkbox :indeterminate="isIndeterminate" v-model="propList.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div class="box-group">
          <el-checkbox-group v-model="checkedSpes" @change="handleCheckedSpesChange">
            <el-checkbox v-for="spe in spes" class="dm-checkbox" :label="spe" :key="spe.valueId">
              {{ spe.valueName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <!-- 文本 关键字搜索 -->
      <!-- <div v-if="propType === 'TYP_TEXT'" class="prop-type">关键字搜索：<el-input v-model="propList.text" style="width: 200px;" maxlength="8" placeholder="关键字" clearable></el-input></div> -->

      <!-- 整数 没有小数-->
      <!-- <div v-if="propType === 'TYP_NUM'" class="prop-type">
        <el-select v-model="interval" placeholder="请选择" style="width: 100px">
          <el-option v-for="item in intervalOption" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>

        <el-input placeholder="请输入" maxlength="8" minlength="1" style="width: 150px" v-model="propList.number"></el-input>
      </div> -->

      <!-- 实数 有小数-->
      <!-- <div v-if="propType === 'TYP_REAL_NUM'" class="prop-type">
        <el-select v-model="interval" placeholder="请选择" style="width: 100px;">
          <el-option v-for="item in intervalOption" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>

        <el-input placeholder="请输入" maxlength="8" minlength="1" style="width: 150px;" v-model="propList.rel_num"></el-input>
      </div> -->

      <!-- 时间 TYP_TIME  -->
      <!-- <div v-if="propType === 'TYP_TIME'" class="prop-type">
        <el-date-picker v-model="propList.Time" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"> </el-date-picker>
      </div> -->
    </div>
    <slot></slot>
  </div>
</template>

<script>
import LoadSelect from './load-select';
import GicLoadItem from './load-item';
import Emitter from './assist/emitter';
import { baseUrl } from '@/config/index.js';
// 文本 单选 多选 勾选 整数 实数 货币 时间 百分比
const PROP_TYPE = [
  'TYP_TEXT', // 文本
  'TYP_SINGLE', // 单选
  'TYP_CHECK', // 多选
  'TYP_MULTI', // 勾选
  'TYP_NUM', // 整数
  'TYP_REAL_NUM', // 实数
  'TYP_CURRENCY', // 货币
  'TYP_TIME', // 时间
  'TYP_PERCENT' // 百分比
];

export default {
  name: 'goods-properties',

  mixins: [Emitter],

  props: {
    goodsIndex: Array,
    listReback: [Array, Object]
  },

  components: {
    GicLoadItem,
    LoadSelect
  },

  data() {
    return {
      propOptions: [],
      propVal: [],
      checkedSpes: [],
      load: false,
      currentPage: 1,
      spes: [],
      interval: null,
      isIndeterminate: false,
      propType: '',
      propList: {
        Time: '',
        checkAll: false,
        number: null,
        rel_num: null
      }
      // intervalOption: [{ label: '>=', value: 0 }, { label: '<=', value: 1 }, { label: '=', value: 2 }]
    };
  },

  watch: {
    checkedSpes(newval) {
      this.dispatch('vue-gic-goods-selector', 'pass-property', {
        index: this.goodsIndex,
        items: {
          propId: newval,
          parentId: this.propertyId,
          condition: this.exclude
        }
      });
    }
  },

  methods: {
    loadMore() {
      if (this.propOptions.length == (this.currentPage - 1) * 20) {
        this.getPropData('success');
      } else {
        this.load = true;
      }
    },
    changeLoad() {
      this.load = false;
    },

    handleCheckAllChange(val) {
      this.checkedSpes = val ? this.spes : [];
      this.isIndeterminate = false;
    },
    handleCheckedSpesChange(value) {
      let checkedCount = value.length;
      this.propList.checkAll = checkedCount === this.spes.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.spes.length;
    },
    // 商品属性列表下拉数据
    getPropData(suc) {
      const param = {
        currentPage: this.currentPage,
        pageSize: 20
      };
      this.axios
        .get(`${baseUrl}/api-goods/page-property?requestProject=goods`, {
          params: param
        })
        .then(res => {
          if (res.data.errorCode === 0) {
            let data = res.data.result;
            this.propOptions = this.propOptions.concat(data.result);
            this.currentPage++;
            if (suc == 'success') {
              this.load = true;
            }
            // 回显
            if (this.listReback.ids.parentId) {
              let index = this.propOptions.findIndex(el => el.propertyId == this.listReback.ids.parentId);
              if (index > -1) {
                this.resiver(this.propOptions[index].propertyName);
              }
            }
          } else {
            // this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
          // this.$message.error(error);
        });
    },
    resiver(val) {
      this.propVal = val;
      const item = this.propOptions.find(el => el.propertyName === val);
      this.propertyId = item.propertyId;
      // propertyType 字段属性类型
      const type = PROP_TYPE.find(type => type === item.propertyType);
      // 属性类型
      if (type) {
        this.propType = type;
        if (this.propType == 'TYP_SINGLE' || this.propType == 'TYP_CHECK') {
          const param = {
            currentPage: 1,
            pageSize: 10000,
            propertyId: item.propertyId
          };
          this.axios
            .get(`${baseUrl}/api-goods/page-property-value?requestProject=goods`, {
              params: param
            })
            .then(res => {
              if (res.data.errorCode == 0) {
                const data = res.data.result;
                if (data.result && data.result.length) {
                  this.spes = data.result;
                } else {
                  this.spes = [];
                }
                // 回显内部属性
                const List = this.listReback.ids.propId;
                if (List && List.length) {
                  List.forEach(el => {
                    let i = this.spes.findIndex(item => item.valueId == el.valueId);
                    if (i > -1) {
                      this.checkedSpes.push(this.spes[i]);
                    }
                  });
                  let checkedCount = this.checkedSpes.length;
                  this.propList.checkAll = checkedCount === this.spes.length;
                  this.isIndeterminate = checkedCount > 0 && checkedCount < this.spes.length;
                }
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
        // 多选
      }
    }
  },

  beforeMount() {
    this.getPropData();
  },
  mounted() {
    this.$on('pass-item', this.resiver);
  }
};
</script>

<style lang="less" scoped>
.goods-properties {
  .check-title {
    height: 48px;
    line-height: 48px;
    padding-left: 20px;
    background-color: #ebeef5;
    font-size: 14px;
    color: #606266;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }
  .prop-content {
    padding: 10px 20px;
    .box-group {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed #dcdfe6;
    }
    .prop-type {
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>

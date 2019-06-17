<template>
  <div class="collection">
    <div class="coll-options" v-if="goodIndex[1] <= 3">
      <el-radio-group v-model="bindCondition" @change="handleChange">
        <el-radio :disabled="disabled" :label="0">并且</el-radio>
        <el-radio :disabled="disabled" :label="1">或者</el-radio>
        <el-radio :disabled="disabled" :label="2">剔除</el-radio>
      </el-radio-group>
    </div>
    <div class="coll-options" v-else></div>

    <div class="oper-btn">
      <el-popover placement="top" width="150" trigger="click" v-model="visiable">
        <el-radio-group v-model="goodOption" class="pop-options">
          <el-radio :label="1" class="pop-goodlist">商品品牌</el-radio>
          <el-radio :label="2" class="pop-goodlist">商品品类</el-radio>
          <el-radio :label="3" class="pop-goodlist">商品规格</el-radio>
          <el-radio :label="4" class="pop-goodlist">商品属性</el-radio>
          <el-radio :label="5" class="pop-goodlist">部分商品</el-radio>
        </el-radio-group>
        <div class="insert-dir">
          <el-button type="text" @click="insertUpward">上方插入</el-button>
          <el-button type="text" @click="insertUpdown">下方插入</el-button>
        </div>
        <el-button type="text" class="button-txt" slot="reference" :disabled="length == 5">插入条件</el-button>
      </el-popover>
      <span class="cut-line">|</span>
      <el-button type="text" class="button-txt" @click="deleteCondition">删除</el-button>
    </div>
  </div>
</template>

<script>
import Emitter from './assist/emitter';

// 集合条件 并且 或者 剔除
export default {
  name: 'goods-collection',

  props: {
    disabled: Boolean,
    goodIndex: Array,
    length: Number,
    condition: Number
  },

  mixins: [Emitter],

  data() {
    return {
      bindCondition: '',
      goodOption: 1, // 插入的商品
      visiable: false
    };
  },

  methods: {
    deleteCondition() {
      // 触发selector 组件去删除
      this.dispatch('vue-gic-selector', 'delete-gooditem', this.goodIndex);
    },
    handleChange(val) {
      this.dispatch('vue-gic-selector', 'pass-radioGroup', { index: this.goodIndex, val: this.bindCondition });
    },
    insertUpward() {
      this.dispatch('vue-gic-selector', 'insert-uselector', { index: this.goodIndex, type: parseInt(this.goodOption, 10) });
      this.visiable = false;
    },
    insertUpdown() {
      this.dispatch('vue-gic-selector', 'insert-dselector', { index: this.goodIndex, type: parseInt(this.goodOption, 10) });
      this.visiable = false;
    }
  },

  watch: {
    condition: {
      immediate: true,
      handler(val) {
        this.bindCondition = val;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.collection {
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
  padding-top: 10px;
  border-top: 1px dashed #dcdfe6;
  display: flex;
  justify-content: space-between;
  .coll-options {
    display: inline-block;
  }
  .oper-btn {
    display: inline-block;
    text-align: right;
    .cut-line {
      color: #dcdfe6;
    }
  }
}
.pop-options {
  text-align: center;
  .pop-goodlist {
    margin-left: 0;
    line-height: 26px;
  }
}
.insert-dir {
  border-top: 1px solid #dcdfe6;
  padding-top: 10px;
  text-align: center;
}
.button-txt {
  color: #a4a7aa;
  &:hover {
    color: #1890ff;
  }
}
</style>

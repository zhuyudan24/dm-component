<template>
  <!-- 商品规格 规格值筛选 -->
  <div class="good-spes">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>

    <div class="box-group">
      <el-checkbox-group v-model="checkedSpes" @change="handleCheckedSpesChange">
        <el-checkbox v-for="spe in spes" :label="spe" :key="spe.standardId">
          {{ spe.standardName }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import Emitter from './assist/emitter';

// 商品规格
export default {
  name: 'good-spes',

  mixins: [Emitter],

  props: {
    listSpes: {
      type: Array,
      default() {
        return [];
      }
    },
    goodsIndex: Array
  },

  data() {
    return {
      checkAll: false,
      checkedSpes: [],
      spes: [],
      isIndeterminate: false
    };
  },

  watch: {
    listSpes: {
      immediate: true,
      handler(val) {
        this.spes = val;
      }
    },
    checkedSpes(newval) {
      this.dispatch('vue-gic-selector', 'pass-spes', {
        index: this.goodsIndex,
        items: newval
      });
    }
  },

  methods: {
    handleCheckAllChange(val) {
      this.checkedSpes = val ? this.spes : [];
      this.isIndeterminate = false;
    },
    handleCheckedSpesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.spes.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.spes.length;
    }
  }
};
</script>

<style lang="less" scoped>
.good-spes .box-group {
  margin-top: 10px;
}
</style>

<template>
  <!-- 表格内部sku筛选的组件 -->
  <div class="sku-checkbox" :class="{ 'sku-white': bgColor }" v-if="skus.length">
    <div class="sku-table">
      <el-checkbox v-model="allSku" v-if="showCheckBox" :indeterminate="isIndeterminate" @change="handleCheckAllChange"></el-checkbox>
      <span class="sku-attr sku-code">SKU码</span>
      <span class="sku-attr sku-color">颜色</span>
      <span class="sku-attr sku-size">大小</span>
    </div>
    <ul class="sku-lists">
      <li v-for="(sku, i) in skus" :key="i" class="list">
        <el-checkbox v-if="showCheckBox" v-model="sku.check" @change="handleCheckedSku"></el-checkbox>
        <span class="sku-attr sku-code" :title="sku.skuCode">{{ sku.skuCode }}</span>
        <span class="sku-color sku-attr">
          {{ sku.color }}
        </span>
        <span class="sku-size sku-attr">
          {{ sku.size }}
        </span>
      </li>
    </ul>
  </div>
  <div class="no-sku-data" v-else>
    <i class="icon iconfont icon-jibenxinxi"></i>
    暂无数据
  </div>
</template>

<script>
import Emitter from './assist/emitter';

export default {
  name: 'table-checkbox',

  mixins: [Emitter],

  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    showCheckbox: Boolean,
    bColor: String,
    inx: Number
  },

  data() {
    return {
      skus: [],
      allSku: false,
      showCheckBox: false,
      isIndeterminate: false,
      checkedSku: []
    };
  },

  methods: {
    handleSkuStatus() {
      this.checkedSku = this.skus.filter(el => el.check);
      this.allSku = this.checkedSku.length === this.skus.length;
      this.isIndeterminate = this.checkedSku.length > 0 && this.checkedSku.length < this.skus.length;
    },
    handleCheckAllChange(val) {
      this.skus = this.skus.map(el => ({
        ...el,
        check: val
      }));
      this.isIndeterminate = false;
      this.dispatch('SkuFilterTable', 'passku', {
        skus: this.skus,
        inx: this.inx
      });
    },
    handleCheckedSku() {
      this.handleSkuStatus();
      // 每次勾选sku的时候传到最外层的商品层
      this.dispatch('SkuFilterTable', 'passku', {
        skus: this.skus,
        inx: this.inx
      });
    }
  },

  created() {
    this.showCheckBox = this.showCheckbox;
    this.bgColor = this.bColor ? this.bColor : '';
  },

  mounted() {
    // 切换sku的状态 跟左边对应
    this.$on('changeSkuStatus', this.handleSkuStatus);
  },

  watch: {
    data: {
      immediate: true,
      handler(newval) {
        this.skus = newval;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.sku-checkbox {
  padding: 20px 10px 20px 30px;
  .sku-attr {
    display: inline-block;
    vertical-align: middle;
    margin: 0 5px;
    line-height: 30px;
    color: #909399;
  }
  .sku-code {
    width: 140px;
  }
  .sku-color {
    width: 50px;
    text-align: center;
  }
  .sku-size {
    width: 50px;
    text-align: center;
  }
  .sku-lists {
    .list {
      height: 35px;
      line-height: 35px;
    }
  }
}
.sku-white {
  background-color: #fff;
  .sku-table {
    border-bottom: 1px solid #dcdfe6;
  }
}
.no-sku-data {
  margin: 15px 0;
  text-align: center;
  color: #8ab3d9;
  .icon-jibenxinxi {
    display: block;
    margin-bottom: 10px;
    color: #8ab3d9;
    font-size: 18px;
  }
}
</style>

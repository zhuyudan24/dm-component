<template>
  <div class="goods-brand">
    <div class="check-title">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全部选择</el-checkbox>
    </div>
    <el-checkbox-group v-model="checkedBrandes" @change="handleCheckedBrandChange" class="brand-group">
      <el-checkbox v-for="brand in brandes" :key="brand.brandId" :label="brand" class="brand-list">{{ brand.brandName }}</el-checkbox>
    </el-checkbox-group>
    <slot></slot>
  </div>
</template>

<script>
import ElCollapseTransition from './collapse-transition';
import Emitter from './assist/emitter';
import { baseUrl } from '@/config/index.js';
// 品牌
export default {
  name: 'goods-brand',

  mixins: [Emitter],

  components: {
    ElCollapseTransition
  },

  props: {
    goodsBrands: Array,
    goodsIndex: Array,
    listReback: Object
  },

  data() {
    return {
      isIndeterminate: false,
      checkAll: false,
      checkedBrandes: [],
      brandes: [],
      middleBrands: []
    };
  },

  methods: {
    // 全选
    handleCheckAllChange(val) {
      this.checkedBrandes = val ? this.brandes : [];
      this.isIndeterminate = false;
    },

    // 复选框多选
    handleCheckedBrandChange(val) {
      let checkCount = val.length;
      this.checkAll = checkCount === this.brandes.length;
      this.isIndeterminate = checkCount > 0 && checkCount < this.brandes.length;
    },
    getBrandList() {
      const param = {
        currentPage: 1,
        pageSize: 10000
      };
      this.axios
        .get(`${baseUrl}/api-goods/brandlist?requestProject=goods`, {
          params: param
        })
        .then(res => {
          let data;
          if (res.data.errorCode === 0) {
            data = res.data.result;
            this.brandes = data.result;
            // 如果超过了20条 totalCount 是总数 根据总数来判断是否还要继续展示第二页的 并不适合全选
            if (this.middleBrands.length) {
              let checkCount = this.middleBrands.length;
              this.checkAll = checkCount === this.brandes.length;
              this.isIndeterminate = checkCount > 0 && checkCount < this.brandes.length;
              this.middleBrands.forEach(el => {
                let index = this.brandes.findIndex(item => item.brandId === el.brandId);
                if (index > -1) {
                  this.checkedBrandes.push(this.brandes[index]);
                }
              });
            }
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    }
  },

  beforeMount() {
    // 获取品牌列表
    this.getBrandList();
  },

  watch: {
    goodsBrands: {
      immediate: true,
      handler(newval) {
        this.middleBrands = newval;
      }
    },
    checkedBrandes(newval) {
      this.dispatch('vue-gic-goods-selector', 'pass-checkbox', {
        index: this.goodsIndex,
        items: newval
      });
    },
    listReback: {
      immediate: true,
      handler(newval) {
        if (newval.status === 'delete') {
          this.checkedBrandes = [];
          let checkCount = newval.brands.length;
          this.checkAll = checkCount === this.brandes.length;
          this.isIndeterminate = checkCount > 0 && checkCount < this.brandes.length;
          newval.brands.forEach(el => {
            let index = this.brandes.findIndex(item => item.brandId === el.brandId);
            if (index > -1) {
              this.checkedBrandes.push(this.brandes[index]);
            }
          });
          this.dispatch('vue-gic-goods-selector', 'delete-status', this.goodsIndex);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.goods-box {
  .check-title {
    height: 48px;
    line-height: 48px;
    padding-left: 4px;
    background-color: #ebeef5;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }
  .brand-group {
    padding: 10px 20px;
  }
  .brand-list {
    line-height: 30px;
    margin-left: 0;
    margin-right: 10px;
  }
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>

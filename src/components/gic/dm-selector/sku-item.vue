<template>
  <li class="sku-item" v-if="popShow">
    <el-popover placement="bottom" :width="320" trigger="hover">
      <div slot="reference">
        <el-checkbox v-model="skuItem.check" @change="handleChange"></el-checkbox>
        <div class="good-img">
          <img :src="skuItem.img" />
        </div>
        <div class="good-info">
          <p class="name" :title="skuItem.goodsName">{{ skuItem.goodsName }}</p>
          <p class="code" :title="skuItem.goodsCode">{{ skuItem.goodsCode }}</p>
        </div>
      </div>
      <table-checkbox :data="skuItem.skus" b-color="white"></table-checkbox>
    </el-popover>
  </li>

  <li class="sku-item" v-else>
    <el-checkbox v-model="skuItem.check" @change="handleChange"></el-checkbox>
    <div class="good-img">
      <img :src="skuItem.img" />
    </div>
    <div class="good-info">
      <p class="name">{{ skuItem.goodsName }}</p>
      <p class="code">{{ skuItem.goodsCode }}</p>
    </div>
  </li>
</template>

<script>
import TableCheckbox from './table-checkbox';

export default {
  name: 'sku-item',

  components: {
    TableCheckbox
  },

  props: {
    skuList: Object,
    popShow: Boolean
  },

  data() {
    return {
      skuItem: {},
      visiable: false
    };
  },

  methods: {
    handleChange(val) {
      this.$emit('update:check', val);
      this.$emit('pass-check');
    }
  },

  watch: {
    skuList: {
      immediate: true,
      handler(newval) {
        this.skuItem = newval;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.sku-item {
  height: 56px;
  line-height: 56px;
  padding: 0 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #dcdfe6;
  .good-img {
    margin: 0 10px;
    display: inline-block;
    vertical-align: middle;
    height: 35px;
    width: 35px;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .good-info {
    display: inline-block;
    vertical-align: middle;
    p {
      margin: 0;
      font-size: 12px;
      width: 73px;
      height: 20px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &:last-child {
    border-bottom: none;
  }
}
</style>

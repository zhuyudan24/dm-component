<template>
  <li :class="classes">
    <span> {{ data.categoryName }} </span>
    <i v-if="showArrow" class="el-icon-arrow-right fr"></i>
  </li>
</template>

<script>
import { log } from '@/utils/index.js';
export default {
  name: 'Casitem',

  props: {
    data: Object,
    tmpItem: Object
  },

  computed: {
    classes() {
      return [
        `cascader-menu__item`,
        {
          [`cascader-menu__item--extensible`]: this.data && this.data.isChildren,
          [`is-active`]: this.tmpItem.categoryName === this.data.categoryName
        }
      ];
    },
    showArrow() {
      return this.data.isChildren;
    }
  },

  watch: {
    tmpItem(val) {
      log(val);
    },
    data(newval) {
      log(newval);
    }
  }
};
</script>

<style lang="less" scoped>
.cascader-menu__item {
  font-size: 14px;
  padding: 8px 20px;
  width: 152px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 34px;
  line-height: 1.5;
  box-sizing: border-box;
  cursor: pointer;
  outline: none;
  &:hover {
    color: #409eff;
  }
  .fr {
    position: absolute;
    font-size: 12px;
    right: 15px;
    top: 50%;
    margin-top: -6px;
  }
}
.is-active {
  color: #409eff;
}
</style>

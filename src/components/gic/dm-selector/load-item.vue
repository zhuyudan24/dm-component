<template>
  <li class="load-item" @click="handleClick">
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script>
import Emitter from './assist/emitter';

export default {
  name: 'gic-load-item',

  mixins: [Emitter],

  props: {
    value: {
      required: true
    },
    label: [String, Number]
  },

  computed: {
    currentLabel() {
      return this.label || this.value;
    }
  },

  methods: {
    handleClick() {
      this.$emit('pass-item', this.currentLabel);
    }
  }
};
</script>

<style lang="less" scoped>
.load-item {
  height: 24px;
  line-height: 24px;
  padding: 4px 10px;
  cursor: pointer;
  color: #606266;
  &:hover {
    background-color: #f5f7fa;
  }
}
</style>

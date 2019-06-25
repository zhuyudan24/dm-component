<template>
  <transition name="transition-drop">
    <div class="gic-caspanel">
      <Caspanel :data="data" ref="caspanel" :middle="middle" :change-on-select="changeOnSelect"> </Caspanel>
    </div>
  </transition>
</template>

<script>
import Caspanel from './caspanel';

export default {
  name: 'cascader',

  components: {
    Caspanel
  },

  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    middle: {
      type: Array,
      default() {
        return [];
      }
    },
    changeOnSelect: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // 占位
    };
  }
};
</script>

<style lang="less" scoped>
.gic-caspanel {
  height: 240px;
  padding-bottom: 12px;
  overflow-x: auto;
  overflow-y: hidden;
  font-size: 0px;
}
</style>

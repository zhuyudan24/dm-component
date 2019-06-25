<template>
  <!-- 缩略信息递归组件的一部分 -->
  <div class="complex-item">
    <div class="selector-item-txt" v-for="(item, i) in items" :key="i">
      <span class="condition" v-if="item.optName"> {{ item.optName }}</span>
      <div class="txt">
        {{ item.typeName }}{{ item.belong }}
        <div class="child-name" v-if="item.childNames && item.childNames.length">
          <span v-for="(child, index) in item.childNames" :key="index">【{{ child || '' }}】</span>
        </div>
        <!-- <div class="child-name" v-else>
          暂无
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'complex-item',
  props: {
    data: Array
  },

  watch: {
    data: {
      immediate: true,
      handler(newval) {
        this.items = newval;
      }
    }
  },

  data() {
    return {
      items: []
    };
  }
};
</script>

<style lang="less" scoped>
.complex-item {
  .selector-item-txt {
    display: inline-block;
    vertical-align: middle;
    .txt {
      display: inline-block;
      padding: 5px 10px;
      font-size: 12px;
      color: #8d8d8d;
      background-color: #f5f7fa;
      border-radius: 5px;
      .child-name {
        display: inline-block;
      }
    }
    .condition {
      display: inline-block;
      vertical-align: middle;
      margin: 0 5px;
      font-size: 12px;
    }
  }
}
</style>

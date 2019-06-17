<template>
  <div class="footlogo">
    <img src="./foot.png" alt="footer" />
    <p class="footlogo-text">Copyright © {{ currentYear }} 达摩网络</p>
  </div>
</template>

<script>
export default {
  name: 'vue-gic-footer',
  props: [],
  data() {
    return {
      currentYear: ''
    };
  },
  methods: {},
  watch: {},

  /* 接收数据 */
  mounted() {
    this.currentYear = new Date().getFullYear();
  }
};
</script>

<style lang="scss" scoped>
.footlogo {
  position: relative;
  width: 100%;
  margin-top: 0px;
  text-align: center;
  padding: 21px 0 24px 0;

  .footlogo-text {
    font-size: 14px;
    color: #909399;
    font-family: 'Monospaced Number', 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
}
</style>

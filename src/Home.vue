<template>
  <div class="docs-view">
    <section class="aside">
      <dm-aside />
    </section>
    <section class="content">
      <router-view />
    </section>
    <dm-footer></dm-footer>
  </div>
</template>
<script>
import dmFooter from './components/gic/dm-footer/index.vue';
import aside from './docs/aside';
export default {
  components: {
    'dm-footer': dmFooter,
    'dm-aside': aside
  },
  data() {
    return {
      activeIndex: '',
      isCollapse: false,
      userName: ''
    };
  },
  methods: {
    handleSelect() {
      //
    }
  }
};
</script>

<style lang="scss" scoped>
.home-btn--login {
  float: right;
  padding-right: 20px;
  line-height: 60px;
}
.docs-view {
  padding-top: 80px;
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  flex-wrap: wrap;
  @media screen and (max-width: 960px) {
    padding-top: 20px;
  }
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 80px;
    width: 100%;
    border-top: 1px solid #ddd;
    @media screen and (max-width: 960px) {
      content: none;
    }
  }
  section {
    position: relative;
    box-sizing: border-box;
    @media screen and (max-width: 960px) {
      display: block;
    }
    &.aside {
      width: 280px;
      border-right: 1px solid #ddd;
      height: calc(100% - 80px);
      position: fixed;
      top: 80px;
      left: 0;
      z-index: 9;
      background: #fff;
    }
    &.content {
      position: relative;
      margin-left: 280px;
      width: 100%;
      min-height: calc(100% - 100px);
      overflow-y: auto;
      background: #f2f2f2;
    }
  }
}
</style>

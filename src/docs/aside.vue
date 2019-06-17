<template>
  <nav class="nav-list">
    <ul>
      <li v-for="(nav, index) in list" :class="{ active: nav.active }" @click="expand($event, index)" :key="index">
        <span class="angle">{{ nav.num }}</span>
        <p class="label">{{ nav.name }}</p>
        <img :class="{ expand: expands[index] }" :src="nav.active ? blueArrow : arrow" />
        <ul :style="{ maxHeight: expands[index] ? nav['max-height'] : '0' }">
          <li v-for="(item, index) in nav.items" :class="{ active: item.active }" :key="index">
            <template v-if="item.items">
              <p class="label child">{{ item.name }}</p>
              <ul>
                <li v-for="(item, index) in item.items" :class="{ active: activedMenu === item.router }" :key="index">
                  <a @click.stop="route(item)">{{ item.key }}</a>
                </li>
              </ul>
            </template>
            <template v-else>
              <a @click.stop="route(item)">{{ item.key }}</a>
            </template>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
import navs from '../assets/json/nav.js';
import blueArrow from '../assets/img/blue-arrow.png';
import arrow from '../assets/img/arrow.png';
export default {
  data() {
    return {
      navs: {},
      blueArrow,
      arrow,
      list: [],
      expands: [],
      activedMenu: ''
    };
  },
  methods: {
    expand(event, index) {
      if (event.target.className.includes('child')) return;
      this.$set(this.expands, index, !this.expands[index]);
    },
    isActive({ router }) {
      return router === this.$route.path.replace(/^\/(zh-cn|en)2?/, '') ? 'active' : '';
    },
    filterNavs(navs, path, module) {
      for (let i = 0, len = navs.length; i < len; i++) {
        let nav = navs[i];
        nav.items && this.filterNavs(nav.items, path, module ? module : nav);
        if (nav.router === path) {
          nav.active = true;
          module.active = true;
          return;
        }
      }
    },
    route(item) {
      this.activedMenu = item.router;
      this.$router.push(item.router);
    }
  },
  mounted() {
    this.expands = Array.from({ length: navs.length }, () => true);
    this.$watch(
      '$route.path',
      path => {
        this.list = JSON.parse(JSON.stringify(navs));
        this.filterNavs(this.list, `/${path.split('/').pop()}`);
      },
      { immediate: true }
    );
  }
};
</script>

<style lang="scss" scoped>
.nav-list {
  height: 100%;
  padding: 38px 0;
  box-sizing: border-box;
  overflow-y: auto;
  ul {
    overflow: hidden;
    transition: all 0.5s;
    li {
      position: relative;
      width: 100%;
      &.active p {
        transition: all 0.5s;
        color: #2e54eb;
      }
      &:hover {
        cursor: pointer;
      }
      li {
        position: relative;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0.22px;
        line-height: 40px;
        background: #ffffff;
        text-indent: 60px;
        @media screen and (max-width: 960px) {
          text-indent: 20px;
          font-size: 16px;
          line-height: 34px;
        }
        li {
          position: relative;
          text-indent: 80px;
          @media screen and (max-width: 960px) {
            text-indent: 30px;
          }
        }
        .label {
          font-family: PingFangSC-Regular;
          font-size: 20px;
          color: #999;
          letter-spacing: 0.25px;
          margin: 0;
          height: 48px;
          line-height: 48px;
          text-indent: 60px;
          border-bottom: none;
          @media screen and (max-width: 960px) {
            text-indent: 20px;
            font-size: 12px;
            height: 34px;
            line-height: 34px;
          }
        }
      }
      .active a {
        color: #2e54eb;
        background: #e6f1ff !important;
        &:before {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background: #2e54eb;
        }
      }
      a {
        display: block;
        &:hover {
          background: #fbfbfb;
          color: #2e54eb;
        }
      }
      img {
        position: absolute;
        top: 25px;
        right: 30px;
        width: 12px;
        height: 12px;
        transition: all 0.5s;
        transform: rotate(-180deg);
        @media screen and (max-width: 960px) {
          display: none;
        }
      }
      .expand {
        transform: rotate(0deg) !important;
      }
      .label {
        font-family: PingFangSC-Regular;
        font-size: 24px;
        color: #333;
        letter-spacing: 0.3px;
        line-height: 53px;
        margin: 20px 30px 12px 30px;
        border-bottom: 1px solid #ddd;
        text-indent: 30px;
        @media screen and (max-width: 960px) {
          font-size: 18px;
          margin: 0;
          text-indent: 10px;
          line-height: 40px;
        }
      }
      span {
        position: absolute;
        font-family: PingFangSC-Regular;
        font-size: 22px;
        color: #ccc;
        letter-spacing: 0.28px;
        left: 30px;
        line-height: 30px;
        @media screen and (max-width: 960px) {
          display: none;
        }
      }
    }
  }
}
</style>

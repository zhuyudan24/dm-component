<template>
  <div class="nav-wrap" :style="{ position: position }" ref="navigator">
    <div class="logo-wrap" @click="toHome">
      <img :src="logo" />
      <p>damo Components</p>
    </div>
    <div :class="['tabs-wrap', { active: showTabs }]">
      <i></i>
      <p @click="introduction">文档</p>
      <p @click="log">更新记录</p>
      <p @click="git">GIT</p>
    </div>
    <el-dropdown class="nav-button" @command="handleCommand">
      <span class="el-dropdown-link"> 登录<i class="el-icon-arrow-down el-icon--right"></i> </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="login">商户号登录</el-dropdown-item>
        <el-dropdown-item command="loginGroup">集团账户登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <span class="toggle-nav" @click="toggle">
      <i></i>
    </span>
  </div>
</template>

<script>
import logo from '../assets/img/logo.png';
import bus from '../plugins/bus';
import { debounce, setScrollTop } from '../utils';
import { baseUrl } from '@/config/index.js';
const SUCCESS_CODE = 0;
const CLIENT_WIDTH = 960;

export default {
  data() {
    return {
      logo,
      showTabs: false,
      position: document.body.offsetWidth < CLIENT_WIDTH ? 'fixed' : 'relative'
    };
  },
  methods: {
    toggle() {
      if (['/home', '/log'].includes(this.$route.path)) {
        this.showTabs = !this.showTabs;
      } else {
        bus.$emit('showDrawer');
      }
    },
    git() {
      location.assign('http://115.159.76.241/frontEnd');
    },
    introduction() {
      this.$router.push('/introduction');
    },
    log() {
      this.$router.push('/log');
    },
    toHome() {
      this.$router.push('/home');
    },
    boxShadow() {
      const y = window.scrollY;
      const height = 15;
      const type = y > height && document.body.offsetWidth < CLIENT_WIDTH;
      const shadow = type ? '0 1Px 2Px rgba(0, 0, 0, .18)' : 'none';
      this.$refs.navigator && (this.$refs.navigator.style['box-shadow'] = shadow);
    },
    handleCommand(command) {
      this[command]();
    },
    login() {
      this.axios.get(baseUrl + '/api-auth/do-login?requestProject=gic-web&loginName=damogic&password=damo2018&eid=ff808081593917d90159398ec6340012').then(res => {
        if (res.data.errorCode === SUCCESS_CODE) {
          this.userName = res.data.result.realName;
          this.$message({ type: 'success', message: '登录商户号成功' });
        } else {
          this.$message({ type: 'warning', message: res.data.message });
        }
      });
    },
    loginGroup() {
      this.axios.get(baseUrl + '/api-auth/do-login?requestProject=gic-web&loginName=damo123&password=123456&eid=ff80808162ddfe1a0162e0ebd39c0000').then(res => {
        if (res.data.errorCode === SUCCESS_CODE) {
          this.userName = res.data.result.realName;
          this.$message({ type: 'success', message: '登录集团号成功' });
        } else {
          this.$message({ type: 'warning', message: res.data.message });
        }
      });
    }
  },
  watch: {
    '$route.path': {
      handler: function(path) {
        setScrollTop(0);
        this.showTabs = false;
        if (document.body.offsetWidth > CLIENT_WIDTH) {
          this.position = path === '/home' ? 'relative' : 'fixed';
        }
      },
      immediate: true
    }
  },
  created() {
    this.checkScrollTop = debounce(this.boxShadow, 100);
    window.addEventListener('scroll', this.checkScrollTop, false);
  }
};
</script>

<style lang="scss" scoped>
.nav-wrap {
  // max-width: 1240px;
  width: 100%;
  background: #fff;
  overflow: hidden;
  height: 80px;
  line-height: 80px;
  // position: fixed;
  // position: relative;
  z-index: 1;
  top: 0;
  transform: translate(-50%, 0);
  left: 50%;
  @media screen and (max-width: 960px) {
    position: fixed;
    height: 42px;
    line-height: 42px;
    text-align: center;
    overflow: visible;
    background: rgba(255, 255, 255, 0.9);
    transform: none;
    left: 0;
    z-index: 1;
    transition: all 0.5s;
    .active {
      transform: scale(1) !important;
    }
    .tabs-wrap {
      padding-right: 0;
      position: absolute;
      right: 10px;
      width: 60px;
      top: 35px;
      border: 1px solid #ddd;
      border-radius: 4px;
      transition: all 0.3s;
      text-align: center;
      background: rgba(255, 255, 255, 0.9);
      transform: scale(0);
      transform-origin: 80% 0;
      i {
        display: block;
        position: absolute;
        top: -5px;
        right: 7px;
        width: 10px;
        height: 5px;
        background: #fff;
        &:before,
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 3px;
          width: 8px;
          border-top: 1px solid #ddd;
        }
        &:before {
          transform: rotate(-40deg);
          transform-origin: left bottom;
        }
        &:after {
          right: 0;
          transform: rotate(40deg);
          transform-origin: right bottom;
        }
      }
      p {
        font-size: 12px;
        display: block;
        margin-left: 0;
        line-height: 35px;
        &:hover {
          color: #333333;
        }
      }
    }
    .toggle-nav {
      display: flex;
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      align-items: center;
      justify-content: center;
      padding: 0 16px;
      i {
        margin: 0 2px;
      }
      &:before,
      &:after {
        content: '';
        width: 3px !important;
        height: 3px !important;
      }
      &:before,
      &:after,
      i {
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: #646464;
      }
    }
    .logo-wrap {
      padding-left: 0;
      font-size: 0;
      float: none;
      position: relative;
      img {
        width: 20px;
        height: 23px;
        vertical-align: middle;
        position: relative;
        top: 0;
        transform: none;
        display: inline-block;
      }
      p {
        font-size: 16px;
        padding-top: 2px;
        padding-left: 5px;
        vertical-align: middle;
        display: inline-block;
      }
    }
  }
}
.nav-button {
  margin-left: 20px;
  float: right;
}
.toggle-nav {
  display: none;
}
.tabs-wrap {
  padding-right: 40px;
  float: right;
  i {
    display: none;
  }
  p {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #333333;
    display: inline-block;
    line-height: 80px;
    margin-left: 40px;
    &:hover {
      transition: color 0.4s;
      color: #2e54eb;
      cursor: pointer;
    }
  }
}
.logo-wrap {
  padding-left: 40px;
  float: left;
  position: relative;
  &:hover {
    cursor: pointer;
  }
  img {
    width: 50px;
    height: 50px;
    position: absolute;
    transform: translate(0, -50%);
    top: 50%;
  }
  p {
    font-family: SFProDisplay-Medium;
    font-size: 22px;
    padding-left: 60px;
    color: #222;
    letter-spacing: 0.73px;
  }
}
</style>

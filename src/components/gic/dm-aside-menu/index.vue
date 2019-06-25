<template>
  <div class="left-aside-contain" :style="{ height: asideHeight }">
    <div class="leftBar-wrap">
      <div class="cardmenu" :class="{ collapse: leftCollapse }">
        <div class="cardtitle" v-show="!leftCollapse">
          <span>{{ leftModuleName }}</span>
        </div>
        <div class="cardmenu-item">
          <el-menu :default-active="selectMenu" :data-path="'/' + $route.path" style="border-right: 0;" class="el-menu-vertical-demo cardmenupanel" :router="true" text-color="#c0c4cc" active-text-color="#ffffff" :collapse="leftCollapse" unique-opened @open="handleOpen" @select="handleSelect">
            <template v-for="(menuItem, index) in menuLeftRouter">
              <el-submenu :index="index + ''" :key="index" v-if="menuItem.level4List.length > 0">
                <template slot="title">
                  <i :class="['iconfont', 'menu-icon', menuItem.iconUrl]"></i>
                  <span slot="title">{{ menuItem.menuName }}</span>
                </template>
                <el-menu-item v-for="(childMenu, index) in menuItem.level4List" :key="index" :index="childMenu.menuUrl" style="padding-left: 53px;" v-if="menuItem.isRouter === 1">
                  <label slot="title" :data-index="$route.path == childMenu.menuUrl ? $route.path : false" :data-path="childMenu.menuUrl">{{ childMenu.menuName }}</label>
                </el-menu-item>
                <el-menu-item v-for="(childMenu, index) in menuItem.level4List" :key="index" style="padding-left: 53px;color:#fff" v-if="childMenu.isRouter === 0" :index="childMenu.isRouter">
                  <a class="el-menu-item" :href="childMenu.menuUrl" target="_blank">{{ childMenu.menuName }}</a>
                </el-menu-item>
              </el-submenu>
              <el-menu-item :index="menuItem.menuUrl" :key="index" v-if="!menuItem.level4List.length && menuItem.isRouter === 1">
                <i :class="['iconfont', 'menu-icon', menuItem.iconUrl]"></i>
                <span slot="title">{{ menuItem.menuName }}</span>
              </el-menu-item>
              <el-menu-item :key="index" v-if="!menuItem.level4List.length && menuItem.isRouter === 0" :index="menuItem.isRouter">
                <i :class="['iconfont', 'menu-icon', menuItem.iconUrl]"></i>
                <a :href="menuItem.menuUrl" target="_blank" style="color:#fff">{{ menuItem.menuName }}</a>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import { baseUrl } from '@/config/index.js';
import { log } from '@/utils/index.js';
export default {
  name: 'vue-gic-aside-menu',
  props: ['collapseFlag', 'projectName'], //'leftMenuRouter','leftModulesName',
  data() {
    return {
      repProjectName: 'gic-web', // 项目名
      // 高度
      asideHeight: '0px',
      pathName: '', // 路由名
      leftCollapse: false, // 是否收起左侧
      leftModuleName: '',
      // defaultSub: ['1','2','3','4','5','6','7','8','9'], // 默认打开子菜单
      menuLeftRouter: [],
      // 获取 location origin
      baseUrl,

      //已选菜单
      selectMenu: ''
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      // log(key, keyPath);
    },

    handleSelect(key, keyPath) {
      var that = this;
      log(key, keyPath);
      if (key != 0) {
        that.selectMenu = key;
      }
    },

    // 设置新数据
    setNewData(newData) {
      var that = this;

      // 处理成需要的路由
      // var list = [],lists = [];
      newData.forEach(function(ele, index) {
        if (ele.level4List == null || ele.level4List.length == 0) {
          // 设置 url
          if (ele.isRouter === 1) {
            ele.menuUrl = '/' + ele.menuUrl;
          }
        } else {
          ele.level4List.forEach(function(el, key) {
            // 设置 url
            if (ele.isRouter === 1) {
              el.menuUrl = '/' + el.menuUrl;
            }
          });
        }
      });
      log('处理后的左侧菜单 list:', newData);
      that.menuLeftRouter = newData;
    },

    // 触发父组件路由
    toRouter(path) {
      var that = this;
      that.$emit('toLeftRouterView', '/' + path);
    },

    // 刷新路由
    refreshRoute() {
      var that = this;
      //获取项目名 pathname (路由的hash)
      that.routePathName = window.location.hash.split('/')[1];
      if (that.routePathName.indexOf('?') != -1) {
        that.routePathName = that.routePathName.split('?')[0];
      }
      if (that.routePathName.indexOf('/') != -1) {
        that.routePathName = that.routePathName.split('/')[0];
      }
      log('routePathname:', that.routePathName);
      that.pathName = that.routePathName;
      that.getLeftMenu();
    },

    // 获取左侧菜单
    getLeftMenu() {
      var that = this;
      var para = {
        project: that.repProjectName,
        path: that.pathName,
        requestProject: that.repProjectName
      };
      that.axios
        .post(that.baseUrl + '/api-auth/get-current-memu-data', qs.stringify(para))
        .then(res => {
          var resData = res.data;
          if (resData.errorCode == 0) {
            if (!resData.result) {
              log('resData.result: ', resData.result);
              return;
            }
            that.leftModuleName = resData.result && resData.result.level2.menuName;
            that.setNewData(resData.result.leftMenu);

            if (!!resData.result.level4) {
              // 设置选中menu
              that.selectMenu = '/' + resData.result.level4.menuUrl;
              return;
            }
            if (!!resData.result.level3) {
              // 设置选中menu
              that.selectMenu = '/' + resData.result.level3.menuUrl;
            }
            // sessionStorage.setItem('activeHead',resData.result.level2.menuCode)

            return;
          }
          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          log(error);
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        log('左侧菜单插件获取当前路由:', val);
      },
      // 深度观察监听
      deep: true
    },
    collapseFlag: function(newData, oldData) {
      var that = this;
      // log("左侧新数据:",newData,oldData)
      that.leftCollapse = newData;
    },
    projectName: function(newData, oldData) {
      var that = this;
      // log("新数据:",newData,oldData)
      that.repProjectName = newData || 'gic-web';
    }
  },

  /* 接收数据 */
  mounted() {
    log('传递的左侧菜单参数:', this.projectName, this.$route);
    var that = this;

    // 项目名
    that.repProjectName = that.projectName || 'gic-web';

    // 获取高度
    that.asideHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 64 + 'px';

    //获取项目名 pathname (路由的hash)
    that.pathName = window.location.hash.split('/')[1];
    if (that.pathName.indexOf('?') != -1) {
      that.pathName = that.pathName.split('?')[0];
    }
    log('pathname:', that.pathName);

    // 获取菜单
    that.getLeftMenu();
    //折叠参数
    that.leftCollapse = that.collapseFlag;
  }
};
</script>

<style lang="less" scoped>
.attention-wrap {
  .item-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 30px;
    span {
      display: inline-block;
      width: 80px;
    }
  }
}

.left-aside-contain {
  display: inline-block;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  /deep/ .el-submenu .el-submenu__title:hover {
    background-color: #020b21;
  }
}
.leftBar-wrap /deep/ {
  height: 100%;
  display: inline-block;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .cardmenu {
    flex: 0 0 200px;
    width: 200px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #020b21;
    cursor: pointer;
    transition: all 0.2s ease;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  .collapse {
    transition: all 0.3s ease;
    flex: 0 0 64px;
    width: 64px;
    /*transform: translateX(-8px);*/
    overflow: hidden;
  }

  .cardtitle {
    font-size: 20px;
    color: #fff;
    padding-left: 20px;
    height: 56px;
    line-height: 56px;
  }

  /deep/ .el-submenu__title:hover {
    background-color: #020b21;
  }
}

.leftBar-wrap .el-menu .el-menu-item,
.el-menu .el-submenu {
  background: #020b21;
}
.leftBar-wrap {
  /deep/ .el-submenu__title:hover {
    background-color: #020b21;
  }
}
.leftBar-wrap .cardmenu-item /deep/ .el-menu-item-group .el-menu-item-group__title {
  background-color: #020b21;
  display: none;
}
.leftBar-wrap .cardmenu-item /deep/ .el-submenu__title i {
  color: #c0c4cc;
}

.leftBar-wrap .cardmenu-item /deep/ .el-menu-item span {
  color: #c0c4cc;
}

.leftBar-wrap .cardmenu-item /deep/ .el-submenu .el-menu-item label {
  color: #c0c4cc;
}

.leftBar-wrap .cardmenu-item .el-menu-item.is-active {
  color: #fff;
  background-color: #1890ff;
}

.leftBar-wrap .cardmenu-item /deep/ .el-menu-item.is-active span {
  color: #fff;
}

.leftBar-wrap .cardmenu-item /deep/ .el-submenu .el-menu-item.is-active label {
  color: #fff;
}

.el-menu.el-menu--popup {
  background: #020b21;
  border-radius: 4px;
}

.el-menu--popup .el-menu-item {
  height: 40px;
  line-height: 40px;
}

.el-menu--popup .el-menu-item label {
  display: block;
  margin-left: -34px;
  color: #c0c4cc;
  cursor: pointer;
}

.el-menu--popup .el-menu-item:hover {
  background-color: #020b21;
}

.el-menu--popup .el-menu-item:hover label {
  color: #fff;
}

.leftBar-wrap .cardmenu-item /deep/ .el-submenu__title,
.leftBar-wrap .cardmenu-item /deep/ .el-menu-item,
.leftBar-wrap .cardmenu-item /deep/ .el-submenu .el-menu-item {
  height: 40px;
  line-height: 40px;
}
.leftBar-wrap .cardmenu-item /deep/ li.el-menu-item:hover i {
  /*background-color: #1890ff;*/
  color: #fff;
}

.leftBar-wrap .cardmenu-item /deep/ li.el-menu-item:hover span {
  /*background-color: #1890ff;*/
  color: #fff;
}

.leftBar-wrap .cardmenu-item /deep/ li.el-submenu:hover i {
  /*background-color: #1890ff;*/
  color: #fff;
}

.leftBar-wrap .cardmenu-item /deep/ li.el-submenu:hover span {
  /*background-color: #1890ff;*/
  color: #fff;
}

.leftBar-wrap .cardmenu-item /deep/ li.el-submenu .el-menu-item:hover label {
  /*background-color: #1890ff;*/
  color: #fff;
  cursor: pointer;
}

.leftBar-wrap .el-submenu .el-menu-item-group .el-menu-item {
  position: relative;
}
.leftBar-wrap .el-submenu .el-menu-item::before {
  position: absolute;
  content: '●';
  left: 35px;
  top: 0px;
  font-size: 10px;
  /* color: #fff;*/
}

.leftBar-wrap .el-submenu .el-menu-item:hover::before {
  color: #fff;
}

.leftBar-wrap .slide-fade-enter-active {
  transition: all 0.3s ease;
}
.leftBar-wrap .slide-fade-leave-active {
  transition: all 0.3s ease;
}
.leftBar-wrap .cardmenu-item .menu-icon {
  /*margin-right: 5px;*/
  width: 24px;
  text-align: center;
  font-size: 14px;
  vertical-align: middle;
  display: inline-block;
  color: #c0c4cc;
}
.leftBar-wrap .cardmenu-item .el-menu-item.is-active .menu-icon {
  color: #fff;
}

.el-menu-item-group {
  .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
}
</style>

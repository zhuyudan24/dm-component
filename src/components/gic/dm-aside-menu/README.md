```
<vue-gic-aside-menu ref="leftMenus" :projectName="projectName" :collapseFlag="collapseFlag"></vue-gic-aside-menu>

data() {
  return {
    // 可传参数
        projectName: '', // 当前项目名
        collapseFlag: false, // 折叠参数

        // 路由菜单
        修改由插件内请求

  }
}

methods: {
    // 处理路由跳转(左侧菜单暂时不用,组件内处理)

},
```

> 注意,层级比较深的内部样式无法修改,需要使用页设置

```
.left-aside-contain {
  /deep/  .el-submenu__title:hover {
    background-color: #020b21;
  }
}

使用页如果有加 scoped ,需要到公共样式中添加
.el-menu.el-menu--popup {
    background: #020b21;
    border-radius: 4px;
}

/* 左侧菜单 */
.leftBar-wrap .el-menu{
  background-color: #020b21;
}
.leftBar-wrap .cardmenu-item .el-submenu__title,.leftBar-wrap .cardmenu-item .el-menu-item,.leftBar-wrap .cardmenu-item .el-submenu .el-menu-item{
  height: 40px;
  line-height: 40px;
}
.leftBar-wrap .el-submenu__title:hover {
  background-color: #020b21;
}
.leftBar-wrap .cardmenu-item li.el-menu-item:hover i{
  /*background-color: #409EFF;*/
  color: #fff;
}
.leftBar-wrap .cardmenu-item li.el-menu-item:hover span{
  /*background-color: #409EFF;*/
  color: #fff;
}
.leftBar-wrap .cardmenu-item li.el-submenu:hover i{
  /*background-color: #409EFF;*/
  color: #fff;
}
.leftBar-wrap .cardmenu-item li.el-submenu:hover span{
  /*background-color: #409EFF;*/
  color: #fff;
}
.leftBar-wrap .cardmenu-item li.el-submenu .el-menu-item:hover label{
  /*background-color: #409EFF;*/
  color: #fff;
  cursor: pointer;
}
.leftBar-wrap .cardmenu-item .el-submenu.is-active div.el-submenu__title i{
  color: #fff;
}
.leftBar-wrap .cardmenu-item .el-submenu.is-active div.el-submenu__title span{
  color: #fff;
}
.el-menu.el-menu--popup .el-menu-item.is-active label {
  color: #fff;
}

```

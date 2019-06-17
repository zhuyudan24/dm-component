```
<vue-gic-header :projectName="projectName"  :collapseFlag="collapseFlag" @collapseTag="collapseTag" @toRouterView="toRouterView"></vue-gic-header>

data() {
  return {
    // 可传参数
    	projectName: '', // 当前项目名
        collapseFlag: false, // 折叠参数
        // 路由菜单
        // 修改成插件内请求
      hideUdesk: '',  // 是否初始化udesk，传true不初始化udesk
  }
}

methods: {
    // 处理路由跳转
    toRouterView(val) {
      var that = this;
      // 模拟检查数据
	  // //有两个参数
      //{
      //  name:,
      //  path:
      //}
      console.log(val);
      that.$router.push({
        path: val.path
      })
    },

    // 折叠事件
    collapseTag(val){
      var that = this;
      console.log(val);
    }
},
```

&注意,使用页需要 增加 el-popover 样式

```
.user-header-pop {
  min-width: 95px;
}

.el-popover.user-header-pop {
  min-width: 95px;
}

//头部弹出框样式
/* 头部 */
.user-form-dialog .el-dialog__body {
    padding: 30px 20px 0;
}

.user-form-dialog .el-dialog__header {
    padding: 0 20px;
    height: 54px;
}

.pass-form-dialog .el-dialog__body {
    padding: 30px 20px 0;
}
.pass-form-dialog .el-dialog__header {
    padding: 0 20px;
    height: 54px;
}
```


## log
**v2.0.08 2019.1.18**
1.添加udesk 即时通讯 // 隐藏反馈标签

**v1.3.36 2019.1.17**
1.更新了商户欠费状态

20180913
1.修改头部样式

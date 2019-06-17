
```
// 使用页面
<div @click="showStore">点击弹窗</div>
<vue-gic-store :projectName="projectName" :selectId="selectId" :showStoreDialog="showStoreDialog" @selectStore="selectStore"></vue-gic-store>

data() {
  return {
    // 可传参数
    projectName: '', // 当前项目名
    showStoreDialog: false,
    selectId: '',// 已选的门店
  }
}

methods: {
    // 显示门店弹窗
    showStore() {
      var that = this
      that.showStoreDialog = true;
    },

    // 子组件触发方法
    selectStore(val) {
      // 模拟检查数据
      console.log(val)
      var that = this
      that.showStoreDialog = false;
    }
},
```


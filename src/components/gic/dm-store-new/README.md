```
<vue-gic-store-new :options="options" :isAdd="isAdd" :uuid.sync="uuid"  ref="storeGroup" @store-chane="storeChange"></vue-gic-store-new>

data() {
  return {
    // 参数
    uuid:'',  // 新增传空，编辑必传,
    // 需要的下拉 默认为全部[0,1,2,3,4,5]
    // 0 全部 1 门店类型 2门店标签 3 门店区域 4 门店分组 5 部分门店
    options:[0,1,2,3,4,5],
    isAdd:true
  },
  methods: {
    // 一些方法 根据具体业务需求选用

    /*
    * 获取组件选中的值
    *  data返回示例：{list:[{id:'1',name:'名称'}],type:1}
    */
    getStoreConfig() {
      this.refs.storeNew.getStoreConfig().then(data => {
         this.storeConfig = data;
      })
    },
    /* 判断门店选择是否为空
    * 返回promise对象，flag为true or false ，true已保存，false未保存
    *
    */
    isStoreSave() {
      this.refs.storeNew.isStoreSave().then(flag => {
        //do something 返回bool值
      })
    },
    storeChange() {
      console.log(this.uuid);
    }
  }
```
------------
## 更新记录
**2.0.03**
1.搜索情况下的全选，接口新加了字段
**2.0.01**
1.新增storeChange方法，给列表过滤条件使用
**1.2.9**
1.针对多个人群筛选器作兼容 新增prop: flag
**1.2.8**
1.按钮名称由关闭改为确定
**1.2.7**
1.修改交互，增加了弹窗底部操作按钮

**1.2.6**
1.新增集团维度门店选择器 vue-gic-store-group 用法跟商户维度一样

**1.2.5**
1.修改了一些bug

**1.2.2**
1.增加了拷贝接口，解决删除不正确问题


**1.2.1**
1.增加临时缓存id
2.修改了逻辑


**1.1.9**
1.优化卡券门店组件
2.接口配置项返回中文


**1.1.8**
1.新增获取当前门店的配置项接口
```
this.refs.storeNew.getStoreConfig().then(data => {
   this.storeConfig = data;
      // data返回示例：{list:[{id:'1',name:'名称'}],type:1}
})
```


**1.1.6**
1. 部门门店左侧增加分页功能
2. 卡券门店选择增加分页功能
3. 门店类型bug修复


**1.1.4**
1. 门店类型，修改保存逻辑，勾选即保存。
2. 取消 标签，分组，类型，部分门店 确定取消按钮
3. 增加卡券门店组件判断保存时右侧列表是否为空
4. 标签，部分门店 右侧搜索bug修复
5. 样式修改
```
this.refs.storeCard.getRightList(length => {
   length// 列表数量
})
```
判断门店选择是否为空（isStoreSave）的使用说明
1.遍历情况下的flag，使用async await
```
async getFlagStatus() {
  let flag = true;
  for (let i in list) {
    if (list[i] === 1) {
     flag = await this.refs.storeNew.isStoreSave();
    }
  }
  if (!flag) return;
}
```
2.如果取不到 isStoreSave，检查 refs.storeNew是否为数组，如果是数组，遍历执行函数
```
async getFlagStatus() {
  let flag = true;
  if (this.refs.storeNew instanceof Array) {
    let list = this.refs.storeNew;
    for (let i in list) {
      flag = await list[i].isStoreSave();
    }
  } else if (this.refs.storeNew instanceof Object) {
    flag = await this.refs.storeNew.isStoreSave();
  }
  if (!flag) return;
}
```



**1.1.3**

1. 门店标签，门店分组增加分页功能
2. 门店区域回显市数量修正
3. 增加门店分组左侧默认选中
4. 标签，分组，部分门店增加确定取消按钮



**1.1.1**
1. 增加了门店是否保存的方法 。返回promise对象，flag为true or false ，true已保存，false未保存
2. 使用场景： 最终保存时可能需要判断门店选择是否为空
```
this.refs.storeNew.isStoreSave().then(flag => {
  //do something
})
```

**1.1.0**
1. 修复了新增未传key的bug
2. 修改了门店类型删除不成功bug
3. 修改了门店区域显示问题
4. 修改了一些样式

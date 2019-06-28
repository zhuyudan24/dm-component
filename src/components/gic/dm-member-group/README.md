
```
<vue-gic-member-group
  :defaltSelected="defaltSelected"
  :height='height'
  :projectName="projectName"
  :headerList='headerList'
  :effectiveStatus="effectiveStatus"
  :max-limit="maxLimit"
  @handleDataTransferred="handleDataTransferred"
  @handleDataLeft="handleDataLeft">
</vue-gic-member-group>

data() {
  return {
    // 可传参数
    defaltSelected: [{
      appStatus: null,
      createTime: 1543980512000,
      describle: "所属服务门店",
      effectiveDate: "2019-12-05 23:59:59",
      effectiveDateTmp: null,
      effectiveStatus: 1,
      enterpriseId: "ff8080815dacd3a2015dacd3ef5c0000",
      groupName: "所属服务门店",
      isRealTime: 1,
      latestUpdateTime: null,
      latestUpdateTimeTmp: null,
      memberCount: 38,
      memberTagGroupId: "1b2fedcf46884c4d99c0d21565d6c149",
      sortColName: "update_time",
      sortType: "desc",
      status: 1,
      updateDay: null,
      updateTime: 1544010117000,
      updateType: null
    }], //  默认穿梭窗已选入数据 groupName, isRealTime必传， 其他若无需求可不传
    height： 200, // 穿梭窗高度， 默认是543
    projectName： 'memberTag', // 默认是memberTag
    headerList: ['isRealTime', 'latestUpdateTime', 'updateType', 'effectiveStatus', 'effectiveDate'] // 表头配置，默认全部，分组名称默认显示不可配置
    effectiveStatus: 1, // 不传： 所有状态 1： 有效 0： 失效
    maxLimit: 10
  }
}

methods: {
  /**
   * 选择分组后子组件触发的事件
   */

  /**
   * selectedData 穿梭窗已选入数据
   * selectionToTransfer 本次选择的数据
  */
  handleDataTransferred(data) {
    const that = this
  },

  /**
   * selectedData 剔除后剩下的数据
   * selectionToRemove 剔除的数据
  */
  handleDataLeft(selectedData, selectionToRemove) {

  }
},
```



### 更新记录
#### 2.2.1 2019/5/27
1. 添加配置可选分组上限限制的功能

#### 2.1.1 2019/5/23
1. 增加下拉列表选择分组的功能
2. 增加刷新会员列表的功能
3. 增加新建会员分组的按钮，点击跳转到新建会员分组页面

#### 2.0.01 2019/2/28
1. 处理了去重问题

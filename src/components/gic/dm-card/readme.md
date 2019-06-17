# vue 插件 --- 卡券选择 1.0.49
```
旧弹框（不显示已过期数据，筛选条件为卡券名）
<div @click="showCard"&点击弹窗</div>
<dm-card :disabledList="disabledList" :projectName="projectName" :showCardDialog="showCardDialog" :cardLimit="cardLimit" :cardType="cardType" @selectCard="">
</dm-card>
data() {
  return {
    // 可传参数
	projectName: '', //当前项目名
    showCardDialog: false,
    cardLimit: 1, //卡券限制类型 1-限制领取1张的卡券 2- 限制领取 1~100的卡券 3-限制领取&=100 的卡券
    cardType: null, //卡券类型集合（0：抵金券，1：折扣券，2：兑换券）null-为全部类型 逗号分隔
	dis

methods: {
    // 显示卡券弹窗
    showCard() {
      var that = this
      that.showCardDialog = true;
    },

    // 子组件触发方法
    selectCard(val) {
      // 模拟检查数据
      console.log(val)
      var that = this
      that.showCardDialog = false;
    }
},
```
更新日志：

2.0.02 type=2 列表包含过期卡券，增加筛选条件

1.0.49 修改了一个显示问题

1.0.48 修改了样式

1.0.46 修复一个props传值的bug

1.0.45 优化卡券限制提示文案

1.0.44 增加disabledList属性 Array ，禁用卡券列的coupCardId集合

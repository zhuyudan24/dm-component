
```
<marketing-event ref="marketingEvent" @has-card="hasCard"  :ecmPlanId="ecmPlanId" :isSupportVar="isSupportVar" :code="code" :enabledMessageState="enabledMessageState"></marketing-event>
data() {
  return {
    // 参数
	isSupportVar:true, //文本组件是否支持变量
	enabledMessageState:true, // 能否添加短信
    ecmPlanId:'',  // 必传,
     //  页面编码——- 1001-智能引擎; 1002-微信营销; 1003-被关注回复; 1004-关键字回复
    code:'', /默认为1001
  },
}
  methods:{
  		// 是否包含短信组件
	  hasCard(val) {

	  }
  }

```


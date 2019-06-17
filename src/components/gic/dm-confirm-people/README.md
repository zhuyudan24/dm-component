
```
<vue-gic-confirm-people @get-data="getData" :list="list"></vue-gic-confirm-people>
data() {
  return {
    // 可传参数
    list:[],  //对象数组
    idType:'',  //获取的属性，如果需要拿memberId 传'memberId'，默认为openid:'',
    onlyWxMember:1, // 获取数据类型  仅为微信会员传1   不限制传0
  }
}

methods: {
    //获取指定会员  字符串数组
    getData(val) {
      console.log(val)
    },
},
```


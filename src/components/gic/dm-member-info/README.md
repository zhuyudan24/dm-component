```
<vue-member-info :memberObj="memberObj" :requestProject="requestProject" :placement="placement"></vue-member-info

data() {
  return {
    // 可传参数
    	requestProject: 'integral-mall', // 当前项目名
      memberObj: {
        memberName: '测试', //会员名称
        memberImgUrl: 'http://thirdwx.qlogo.cn/mmopen/j7nX4OeBsXQ1nMEeRfexOUHXAGqpXnEicnlJUwWY1G6bDAujuopIY8rWGXSWAyb9cQgfSqicaIhkRUxmS6byCemQ3Eark1s23O/0', //会员头像
        memberId: 'ff80808163b9f0610163ba4f63cc004f' //会员id
      },
      placement: 'top-start' //显示位置
  }
}

methods: {

},
```


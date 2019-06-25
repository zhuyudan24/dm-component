# vue 插件—-门店选择联动

> A Vue.js Store select Plugin


## Install
```shell
npm install @gic-test/vue-gic-store-linkage -S
```

## how to use
```
// main.js
import vueGicStoreLinkage from '@gic-test/vue-gic-store-linkage'
Vue.use(vueGicStoreLinkage)

// 使用页面
<vue-gic-store-linkage :msg="sendChildData" ref="selectTree" @sendSelectGroupData="getSelectGroupData"></vue-gic-store-linkage>


data() {
  return {
    // 可传参数
    sendChildData:{},  // 向子元素传递的对象
  }
}


methods: {
   //获得子元素传递的数据
    getSelectGroupData() {
      console.log(val)
    }
},
```


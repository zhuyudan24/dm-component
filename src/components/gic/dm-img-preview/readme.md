```
<img :src="src" alt="img" @mouseover="showImage(src)"/> // 图片所在标签, 图片 src 参数随各个调用地方

<vue-gic-img-preview :imgUrl="imgUrl" :imgShowFlag="imgShowFlag" @hideImage="hideImage"></vue-gic-img-preview>

data() {
  return {
    // 可传参数
    imgShowFlag: false, // 是否弹框显示,true: 显示；false: 不显示
    imgUrl: '', // 传递的图片 src
  }
}

methods: {
  showImage(src) {
    var that = this
    if(!src || src == ''){
      return false;
    }
    that.imgShowFlag = true;
    that.imgUrl = src;
  },
  hideImage(val) {
    var that = this
    that.imgShowFlag = val
  }
},
```


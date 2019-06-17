
```
<div class="member-upload-image">
   <vue-gic-upload-image
      :projectName="projectName"
      :wxFlag="wxFlag"
      :actionUrl="actionUrl"
      :imageList="imageList"
      :limitW="limitW"
      :limitH="limitH"
      :maxImageLength="maxlength"
      @uploadOnSuccess="uploadOnSuccess"
      @sortImg="sortImg"
      @deleteImage="deleteImage">
   </vue-gic-upload-image>
</div>

data() {
  return {
      projectName: 'gic-web', // 当前项目名(必传参数)
      wxFlag: '1', // '1': 表示需要返回微信图片地址(可选参数),插件内已默认 '1'
      imgRate: '1:2', // 限制图片上传比例 如 '1:1' (可选参数),各个调用地方可能不同,(比例和限制宽高是二选一的,如果都不传参数,表示不限制)
      limitW: 500, // 上传图片的限制宽度(数字),(可选参数),各个调用地方可能不同
      limitH: 500, // 上传图片的限制高度(数字),(可选参数),各个调用地方可能不同
      actionUrl: '/api-plug/upload-img', // 必选参数，上传的相对地址 String 类型,切勿硬编码写死地址
      maxlength: 5, // 图片数量 默认 5
      imageList: [] // 是否显示已上传文件列表
  }
},
methods: {
  // 上传成功 返回的图片对象 里面有图片 大小 类型 等相关信息
  uploadOnSuccess(obj) {
    // 目前返回两个参数 {res:res,file:file}
    obj.file.url = obj.res.result[0].qcloudImageUrl
    this.imageList.push(obj.file);
  },
  // 删除图片 返回图片列表的索引 你可以根据这个索引去找对应图片的id
  deleteImage(i) {
    this.imageList.splice(i, 1);
  },

  // 排序图片
  sortImg(val) {
    this.imageList = val;
  }
}
```

## logs

- 20181015
  - 增加上传图片限制宽高参数
  - 增加上传图片限制宽高比例参数
  - 增加当前项目名参数
  - 增加需要返回微信图片地址参数
  - 增加上传图片前回调及宽高判断,宽高比例判断
  - 增加上传成功判断及传递参数修改
  - 修复上传地址参数及回调错误
  - 修复上传成功触发函数错误

- 20181012
  - 增加上传图片拖拽
  - 修改原有数据传递代码逻辑,增加拖拽排序后方法

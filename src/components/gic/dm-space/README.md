### Vue-upload-folder



vue-upload-folder 是一个支持拖拽上传文件夹的vue组件。可以文件夹嵌套文件夹。 基于dropzonejs（感谢dropzone.js）。组件是满足公司的业务 剥离出来的组件。里面有的逻辑是配合业务写的。详细API的可以看dropzone的文档



> 基本用法



```vue
    <vue-gic-space
      id="dropzone"
      ref="myDropzone"
      :parentId="parentId"
      :action="folderUrl"
      :options="dropzoneOptions"
      :useCustomSlot="true">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将突破或者文件夹拖拽到此处上传，或者点击<em>上传</em>批量上传图片</div>
    </vue-gic-space>


<script>
    export default {
        data() {
            return {
                  dropzoneOptions: {
                    autoProcessQueue: false, // 不自动上传 文件夹上传要用
                    url: 'xx', // 上传图片地址
                  },
                  parentId: 'xxx', // 如果你拖动文件夹里面还有图片 那要传一个id 
                  folderUrl: 'xx' // 创建文件夹的地址
            };
        }  
    };
</script>
```


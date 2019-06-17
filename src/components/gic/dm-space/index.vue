<template>
  <div :id="id" ref="dropzoneElement" :class="{ 'vue-dropzone dropzone': includeStyling }">
    <div v-if="useCustomSlot" class="dz-message" ref="renderMessage">
      <slot>Drop files here to upload</slot>
    </div>
  </div>
</template>

<script>
import Dropzone from 'dropzone';
import urlpoint from './passUrl';
import { log } from '@/utils/index.js';
Dropzone.autoDiscover = false;

export default {
  name: 'vue-gic-space',

  props: {
    // 组件定义的id值 默认 dropzone
    id: {
      type: String,
      required: true,
      default: 'dropzone'
    },
    action: String,
    requestProject: String,
    parentId: String,
    options: {
      type: Object
    },
    includeStyling: {
      type: Boolean,
      default: true
    },
    requestParams: {
      type: Object,
      default: null
    },
    // 销毁dropzone
    destroyDropzone: {
      type: Boolean,
      default: true
    },
    useCustomSlot: {
      type: Boolean,
      default: false
    },
    awss3: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      wasQueueAutoProcess: true,
      idList: []
    };
  },

  computed: {
    dropzoneSettings() {
      // 设置默认宽高
      let defaultValues = {
        thumbnailWidth: 200,
        thumbnailHeight: 200
      };
      // eslint-disable-next-line
      this.options.parallelUploads = 1000;
      Object.keys(this.options).forEach(function(key) {
        defaultValues[key] = this.options[key];
      }, this);
      return defaultValues;
    }
  },

  created() {
    this.folder = [];
    this.folderId = [];
    this.folderName = [];
    this.picName = [];
    // 如是上传单张图片
    this.singlePic = false;
    this.parentIdList = [];
    this.uploadFolder = [];
    this.uploadFlag = false;

    this.requestUrl = window.location.origin;
    this.requestUrl = this.requestUrl.includes('localhost') ? 'http://gicdev.com' : this.requestUrl;
  },

  mounted() {
    this.filetypes = ['gif', 'png', 'jpg', 'jpeg'];
    this.limitSize = 1024 * 1024;
    this.removeFlag = false;
    this.hasBeenMounted = true;
    this.dropzone = new Dropzone(this.$refs.dropzoneElement, this.dropzoneSettings);
    let that = this;

    // 生成缩略图 接收url
    this.dropzone.on('thumbnail', function(file, dataUrl) {
      that.$emit('vdropzone-thumbnail', file, dataUrl);
    });

    // 将文件添加到上传列表
    this.dropzone.on('addedfile', file => {
      // 如果有fullPath 表示有文件夹
      if (file.fullPath) {
        const path = file.fullPath.split('/');
        this.folder = this.singleFolder(path, 0, this.folder);
      }
      // 限制上传的格式
      let filetype = file.type.split('/')[1];
      if (!this.filetypes.includes(filetype)) {
        this.$message.warning(`您上传的是${filetype}格式，只接收png、jpg、gif的格式`);
        this.removeFile(file);
        return;
      }

      // 限制大小
      if (Math.floor(file.size / this.limitSize) >= 5) {
        this.$message.warning(`上传的图片超过5M最大限制，请先压缩再上传！`);
        this.removeFile(file);
        return;
      }

      if (!this.uploadFlag) {
        // 先把树形结构组装起来
        this.uploadFlag = true;
        setTimeout(() => {
          this.deepUpload(this.folder, this.parentId);
        }, 100);
        setTimeout(_ => {
          this.dropzone.processQueue();
        }, 1500);
      }

      if (this.$refs.renderMessage.style.display === 'block') {
        this.$refs.renderMessage.style.display = 'none';
      }
      // eslint-disable-next-line
      let isDuplicate = false;
      if (that.duplicateCheck) {
        if (this.files.length) {
          let $i;
          let $len;

          for ($i = 0, $len = this.files.length; $i < $len - 1; $i++) {
            if (this.files[$i].name === file.name && this.files[$i].size === file.size && this.files[$i].lastModifiedDate.toString() === file.lastModifiedDate.toString()) {
              this.removeFile(file);
              isDuplicate = true;
              that.$emit('vdropzone-duplicate-file', file);
            }
          }
        }
      }

      that.$emit('vdropzone-file-added', file);

      if (that.isS3 && that.wasQueueAutoProcess) {
        that.getSignedAndUploadToS3(file);
      }
    });

    this.dropzone.on('sending', (file, xhr, formData) => {
      // 找id根据名字
      if (file.fullPath) {
        const pathArr = file.fullPath.split('/');
        const LEN = pathArr.length - 2;
        const id = this.findId(this.folder, pathArr, 0, LEN);
        formData.append('parentId', id);
      } else {
        formData.append('parentId', this.parentId);
      }
    });

    // 将多文件添加到上传列表
    this.dropzone.on('addedfiles', files => {
      // 如果是拖动上传文件夹和图片 或者多个图片
      this.$emit('vdropzone-files-added', files);
    });

    // 移除上传文件
    this.dropzone.on('removedfile', function(file) {
      that.$emit('vdropzone-removed-file', file);
      if (file.manuallyAddFile) that.dropzone.options.maxFiles++;
    });

    // this.dropzone.on('success', (file, response) => {
    //   that.$emit('vdropzone-removed-file', file);
    //   if (file.manuallyAddFile) that.dropzone.options.maxFiles++;
    // });

    this.dropzone.on('success', (file, response) => {
      // 上传成功之后 删除之前的点
      if (response.errorCode == 1) {
        this.$message.error('已存在该图片，同名图片不允许上传！');
      } else {
        this.$message.success('上传成功');
      }
      setTimeout(() => {
        // 移除上传成功的图片
        file.previewElement.parentNode.removeChild(file.previewElement);
        if (!document.querySelector('.dz-preview') && this.$refs.renderMessage.style.display !== 'block') {
          this.$refs.renderMessage.style.display = 'block';
        }
      }, 100);

      that.$emit('vdropzone-success', file, response);
      if (that.isS3) {
        if (that.isS3OverridesServerPropagetion) {
          // eslint-disable-next-line
          let xmlResponse = new window.parseDOM().parseFormString(response, 'text/xml');
          let s3ObjectLocation = xmlResponse.firstChild.children[0].innerHTML;
          that.$emit('vdropzone-s3-upload-success', s3ObjectLocation);
        }
        if (that.wasQueueAutoProcess) {
          that.setOption('autoProcessQueue', false);
        }
      }
    });

    this.dropzone.on('successmultiple', function(file, response) {
      that.$emit('vdropzone-success-multiple', file, response);
    });

    // 上传失败的操作
    this.dropzone.on('error', (file, message, xhr) => {
      this.$message.error('上传失败');
      setTimeout(() => {
        // 移除上传成功的图片
        file.previewElement.parentNode.removeChild(file.previewElement);
        if (!document.querySelector('.dz-preview') && this.$refs.renderMessage.style.display !== 'block') {
          this.$refs.renderMessage.style.display = 'block';
        }
      }, 100);
      this.$emit('vdropzone-error', file, message, xhr);
      if (this.isS3) {
        that.$emit('vdropzone-s3-upload-error');
      }
    });

    this.dropzone.on('errormultiple', (file, message, xhr) => {
      that.$emit('vdropzone-error-multiple', file, message, xhr);
    });

    this.dropzone.on('sendingmultiple', function(file, xhr, formData) {
      that.$emit('vdropzone-sending-multiple', file, xhr, formData);
    });

    this.dropzone.on('complete', file => {
      this.uploadFlag = false;
      this.folder.length = 0;
      setTimeout(() => {
        // 移除上传成功的图片
        file.previewElement && file.previewElement.parentNode && file.previewElement.parentNode.removeChild(file.previewElement);
        if (!document.querySelector('.dz-preview') && this.$refs.renderMessage.style.display !== 'block') {
          this.$refs.renderMessage.style.display = 'block';
        }
      }, 100);
      setTimeout(() => {
        that.$emit('upload-complete', file);
      }, 1000);
    });

    this.dropzone.on('canceled', function(file) {
      that.$emit('vdropzone-canceled', file);
    });

    this.dropzone.on('processing', function(file) {
      that.$emit('vdropzone-processing', file);
    });

    this.dropzone.on('uploadprogress', function(file, progress, bytesSent) {
      that.$emit('vdropzone-upload-progress', file, progress, bytesSent);
    });

    this.dropzone.on('reset', function() {
      that.$emit('vdropzone-reset');
    });

    this.dropzone.on('queuecomplete', function(file) {
      that.$emit('vdropzone-queue-complete');
    });

    // 拖动到框之后
    this.dropzone.on('drop', function(event) {
      that.$emit('vdropzone-drop', event);
    });

    that.$emit('vdropzone-mounted');
  },

  beforeDestroy() {
    if (this.destroyDropzone) this.dropzone.destroy();
  },

  methods: {
    manuallyAddFile: function(file, fileUrl) {
      file.manuallyAdded = true;
      this.dropzone.emit('addedfile', file);
      let containsImageFileType = false;

      if (fileUrl.indexOf('.png') > -1 || fileUrl.indexOf('.jpg') > -1 || fileUrl.indexOf('.jpeg') > -1) {
        containsImageFileType = true;
      }
      if (this.dropzone.options.createImageThumbnails && containsImageFileType && file.size <= this.dropzone.options.maxThumbnailFilesize * 1024 * 1024) {
        fileUrl && this.dropzone.emit('thumbnail', file, fileUrl);
        let thumbnails = file.previewElement.querySelectorAll('[data-dz-thumbnail]');
        for (let i = 0; i < thumbnails.length; i++) {
          thumbnails[i].style.width = this.dropzoneSettings.thumbnailWidth + 'px';
          thumbnails[i].style.height = this.dropzoneSettings.thumbnailHeight + 'px';
          thumbnails[i].style['object-fit'] = 'contain';
        }
      }
      this.dropzone.emit('complete', file);
      if (this.dropzone.options.maxFiles) this.dropzone.options.maxFiles--;
      this.dropzone.files.push(file);
      this.$emit('vdropzone-file-added-manually', file);
    },

    setOption: function(option, value) {
      this.dropzone.options[option] = value;
    },

    removeAllFiles: function(bool) {
      this.dropzone.removeAllFiles(bool);
    },

    processQueue: function() {
      let dropzoneEle = this.dropzone;
      if (this.isS3 && !this.wasQueueAutoProcess) {
        this.getQueuedFiles().forEach(file => {
          this.getSignedAndUploadToS3(file);
        });
      } else {
        this.dropzone.processQueue();
      }
      this.dropzone.on('success', function() {
        dropzoneEle.options.autoProcessQueue = true;
      });

      this.dropzone.on('queuecomplete', function() {
        dropzoneEle.options.autoProcessQueue = false;
      });
    },
    // 初始化
    init: function() {
      return this.dropzone.init();
    },

    // 销毁实例
    destroy: function() {
      return this.dropzone.destroy();
    },

    removeEventListeners: function() {
      return this.dropzone.removeEventListeners();
    },

    disable: function() {
      return this.dropzone.disable();
    },

    accept: function(file, done) {
      return this.dropzone.accept(file, done);
    },

    addFile: function(file) {
      return this.dropzone.addFile(file);
    },

    removeFile: function(file) {
      this.dropzone.removeFile(file);
    },

    getAcceptedFiles: function() {
      return this.dropzone.getAcceptedFiles();
    },

    getRejectedFiles: function() {
      return this.dropzone.getRejectedFiles();
    },

    getQueuedFiles: function() {
      return this.dropzone.getQueuedFiles();
    },
    getUploadingFiles: function() {
      return this.dropzone.getUploadingFiles();
    },
    getAddedFiles: function() {
      return this.dropzone.getAddedFiles();
    },
    getActiveFiles: function() {
      return this.dropzone.getActiveFiles();
    },
    getSignedAndUploadToS3(file) {
      let promise = urlpoint.sendFile(file, this.awss3, this.isS3OverridesServerPropagation);
      if (!this.isS3OverridesServerPropagation) {
        promise.then(response => {
          if (response.success) {
            file.s3ObjectLocation = response.message;
            setTimeout(() => this.dropzone.processFile(file));
            this.$emit('vdropzone-s3-upload-success', response.message);
          } else {
            if ('undefined' !== typeof response.message) {
              this.$emit('vdropzone-s3-upload-error', response.message);
            } else {
              this.$emit('vdropzone-s3-upload-error', 'Network Error : Could not send request to AWS. (Maybe CORS error)');
            }
          }
        });
      } else {
        promise.then(() => {
          setTimeout(() => this.dropzone.processFile(file));
        });
      }
      promise.catch(error => {
        log(error);
      });
    },
    setAWSSigningURL(location) {
      if (this.isS3) {
        this.awss3.signingURL = location;
      }
    },
    singleFolder(newPath, level, folder) {
      let sum = 0;
      const ret = JSON.parse(JSON.stringify(folder));
      // newPath[level] 不能跟folder名字相同
      if (!newPath[level].includes('.')) {
        // 如果不是空文件夹
        if (ret.length) {
          // 如果里面有就添加到当前下面 没有就添加到这一层
          for (let i = 0; i < ret.length; i++) {
            if (newPath[level] == folder[i].name) {
              if (newPath[level + 1]) {
                ret[i].children = this.singleFolder(newPath, level + 1, ret[i].children);
                return ret;
              }
            } else {
              sum++;
            }
          }
          // 如果能走到这里就表示不相等
          if (sum == ret.length) {
            const node = {
              children: [],
              isDir: true,
              name: newPath[level],
              level
            };
            ret.push(node);
            if (newPath[level + 1]) {
              node.children = this.singleFolder(newPath, level + 1, node.children);
            }
          }
        } else {
          const node = {
            children: [],
            isDir: true,
            name: newPath[level],
            level
          };
          ret.push(node);
          // 看后面还有没有元素
          if (newPath[level + 1]) {
            node.children = this.singleFolder(newPath, level + 1, node.children);
          }
        }
      } else {
        const node = {
          isDir: false,
          name: newPath[level],
          level
        };
        ret.push(node);
      }
      return ret;
    },

    // 查找id
    findId(list, arr, level, len) {
      let id;
      let i = 0;
      while (i < list.length) {
        if (list[i].name == arr[level]) {
          if (level == len) {
            id = list[i].parentId;
            return id;
          }
          if (arr[level + 1] && !arr[level + 1].includes('.')) {
            id = this.findId(list[i].children, arr, level + 1, len);
          }
        }
        i++;
      }
      return id;
    },

    deepUpload(folder, returnParentId) {
      // 如果存在文件夹
      folder.forEach(item => {
        if (item.isDir) {
          this.uploadFolder[item.level] = this.uploadFolder[item.level] || [];
          const id = item.parentId ? item.parentId : returnParentId;
          // 不存在就开始上传
          this.axios
            .get(
              `
              ${this.action}&parentId=${id}&groupName=${item.name}
              `
            )
            .then(res => {
              if (res.data) {
                if (res.data.errorCode === 0) {
                  // 成功之后返回的 parentId 添加到
                  const returnParentId = res.data.result.id;
                  item.parentId = returnParentId;
                  if (item.children && item.children.length) {
                    setTimeout(() => {
                      this.deepUpload(item.children, returnParentId);
                    }, 0);
                  }
                } else if (res.data.errorCode === 1) {
                  this.$message.error('已存在该文件夹！');
                  this.uploadFlag = false;
                  this.folder.length = 0;
                  this.removeAllFiles(true);
                  return;
                }
              }
            });
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import url('../../../../node_modules/dropzone/dist/dropzone.css');

.vue-dropzone {
  width: 500px;
  height: 225px;
  overflow: hidden;
  border: 1px dashed #e5e5e5;
  font-family: 'Arial', sans-serif;
  letter-spacing: 0.2px;
  color: #777;
  transition: background-color 0.2s linear;
  &:hover {
    background-color: #f6f6f6;
  }
  i {
    color: #ccc;
  }
  .dz-preview {
    .dz-image {
      img:not([src]) {
        width: 200px;
        height: 200px;
      }
      &:hover {
        img {
          transform: none;
          -webkit-filter: none;
        }
      }
    }
    .dz-details {
      bottom: 0;
      top: 0;
      color: white;
      background-color: rgba(33, 150, 243, 0.8);
      transition: opacity 0.2s linear;
      text-align: left;
      .dz-filename {
        overflow: hidden;
      }
      .dz-filename span,
      .dz-size span {
        background-color: transparent;
      }
      .dz-filename:not(:hover) span {
        border: none;
      }
      .dz-filename:hover span {
        background-color: transparent;
        border: none;
      }
    }
    .dz-progress .dz-upload {
      background: #4094ff;
    }
    .dz-remove {
      position: absolute;
      z-index: 30;
      color: white;
      margin-left: 15px;
      padding: 10px;
      top: inherit;
      bottom: 15px;
      border: 2px white solid;
      text-decoration: none;
      text-transform: uppercase;
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 1.1px;
      opacity: 0;
    }
    &:hover {
      .dz-remove {
        opacity: 1;
      }
    }
    .dz-success-mark,
    .dz-error-mark {
      margin-left: auto;
      margin-top: auto;
      width: 100%;
      top: 20%;
      left: 0;
      svg {
        margin-left: auto;
        margin-right: auto;
      }
    }
    .dz-error-message {
      top: calc(15%);
      margin-left: auto;
      margin-right: auto;
      left: 0;
      width: 100%;
      &:after {
        bottom: -6px;
        top: initial;
        border-top: 6px solid #a92222;
        border-bottom: none;
      }
    }
  }
  .el-icon-upload {
    font-size: 57px;
  }
  b {
    color: #4094ff;
  }
}
</style>

<template>
  <el-dialog title="添加小程序链接" :visible.sync="show" width="600px" class="add-replay-content" :before-close="close">
    <el-form label-position="right" ref="form" :model="form" label-width="100px">
      <el-form-item class="text-content" label="文本内容">
        <el-input v-model="form.title" @keyup.native="toInput(form.title, $event)"></el-input>
        <span class="text-num">{{ inputNum }}/{{ inputLength }}</span>
      </el-form-item>
      <div class="content-wrap">
        <div class="xcx-content-wrap">
          <el-form-item label="上传图片">
            <div class="upload-content">
              <el-upload class="avatar-uploader" action="123" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <p>请上传长宽比为5:4的图片</p>
            </div>
          </el-form-item>

          <el-form-item label="链接类型" class="url-link-wrap" style="margin-bottom: 0">
            <el-select @change="changePreValue" v-model="preValue" class="w200" placeholder="请选择" style="margin-right: 6px;">
              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-select v-if="preValue" @change="changeNextValue" class="w200" v-model="nextValue" placeholder="请选择">
              <el-option v-for="item in options2" :key="item.linkId" :label="item.name" :value="item.linkId"> </el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">关 闭</el-button>
      <el-button type="primary" @click="addItem">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getByteVal, getZhLen } from '../assets/utils.js';
import { log } from '@/utils/index.js';
import qs from 'qs';
export default {
  name: 'lib-wxa',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      form: {
        title: '',
        linkStyle: '0',
        url: '',
        imageUrl: '',
        mediaId: ''
      },
      inputNum: 0, // 输入文字个数(两个字母/汉字算一个字)
      inputLength: 20, // 限制最大字数
      preValue: '',
      nextValue: '',
      options1: [
        {
          value: 3,
          label: '导航tabbar页'
        },
        {
          value: 4,
          label: '二级功能页'
        }
      ],
      options2: [],
      wechatContent: {}
    };
  },
  watch: {
    show(val) {
      this.form = {
        title: '',
        linkStyle: '0',
        url: '',
        imageUrl: '',
        mediaId: ''
      };
      this.preValue = '';
      this.nextValue = '';
      this.wechatContent = {};
      if (val && this.item.ecmMarketingTypeRelationId) {
        this.form = JSON.parse(JSON.stringify(this.item));
        log('编辑', this.item);
        const pagePath = this.form.pagePath ? JSON.parse(this.form.pagePath) : {};
        this.wechatContent.type = pagePath.type;
        this.wechatContent.objId = '';
        this.wechatContent.title = pagePath.title;
        this.wechatContent.pageType = pagePath.pageType;
        this.preValue = pagePath.pageType;
        this.getNextList(this.preValue).then(res => {
          this.nextValue = pagePath.type;
        });
      }
    }
  },
  methods: {
    toInput(value, e) {
      // 控制字符数量
      var that = this;
      that.form.title = getByteVal(e.target.value, that.inputLength);
      that.inputNum = getZhLen(that.form.title);
    },
    handleAvatarSuccess(res, file) {
      //
    },
    beforeAvatarUpload(file) {
      // log(file)
      let fd = new FormData();
      fd.append('file', file);
      fd.append('requestProject', 'gic-web');
      this.axios.post('/api-admin/marketing-wechat-image-save', fd).then(res => {
        //成功后回调
        var data = res.data;
        // log(data);
        if (data.errorCode == 0) {
          this.form.imageUrl = data.result.qcloudImageUrl;
          this.form.mediaId = data.result.imageMediaId;

          this.$message({
            type: 'success',
            message: '上传成功'
          });
        } else {
          this.$message({
            type: 'error',
            message: data.message
          });
        }
      });
      return true;
    },
    // 链接类型
    changePreValue(val) {
      // val==3  导航tabbar页 val==4 二级功能页
      if (val) {
        this.nextValue = '';
        this.getNextList(val);
      }
    },
    changeNextValue(val) {
      if (val) {
        let obj = {};
        obj = this.options2.find(style => {
          return style.linkId === val;
        });
        this.wechatContent.type = obj.linkId;
        this.wechatContent.objId = '';
        this.wechatContent.title = obj.name;
        this.wechatContent.pageType = this.preValue;
      }
    },
    // 获得链接类型的二级
    getNextList(type) {
      return new Promise((resolve, reject) => {
        this.axios
          .post(
            '/api-plug/list-link-data',
            qs.stringify({
              requestProject: 'gic-web',
              linkScene: parseInt(type)
            })
          )
          .then(res => {
            //成功后回调
            var data = res.data;
            log(data);
            if (data.errorCode == 0) {
              this.options2 = data.result;
              resolve();
            } else {
              this.$message({
                type: 'error',
                message: data.message
              });
            }
          });
      });
    },
    addItem() {
      let sendData = {
        ecmMarketingTypeRelationId: this.item.ecmMarketingTypeRelationId,
        comName: 'wxa',
        title: this.form.title,
        mediaId: this.form.mediaId,
        pagePath: JSON.stringify(this.wechatContent)
      };
      if (!sendData.title) {
        this.$message({ type: 'warning', message: '简介未填写' });
        return;
      }
      if (!sendData.mediaId) {
        this.$message({ type: 'warning', message: '图片未上传' });
        return;
      }
      if (!sendData.pagePath) {
        this.$message({ type: 'warning', message: '链接选择' });
        return;
      }
      this.$emit('sendItem', sendData);
      this.close();
    },
    close() {
      this.$emit('update:show', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.add-replay-content {
  .text-content {
    position: relative;
    width: 400px;
    .text-num {
      position: absolute;
      right: 10px;
      bottom: 2px;
      color: #c0c4cc;
      font-size: 12px;
      background: #fff;
      height: 28px;
      line-height: 28px;
      padding-left: 10px;
    }
  }
  .link-url-warning {
    color: #909399;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    margin-top: 3px;
    position: absolute;
    top: 100%;
    left: 0;
  }
}
.xcx-content-wrap {
  width: 100%;
  .upload-content {
    > p {
      height: 36px;
      line-height: 36px;
      font-size: 12px;
      color: #b8b8b8;
    }
  }
}
.avatar-uploader {
  width: 152px;
  height: 152px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover {
    border-color: #1890ff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
.upload-content /deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.upload-content /deep/ .avatar-uploader .el-upload:hover {
  border-color: #1890ff;
}
</style>

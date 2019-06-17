<template>
  <section class="wx-text">
    <div class="wx-text__content">
      <div v-html="textarea" @keyup="textInput(textarea, $event)" ref="myTextarea" contenteditable="true" @blur="getTextValue"></div>
    </div>
    <div class="wx-text__opt clearfix">
      <a @click="addLink" class="iconfont icon-lianjie" title="添加链接"></a>
      <a @click="removeLink" class="iconfont icon-duankailianjie" title="取消链接"></a>
      <el-popover placement="top" trigger="hover" width="680" v-if="isSupportVar">
        <p>1.支持插入会员信息变量，如下表所示，{数字}为可插入变量，注意变量值长度，一面超过300字文本上限。</p>
        <p>2.支持插入H5链接；支持插入小程序链接。</p>
        <p>3.支持换行；不支持富文本格式。</p>
        <p>会员信息变量表：</p>
        <div class="clearfix">
          <ul class="fl pr10" v-for="(item, index) in 4" :key="index">
            <li v-for="(v, i) in options.slice(index * 7, (index + 1) * 7)" :key="i">{{ v.number + v.name }}</li>
          </ul>
        </div>
        <a @click="removeLink" class="iconfont icon-17" title="变量" slot="reference"></a>
      </el-popover>
      <span class="fr gray fz13">最多可输入300字，按下回车键换行</span>
    </div>
    <my-dialog :showWxApp="showWxApp" :show.sync="dialogShow" @urlInfo="getUrlInfo" :urlType.sync="urlType" :jumpUrlInfo.sync="jumpUrlInfo"></my-dialog>
  </section>
</template>

<script>
import qs from 'qs';
import myDialog from './dialog';
import { log, getByteVal2, getZhLen } from '@/utils/index.js';
const hrefReg = /href=['"]([^"]*)['"].*?/g;
export default {
  name: 'dm-text',
  components: {
    'my-dialog': myDialog
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    jumpUrlInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    urlType: {
      type: Boolean | String,
      default: 0
    },
    isSupportVar: {
      type: Boolean,
      default: false
    },
    showWxApp: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          // debugger
          log(val);
          this.textarea = val;
          this.computedTextLength();
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      textarea: '',
      dialogShow: false,
      appid: '',
      // eslint-disable-next-line
      options: require('./options.js'),
      textLength: 0
    };
  },
  created() {
    this.getAppid();
  },
  methods: {
    // 添加链接
    addLink() {
      this.getTextValue();
      this.$nextTick(_ => {
        log(this.$refs.myTextarea.innerHTML);
        this.hasATag(this.$refs.myTextarea.innerHTML, flag => {
          if (flag) {
            this.dialogShow = true;
          }
        });
      });
    },
    textInput(v, e) {
      // 控制微信文本的文字
      this.computedTextLength();
    },
    // 获取内容
    getTextValue() {
      const reg = /<(?!(a|\/a|div|\/div|br)).*?>/gim; // 只保留a 和 div 标签
      let text = this.$refs.myTextarea.innerHTML.replace(reg, '');
      text = text
        .replace(/<\/div>|&nbsp;/g, '')
        .replace(/<((div)).*?>/g, '<br>')
        .split('<br>')
        .filter(v => v)
        .join('<br>');
      this.textarea = text;
      this.$emit('update:value', text);
    },
    getUrlInfo(obj) {
      // log(obj)
      this.hasATag(this.textarea, flag => {
        if (flag) {
          if (obj.isWxApp) {
            this.textarea += `<a href="${obj.url}" data-miniprogram-appid="${this.appid}" data-miniprogram-path="${obj.url}">${obj.name}</a>`;
          } else {
            this.textarea += `<a href="${obj.url}">${obj.name}</a>`;
          }
          this.$emit('update:urlType', obj.urlType);
          this.$emit('update:jumpUrlInfo', { name: obj.name, url: obj.url });
          this.$emit('update:value', this.textarea);
        }
      });
    },

    // 辅助函数  是否有a标签
    hasATag(text, cb) {
      if (hrefReg.test(text)) {
        let hrefArr = text.match(hrefReg);
        if (hrefArr.length >= 1) {
          this.$message({ type: 'warning', message: '只能添加一个链接' });
          cb && cb(false);
        } else {
          cb && cb(true);
        }
      } else {
        cb && cb(true);
      }
    },
    getAppid() {
      this.axios
        .post(
          '/api-marketing/get-enterprise-wechat-appid',
          qs.stringify({
            requestProject: 'marketing'
          })
        )
        .then(res => {
          this.appid = res.data.result;
          log(res);
        });
    },
    // 清除a链接
    removeLink() {
      this.textarea = this.$refs.myTextarea.innerText.replace(/\n/g, '<br>');
      this.$emit('update:urlType', 0);
      this.$emit('update:jumpUrlInfo', { name: '', url: '' });
      this.$emit('update:value', this.textarea);
    },
    computedTextLength() {
      // this.textarea = this.$refs.myTextarea.innerHTML;
      return new Promise((resolve, reject) => {
        let textContent = getByteVal2(this.$refs.myTextarea.innerText);
        let textNum = getZhLen(textContent);
        log(textNum);
        if (textNum >= 300) {
          this.$message.error('最多300个字符哦');
          resolve(false);
        } else {
          resolve(true);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.wx-text {
  height: 200px;
  width: 600px;
  border: 1px solid #e7e7eb;
  border-radius: 4px;
  &__content {
    height: 160px;
    width: 600px;
    & > div {
      padding: 10px;
      height: 140px;
      width: 580px;
      overflow-x: hidden;
      outline: 0;
    }
  }
  &__opt {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    border-top: 1px solid #e7e7eb;
    & > a {
      padding-right: 10px;
      cursor: pointer;
    }
  }
}
</style>

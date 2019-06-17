<template>
  <el-dialog title="添加链接" :visible.sync="show" width="820px" :before-close="close" :append-to-body="true">
    <el-form label-width="80px">
      <el-form-item label="文本内容">
        <dm-input :maxlength="50" v-model="linkText" class="w300"></dm-input>
      </el-form-item>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="H5链接" name="0">
          <el-form-item label="链接类型">
            <el-radio-group v-model="h5Type">
              <el-radio :label="1">内部链接</el-radio>
              <el-radio :label="0">网址</el-radio>
            </el-radio-group>
          </el-form-item>
          <p class="pl20 pb20">已选择链接：{{ urlInfo.url || '--' }}</p>
          <innerUrl class="ml30" v-if="h5Type === 1" @sendRightUrl="getRightUrl" @sendLeftUrl="getLeftUrl" @sendShopData="getShopData"></innerUrl>
          <div class="ml30 clearfix" v-if="h5Type === 0">
            <el-input v-model="urlInfo.url" class="w300" @blur="checkUrl" placeholder="请输入网址 http或https开头"></el-input>
          </div>
        </el-tab-pane>
        <el-tab-pane label="小程序链接" name="1" v-if="showWxApp">
          <p class="pt10 pl20 pb20">已选择链接：{{ urlInfo.url || '--' }}</p>
          <linktoolspage ref="childlinktoolspage" :isWx="true" :activeName="true" :showType="2" @linkSelect="linkSelect" />
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue';
import qs from 'qs';
import innerUrl from '../innerUrl/innerUrl';
import linktoolspage from '../linktools/linktoolspage.vue';
import { log } from '@/utils/index.js';
/**
 * 验证是否为网址
 */
const checkUrl = function(urlString) {
  if (urlString != '') {
    let reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
    if (!reg.test(urlString)) {
      Vue.prototype.$message({ type: 'warning', message: '网址不规范，示例:http://www.domain.com' });
      return true;
    }
  } else {
    Vue.prototype.$message({ type: 'warning', message: '网址不规范，示例:http://www.domain.com' });
    return true;
  }
  return false;
};

export default {
  components: {
    innerUrl,
    linktoolspage
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    obj: {
      type: Object,
      default() {
        return {
          name: '',
          url: '',
          type: 1
        };
      }
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
    appendToBody: {
      type: Boolean,
      default: false
    },
    showWxApp: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    show(val) {
      // urlType: '0: 未选择URL;  1.H5链接;  2.小程序url链接
      if (val) {
        if (this.urlType == 1) {
          this.activeName = '0';
        } else if (this.urlType == 2) {
          this.activeName = '1';
        }
        this.linkText = this.jumpUrlInfo.name || '';
        this.urlInfo.url = this.jumpUrlInfo.url || '';
      }
    }
  },
  data() {
    return {
      linkText: '',
      activeName: '0',
      url: '',
      h5Type: 1,
      urlInfo: { name: '', url: '', isWxApp: false, urlType: 0 }
    };
  },
  methods: {
    close() {
      this.$emit('update:show', false);
    },
    async submit() {
      // 去除前后空格
      this.urlInfo.name = this.linkText.replace(/(^\s*)|(\s*$)/g, '');
      if (!this.urlInfo.name) {
        this.$tips({ type: 'warning', message: '链接文本不能为空' });
        return;
      }
      // 判断是否为小程序
      this.urlInfo.isWxApp = this.activeName == '1';
      // 判断链接类型
      this.urlInfo.urlType = this.activeName === '0' ? 1 : 2;
      // 如果是H5链接 需要转换
      if (this.activeName == '0' && this.h5Type === 1 && this.urlInfo.url.indexOf('https://open.weixin.qq.com/connect/oauth2/authorize') < 0) {
        let params = {
          url: this.urlInfo.url,
          requestProject: 'marketing'
        };
        let res = await this.axios.post('/api-marketing/change-to-WXUrl', qs.stringify(params));
        this.urlInfo.url = res.data.response.result;
      }
      this.$emit('urlInfo', this.urlInfo);
      this.close();
    },
    getRightUrl(data) {
      log(data);
      this.urlInfo = data;
    },
    getLeftUrl(data) {
      log(data);
    },
    getShopData(data) {
      // 获取选择的门店id
      log(data);
      this.urlInfo = data;
    },
    // linktoolspage
    linkSelect(val) {
      // 选择小程序链接的返回值
      if (val.url) {
        this.urlInfo.url = val.url;
      } else {
        this.urlInfo.url = 'pages/mall/mall-product-detail/mall-product-detail?proId=' + val.params.proId;
      }
    },
    checkUrl() {
      if (this.h5Type === 1 && checkUrl(this.url)) {
        this.url = 'http://www.domain.com';
        return;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.w300 {
  width: 300px;
}
.pb10 {
  padding-bottom: 10px;
}
.pl20 {
  padding-left: 20px;
}
</style>

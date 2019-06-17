<template>
  <el-dialog title="编辑文本" :visible.sync="show" width="640px" class="attention-text-wrap" :before-close="close">
    <wx-text :appendToBody="true" :value.sync="value" :urlType.sync="urlType" :jumpUrlInfo.sync="jumpUrlInfo" :isSupportVar="isSupportVar" ref="wxText"></wx-text>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">关 闭</el-button>
      <el-button type="primary" @click="addItem">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import wxText from '../wx-text/index.vue';
import { log } from '@/utils/index.js';
export default {
  name: 'lib-text',
  components: {
    'wx-text': wxText
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default() {
        return {
          content: '',
          urlType: '',
          jumpUrlInfo: '',
          ecmMarketingTypeRelationId: ''
        };
      }
    },
    isSupportVar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: '',
      ecmMarketingTypeRelationId: '',
      jumpUrlInfo: {
        name: '',
        url: ''
      },
      urlType: 0
    };
  },
  watch: {
    show(val) {
      if (val) {
        this.value = this.item.content;
        this.ecmMarketingTypeRelationId = this.item.ecmMarketingTypeRelationId || '';
        if (this.item.jumpUrlInfo) {
          try {
            this.jumpUrlInfo = JSON.parse(this.item.jumpUrlInfo);
            log(this.jumpUrlInfo);
            this.urlType = this.item.urlType || 0;
          } catch (err) {
            log(err);
          }
        } else {
          this.jumpUrlInfo = { name: '', url: '' };
          this.urlType = 0;
        }
      }
    }
  },
  methods: {
    close() {
      this.$emit('update:show', false);
    },
    addItem() {
      const that = this;
      this.$refs.wxText.getTextValue();
      this.$nextTick(_ => {
        async function asyncFunc() {
          let flag = await that.$refs.wxText.computedTextLength();
          if (!flag) return;
          if (!that.value) {
            that.$message({ type: 'warning', message: '请输入内容' });
            return;
          }
          that.$emit('sendItem', {
            comName: 'text',
            content: that.value.replace(/&amp;/g, '&'),
            ecmMarketingTypeRelationId: that.ecmMarketingTypeRelationId,
            urlType: that.urlType,
            jumpUrlInfo: that.jumpUrlInfo
          });
          that.$emit('update:show', false);
        }
        asyncFunc();
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>

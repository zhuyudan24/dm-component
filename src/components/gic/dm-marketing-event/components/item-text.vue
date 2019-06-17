<template>
  <!-- <span class="dm-text__wrap ellipsis-l2 inline-block" v-html="item.content"></span> -->
  <span class="dm-text__wrap inline-block" v-html="transfContent"></span>
</template>
<script>
import options from '../assets/options.js';
import { log } from '@/utils/index.js';
export default {
  name: 'item-text',
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    isSupportVar: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    transfContent() {
      // 替换{数字}为文本
      log(this.item);
      let val = this.item.content;
      if (this.isSupportVar) {
        val = val.replace(/\{(?:[1-9]|(1[0-9])?|2[0-8])\}/g, (...argument) => {
          let str = '';
          let arg = argument[0];
          log(arg);
          options.map(v => {
            if (v.number === arg) {
              str = v.name;
            }
          });
          return str;
        });
      }
      if (this.item.urlType === 2) {
        val = val.replace(/\<.*\>(.*)\<.*\>/g, (...argument) => {
          let str = '';
          let arg = argument[0];
          str = '<i class="iconfont icon-xiaochengxu blue"></i>' + arg;
          log(arg);
          return str;
        });
      }
      log(val);
      return val;
    }
  }
};
</script>

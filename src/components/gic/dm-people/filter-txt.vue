<template>
  <div class="filtertxt" v-if="templateArr.length > 0">
    <span v-if="templateArr.length === 1 && templateArr[0].length === 1">
      <span>(</span>
      <span v-for="(txt, i) in templateArr[0]" :key="'hash' + i.toString()" class="light-txt">{{ txt }}</span>
      <span>)</span>
    </span>

    <span v-if="templateArr.length === 1 && templateArr[0].length > 1">
      <span>(</span>
      <span v-for="(txt, i) in templateArr[0]" :key="'hash' + i.toString()">
        <span v-if="i !== 0 && templateArr[0].length - 1 && txt">&nbsp;或者&nbsp;</span>
        <span class="light-txt" v-if="txt">{{ txt }}</span>
      </span>
      <span>)</span>
    </span>

    <span v-if="templateArr.length > 1 && templateArr[i][0]" v-for="(txt, i) in templateArr" :key="'hash' + i.toString()">
      <span v-if="i !== 0">&nbsp;且&nbsp;</span>
      <span>(</span>

      <span v-for="(item, index) in templateArr[i]" :key="'hashinner' + index.toString()">
        <span v-if="index !== 0 && templateArr[i].length - 1 && item">&nbsp;或者&nbsp;</span>
        <span class="light-txt" v-if="item">{{ item }}</span>
      </span>

      <span>)</span>
    </span>

    <!-- <span v-for="(txt, i) in templateArr" :key="i" v-if="templateArr.length > 1">
			<span v-if="i !== 0">&nbsp;且&nbsp;</span>
			<span v-for="(item, index) in templateArr[i]" :key="index">
				<span v-if="index !== 0 && index !== templateArr[i].length - 1">&nbsp;或&nbsp;</span>
				<span :class="(index !== 0 && index !== templateArr[i].length - 1) ? 'light-txt' : ''">{{item}}</span>
			</span>
		</span> -->
  </div>
  <div v-else></div>
</template>

<script>
import { log } from '@/utils/index.js';
export default {
  name: 'filter-txt',
  props: {
    templatetxt: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      templateArr: [],
      singleTxt: '',
      templateText: ''
    };
  },

  methods: {
    getText() {
      let middletxt = this.templateText;

      if (!middletxt) {
        return;
      }

      // 只有括号
      if (!middletxt.replace(/[\(|\)]/g, '')) {
        return;
      }

      // 只有一条 没有或 没有且
      // middletxt

      if (!middletxt.includes('或') && !middletxt.includes('且')) {
        middletxt = middletxt.replace(/[\(|\)]/g, '');
        this.templateArr.push([middletxt]);
      }
      // 只有一条 有或 没有且
      if (middletxt.includes('或') && !middletxt.includes('且')) {
        middletxt = middletxt.replace(/[\(|\)]/g, '');
        middletxt = middletxt.split('或');
        this.templateArr.push(middletxt);
      }

      // 两条 有且 有或 没有 或
      // (所属主门店包含自营...)且(会员开卡时间2018-11-09 00:00:00至2018-12-04 23:59:59)
      if (middletxt.includes('且')) {
        if (middletxt.includes('或')) {
          // (年龄等于12且(所属主门店包含自营)
          middletxt = middletxt.split('且');
          middletxt.forEach(ele => {
            let txt = ele.replace(/[\(|\)]/g, '');
            let txtArr = txt.split('或');
            this.templateArr.push(txtArr);
          });
        } else {
          middletxt = middletxt.split('且');
          middletxt.forEach(ele => {
            let txt = ele.replace(/[\(|\)]/g, '');
            this.templateArr.push([txt]);
          });
        }
      }
      log(this.templateArr);
    }
  },

  watch: {
    templatetxt: {
      immediate: true,
      handler(newval) {
        this.templateArr = [];
        this.templateText = newval;
        this.getText();
      }
    }
  }
};
</script>
<style>
.filtertxt {
  display: inline-block;
  vertical-align: middle;
}
.light-txt {
  display: inline-block;
  padding: 2px 10px;
  background-color: #e2eaf1;
}
</style>

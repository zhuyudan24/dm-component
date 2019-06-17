<template>
  <layout>
    <template slot="component">
      <el-radio v-model="type" :label="0">筛选过期数据</el-radio>
      <el-radio v-model="type" :label="1">包含过期数据</el-radio>
      <el-button type="primary" @click="showCard">点击弹窗</el-button>
      <dm-card :type="type" :disabledList="disabledList" :projectName="projectName" :showCardDialog="showCardDialog" :cardLimit="cardLimit" :cardType="cardType" @selectCard="selectCard"></dm-card>
    </template>
    <template slot="data">
      <p>弹窗数据：{{ selectedData }}</p>
    </template>
    <template slot="markdown">
      <MyMarkdown></MyMarkdown>
    </template>
  </layout>
</template>

<script>
import layout from '../layout.vue';
import dmCard from '../../components/gic/dm-card/index.vue';
import MyMarkdown from '../../components/gic/dm-card/readme.md';
export default {
  name: 'card-view',
  components: {
    layout,
    'dm-card': dmCard,
    MyMarkdown
  },
  data() {
    return {
      // 可传参数
      projectName: '', //当前项目名
      showCardDialog: false,
      cardLimit: 1, //卡券限制类型 1-限制领取1张的卡券 2- 限制领取 1~100的卡券 3-限制领取&=100 的卡券
      cardType: null, //卡券类型集合（0：抵金券，1：折扣券，2：兑换券）null-为全部类型 逗号分隔
      disabledList: [],
      selectedData: {},
      type: 0
    };
  },
  methods: {
    // 显示卡券弹窗
    showCard() {
      this.showCardDialog = true;
    },
    // 子组件触发方法
    selectCard(val) {
      // 模拟检查数据
      this.selectedData = val;
      this.showCardDialog = false;
    }
  }
};
</script>

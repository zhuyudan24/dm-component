<template>
  <layout>
    <template slot="component">
      <dm-marketing-event ref="marketingEvent" @has-card="hasCard" :ecmPlanId="ecmPlanId" :isSupportVar="isSupportVar" :code="code" :enabledMessageState="enabledMessageState"></dm-marketing-event>
    </template>
    <template slot="data"></template>
    <template slot="markdown">
      <MyMarkdown></MyMarkdown>
    </template>
  </layout>
</template>
<script>
import layout from '../layout.vue';
import dmmMrketingEvent from '../../components/gic/dm-marketing-event/index.vue';
import MyMarkdown from '../../components/gic/dm-marketing-event/readme.md';

export default {
  name: 'marketing-event-view',
  components: {
    layout,
    'dm-marketing-event': dmmMrketingEvent,
    MyMarkdown
  },
  data() {
    return {
      // 参数
      isSupportVar: true, //文本组件是否支持变量
      enabledMessageState: 1, // 能否添加短信
      ecmPlanId: 'ff808081679ca7e201679cf645830001', // 必传,
      //  页面编码——- 1001-智能引擎; 1002-微信营销; 1003-被关注回复; 1004-关键字回复
      code: '1001' //默认为1001
    };
  },
  methods: {
    // 是否包含短信组件
    hasCard(val) {
      //
    }
  }
};
</script>

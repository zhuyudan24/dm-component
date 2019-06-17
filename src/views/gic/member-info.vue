<template>
  <layout>
    <template slot="component">
      <vue-member-info :memberObj="memberObj" :requestProject="requestProject" :placement="placement"></vue-member-info>
    </template>
    <!-- <template slot="data">
      {{ data }}
    </template> -->
    <template slot="markdown">
      <MyMarkdown></MyMarkdown>
    </template>
  </layout>
</template>
<script>
import layout from '../layout.vue';
import vueMemberInfo from '../../components/gic/dm-member-info/index.vue';
// import { log } from '@/utils/index.js';
import MyMarkdown from '../../components/gic/dm-member-info/readme.md';

export default {
  name: 'vue-member-info-view',
  components: {
    layout,
    vueMemberInfo,
    MyMarkdown
  },
  data() {
    return {
      requestProject: 'integral-mall', // 当前项目名
      memberObj: {
        memberName: '测试', //会员名称
        memberImgUrl: 'http://thirdwx.qlogo.cn/mmopen/j7nX4OeBsXQ1nMEeRfexOUHXAGqpXnEicnlJUwWY1G6bDAujuopIY8rWGXSWAyb9cQgfSqicaIhkRUxmS6byCemQ3Eark1s23O/0', //会员头像
        memberId: 'ff80808163b9f0610163ba4f63cc004f' //会员id
      },
      placement: 'top-start' //显示位置
    };
  }
  // methods: {

  // }
};
</script>

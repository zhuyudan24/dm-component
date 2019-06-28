<template>
  <layout>
    <template slot="component">
      <dm-member-group :defaltSelected="defaltSelected" :height="height" :projectName="projectName" :headerList="headerList" :effectiveStatus="effectiveStatus" :max-limit="maxLimit" @handleDataTransferred="handleDataTransferred" @handleDataLeft="handleDataLeft"> </dm-member-group>
    </template>
    <template slot="data">
      {{ data }}
    </template>
    <template slot="markdown">
      <MyMarkdown></MyMarkdown>
    </template>
  </layout>
</template>
<script>
import layout from '../layout.vue';
import dmMemberGroup from '../../components/gic/dm-member-group/index.vue';
import MyMarkdown from '../../components/gic/dm-member-group/readme.md';

export default {
  name: 'member-group-view',
  components: {
    layout,
    'dm-member-group': dmMemberGroup,
    MyMarkdown
  },
  data() {
    return {
      data: '',
      // 可传参数
      defaltSelected: [
        {
          appStatus: null,
          createTime: 1543980512000,
          describle: '所属服务门店',
          effectiveDate: '2019-12-05 23:59:59',
          effectiveDateTmp: null,
          effectiveStatus: 1,
          enterpriseId: 'ff8080815dacd3a2015dacd3ef5c0000',
          groupName: '所属服务门店',
          isRealTime: 1,
          latestUpdateTime: null,
          latestUpdateTimeTmp: null,
          memberCount: 38,
          memberTagGroupId: '1b2fedcf46884c4d99c0d21565d6c149',
          sortColName: 'update_time',
          sortType: 'desc',
          status: 1,
          updateDay: null,
          updateTime: 1544010117000,
          updateType: null
        }
      ], //  默认穿梭窗已选入数据 groupName, isRealTime必传， 其他若无需求可不传
      height: 543, // 穿梭窗高度， 默认是543
      projectName: 'memberTag', // 默认是memberTag
      headerList: ['isRealTime', 'latestUpdateTime', 'updateType', 'effectiveStatus', 'effectiveDate'], // 表头配置，默认全部，分组名称默认显示不可配置
      effectiveStatus: 1, // 不传： 所有状态 1： 有效 0： 失效
      maxLimit: 10
    };
  },

  methods: {
    /**
     * 选择分组后子组件触发的事件
     */

    /**
     * selectedData 穿梭窗已选入数据
     * selectionToTransfer 本次选择的数据
     */
    handleDataTransferred(data) {
      this.data = data;
      //
    },

    /**
     * selectedData 剔除后剩下的数据
     * selectionToRemove 剔除的数据
     */
    handleDataLeft(selectedData, selectionToRemove) {
      //
    }
  }
};
</script>

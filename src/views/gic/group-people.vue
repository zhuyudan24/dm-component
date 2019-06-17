<template>
  <layout>
    <template slot="component">
      <dm-group-people :projectName="projectName" :useId="useId" :hasSearchData="hasSearchData" :sceneValue="sceneValue" ref="peopleFilter" :isAdd="operateType" @findFilter="findFilter" @getBackData="getBackData" @editHide="editHide" @editShow="editShow" @hideBtn="hideBtn"></dm-group-people>
      <!-- 按钮根据当前使用场景设置,有的无保存 -->
      <div v-if="toggleTag">
        <el-button primary @click="getData">确定</el-button>
        <el-button @click="cancelFilter">取消</el-button>
      </div>
      <div v-if="saveTag">
        <el-button primary @click="saveTempData">保存</el-button>
      </div>
    </template>
    <template slot="data">
      {{ getSaveData }}
    </template>
    <template slot="markdown">
      <MyMarkdown></MyMarkdown>
    </template>
  </layout>
</template>
<script>
import layout from '../layout.vue';
import { log } from '@/utils/index.js';
import dmGroupPeople from '../../components/gic/dm-group-people/index.vue';
import MyMarkdown from '../../components/gic/dm-group-people/readme.md';

export default {
  name: 'group-people-view',
  components: {
    layout,
    'dm-group-people': dmGroupPeople,
    MyMarkdown
  },
  data() {
    return {
      // 可传参数
      projectName: '', // 当前项目名
      sceneValue: 'member', // 场景值
      useId: '', // 模板id
      hasSearchData: '', // 当前页回显的数据(接口返回)
      operateType: true, // 编辑的时候是false 新增是true 例如列表筛选是开始true 编辑改成false
      toggleTag: false, // 控制(确认取消)按钮显示的参数,仅供参考,可自行修改
      saveTag: false, // 控制(保存)按钮显示的参数,仅供参考,可自行修改
      getSaveData: ''
    };
  },
  beforeMount() {
    // (如果需要传递数据)请求的数据最好在这里写
  },
  methods: {
    // 父组件调用子组件方法,触发父组件事件
    getData() {
      this.$refs.peopleFilter.confirmSet();
    },
    // 子组件触发父组件事件,返回过滤条件数据
    findFilter(value) {
      log(value);
    },
    // 取消
    cancelFilter() {
      this.$refs.peopleFilter.cancelSet();
    },
    // 获取需要回显的数据, 供保存时候使用
    getBackData(val) {
      log(val);
      this.getSaveData = val;
    },
    // 显示编辑,保存按钮隐藏,确认按钮显示 (子组件会调用)
    editShow() {
      log('editShow');
      this.toggleTag = true;
      this.saveTag = false;
    },
    // 显示保存按钮,隐藏确认按钮显示  (子组件会调用)
    editHide() {
      log('editHide');
      this.toggleTag = false;
      this.saveTag = true;
    },
    // 隐藏保存按钮和确认按钮  (子组件会调用)
    // 传个参数给父组件 来查数据
    hideBtn(refresh) {
      if (refresh === 0) {
        this.memberSearchStr = -1;
        this.toggleTag = false;
        // 查数据的方法
        // this.getList();
      }
    },
    // 保存当前模板,对接保存接口
    saveTempData() {
      log('save');
    }
  }
};
</script>

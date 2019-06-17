<template>
  <layout>
    <template slot="component">
      <dm-people :projectName="projectName" :searchBackTxt.sync="searchBackTxt" :conditionList.sync="conditionList" :useId="useId" :hasSearchData="hasSearchData" :sceneValue="sceneValue" ref="peopleFilter" :isAdd="operateType" @findFilter="findFilter" @getBackData="getBackData" @editHide="editHide" @editShow="editShow" @hideBtn="hideBtn"></dm-people>
      <!-- 按钮根据当前使用场景设置,有的无保存 -->
      <div v-if="toggleTag">
        <el-button primary @click="getData">确定</el-button>
        <el-button @click="cancelFilter">取消</el-button>
      </div>
      <div v-if="saveTag">
        <el-button primary @click="saveTempData">保存</el-button>
      </div>
      <el-button primary @click="selectData">上一页</el-button>
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
import dmPeople from '../../components/gic/dm-people/index.vue';
import { log } from '@/utils/index.js';
import MyMarkdown from '../../components/gic/dm-people/readme.md';

export default {
  name: 'people-view',
  components: {
    layout,
    'dm-people': dmPeople,
    MyMarkdown
  },
  data() {
    return {
      // 可传参数
      searchBackTxt: '',
      conditionList: [],
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
  mounted() {
    if (sessionStorage.getItem('searchBackTxt') && sessionStorage.getItem('searchBackTxt') !== 'undefined') {
      const data = JSON.parse(sessionStorage.getItem('searchBackTxt'));
      this.conditionList = JSON.parse(sessionStorage.getItem('conditionList'));
      this.$refs.peopleFilter.getAbInfo(data);
    }
  },
  methods: {
    selectData() {
      this.$refs.peopleFilter.saveSelectData();
      sessionStorage.setItem('searchBackTxt', JSON.stringify(this.searchBackTxt));
      sessionStorage.setItem('conditionList', JSON.stringify(this.conditionList));
      this.$router.go(-1);
    },
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
        this.getList();
      }
    },
    // 保存当前模板,对接保存接口
    saveTempData() {
      log('save');
    }
  }
};
</script>

<template>
  <div class="select-shop" @click="hideTree">
    <el-select v-model="storeType" @change="selectShop" placeholder="请选择" class="select-shop__left" :disabled="disabled">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
    </el-select>
    <el-popover v-model="showShopTree" v-show="storeType == '1'" popper-class="select-shop__popover" placement="top-start" trigger="click">
      <div class="el-input__inner select-shop__right" slot="reference" @click.prevent.stop="toggleShopTree">{{ shopGroupValue }}</div>
      <div class="select-shop__tree">
        <el-tree ref="shopGroupTree" :check-strictly="linkParent" :data="dataObj" show-checkbox default-expand-all :default-checked-keys="checkedKeys" node-key="storeGroupId" highlight-current :props="defaultProps"> </el-tree>
      </div>
      <div class="select-shop__btn--wrap">
        <el-button @click.prevent.stop="hideTree" type="text" size="small" style="color:#303133">取消</el-button>
        <el-button @click.prevent.stop="groupBtnSure" type="text" size="small">确定</el-button>
      </div>
    </el-popover>

    <div v-show="storeType == '2'" class="select-shop__right">
      <div class="el-input__inner select-shop__tag--input" @click.prevent.stop="toggleSearchShop">
        <span v-for="(item, index) in storeIds" :key="index" class="select-shop__tag">{{ item.storeName }}<i @click.prevent.stop="removeData(index)" class="dele-icon el-icon-error"></i></span>
        <span class="select-shop__tag--tips" v-if="!storeIds.length">请选择门店</span>
      </div>
      <el-popover placement="top-start" popper-class="select-shop__popper" width="300" trigger="hover">
        <el-tag class="select-shop__popper--tag" v-for="(tag, index) in storeIds" :key="tag.storeId" @close="removeData(index)" closable>
          {{ tag.storeName }}
        </el-tag>
        <span slot="reference" class="select-shop__right--total" v-show="storeIds.length > 1">共{{ storeIds.length }}项</span>
      </el-popover>
      <transition name="slide-fade">
        <div class="select-shop__search" @mouseover="showSearchList = true" @mouseout="showSearchList = false" v-show="showSearchList">
          <div class="select-shop__search--input" @click.stop="">
            <el-input @keydown.enter.native="getSearchData()" @keyup.native="getSearchData()" class="input-name" prefix-icon="el-icon-search" size="small" clearable v-model="searchValue" placeholder="输入搜索内容"></el-input>
          </div>
          <div class="select-shop__search--list">
            <ul v-if="selectList.length > 0">
              <li @click.prevent.stop="selectShopSuccess(item, index)" v-for="(item, index) in selectList" :key="index">
                <span>{{ item.storeName }}</span>
              </li>
            </ul>
            <p v-else class="no-data">无搜索内容</p>
            <p class="select-shop__search--tip">最多显示5条数据</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import { baseUrl } from '@/config/index.js';
export default {
  name: 'vue-gic-store-linkage',
  props: {
    msg: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [{ value: '0', label: '所有门店' }, { value: '1', label: '门店分组' }, { value: '2', label: '部分门店' }],
      defaultProps: { children: 'children', label: 'storeGroupName' },

      dataObj: [],
      showShopTree: false, // 显示门店的树级结构
      showSearchList: false, // 显示部分门店的搜索结果
      linkParent: true, //父子无关联关系
      searchValue: '', // 部分门店的下拉框的搜索值
      selecData: [],
      selectListId: [], // 选中的门店的id
      storeList: [], // 店员管理 -- 企业部门 -- 编辑企业成员

      shopGroupValue: '已选择0个门店分组',
      selectList: [],
      storeIds: [],
      checkedKeys: [], // 默认选中的门店分组
      groupIds: '',
      storeType: '0'
    };
  },
  watch: {
    msg(oldVal, newVal) {
      this.init(oldVal);
    }
  },
  created() {
    this.init(this.msg);
  },
  mounted() {
    this.getGroupTreeData(); // 获得门店分组的数据
  },
  methods: {
    init(dataObj) {
      // 初始化
      if (dataObj.storeList) {
        if (dataObj && dataObj.storeList.length > 0) {
          // 店员管理 -- 企业部门 -- 编辑企业成员
          this.selecData = dataObj.storeList || [];
        }
      }
      // if (dataObj.storeType) {
      //   this.storeType = dataObj.storeType.toString();
      //   if (this.storeType == '1') {
      //     this.groupIds = dataObj.storeGroupIds;
      //     this.shopGroupValue = '已选择' + dataObj.storeGroupIds.split(',').length + '个门店分组';
      //     this.checkedKeys = dataObj.storeGroupIds.split(',').filter(v => !!v);
      //   } else if (this.storeType == '2') {
      //     this.storeIds = Object.assign([], dataObj.storeIds);
      //   }
      //   this.getGroupTreeData();
      // }
      if (dataObj.storeType) {
        this.storeType = dataObj.storeType.toString();
        if (this.storeType == '1') {
          this.groupIds = dataObj.storeGroupIds;
          if (dataObj.storeGroupIds) {
            this.shopGroupValue = '已选择' + dataObj.storeGroupIds.split(',').length + '个门店分组';
            this.checkedKeys = dataObj.storeGroupIds.split(',').filter(v => !!v);
          } else {
            this.checkedKeys = [];
            this.shopGroupValue = '已选择0个门店分组';
          }
        } else if (this.storeType == '2') {
          this.storeIds = Object.assign([], dataObj.storeIds);
        }
        this.getGroupTreeData();
      }
    },
    getGroupTreeData() {
      this.axios
        .get(baseUrl + '/api-admin/store-group-list', {
          params: {
            requestProject: 'gic-web'
          }
        })
        .then(res => {
          var data = res.data;
          if (data.errorCode == 0) {
            this.dataObj = data.result;
          }
        });
    },
    getSearchData() {
      // 部分门店的查询
      this.axios
        .post(
          baseUrl + '/api-plug/query-store-by-code-name',
          qs.stringify({
            requestProject: 'gic-web',
            searchParam: this.searchValue,
            selectedIds: this.selectListId.join(','),
            flag: '1'
          })
        )
        .then(res => {
          var data = res.data;
          if (data.errorCode == 0) {
            this.selectList = data.result;
          }
        });
    },
    selectShop(val) {
      if (val !== 1) {
        this.showShopTree = false;
      }
      // this.showShopTree = false;
      // 选择门店
      this.emitObj();
    },
    toggleShopTree() {
      // if (this.disabled) return;
      // // 门店分组的树结构  1
      // this.showShopTree = !this.showShopTree;
    },

    groupBtnSure() {
      // 选择门店分组的确定按钮
      this.showShopTree = false;
      if (this.disabled) return;
      var storeGroupList = this.$refs.shopGroupTree.getCheckedKeys();
      var len = storeGroupList.length;
      this.groupIds = storeGroupList.join(',');
      this.shopGroupValue = '已选择' + len + '个门店分组';
      this.emitObj();
    },

    toggleSearchShop() {
      // 部分门店的树结构		--  自定义 2
      this.showSearchList = !this.showSearchList;
    },
    showSearchTree() {
      // 部分门店的搜索
      this.showSearchList = true;
    },
    hideSearch() {
      // 隐藏搜索结果框
      this.showSearchList = false;
    },
    hideTree() {
      this.showShopTree = false; // 门店分组
      this.showSearchList = false; // 部分门店
    },

    selectShopSuccess(item, index) {
      // 成功选择部分门店
      if (this.storeIds.map(v => v.storeId).indexOf(item.storeId) > -1) return;
      this.storeIds.push(item);
      this.emitObj();
    },
    removeData(index) {
      // 移出部分门店
      if (this.disabled) return;
      this.storeIds.splice(index, 1);
      this.emitObj();
    },
    emitObj() {
      let obj = {
        storeGroupIds: this.groupIds,
        storeIds: this.storeIds,
        storeType: parseInt(this.storeType)
      };
      this.$emit('sendSelectGroupData', obj);
    }
  }
};
</script>

<style lang="scss">
@import './style.scss';
</style>

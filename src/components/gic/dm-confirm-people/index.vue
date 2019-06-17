<template>
  <section class="confirm-people">
    <div class="confirm-people_l">
      <header>
        <el-input size="small" style="width:370px;" placeholder="请输入昵称卡号" prefix-icon="el-icon-search" v-model="keyWord" clearable @change="loadList"></el-input>
      </header>
      <el-table v-loading="loading" tooltipEffect="light" ref="multipleTable" :data="leftList" tooltip-effect="dark" style="width: 100%" height="400px" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
        <el-table-column :render-header="renderHeader" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <img class="avatar-img" style="vertical-align: middle;" :src="filterAvatar(scope.row.photoUrl)" width="40px" height="40px" alt="" srcset="" />
            <span class="avatar">
              <p>{{ scope.row.name || '--' }}</p>
              <p style="color:#909399; font-size:13px;">{{ scope.row.cardNo || '--' }}</p>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="gradeName" label="会员等级" width="100"></el-table-column>
      </el-table>
    </div>

    <div class="confirm-people_c">
      <el-button type="primary" icon="el-icon-arrow-right" circle @click="toRight"></el-button>
      <el-button icon="el-icon-arrow-left" circle @click="removeAll"></el-button>
    </div>
    <div class="confirm-people_r">
      <header>
        <el-input size="small" style="width:370px;" placeholder="请输入昵称卡号" clearable prefix-icon="el-icon-search" v-model="keyWordRight" @change="filterRight"></el-input>
      </header>
      <el-table tooltipEffect="light" ref="multipleTable" :data="rightList" tooltip-effect="dark" style="width: 100%" height="400px" @selection-change="handleSelectionChangeRight">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="会员信息" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <img class="avatar-img" style="vertical-align: middle;" :src="filterAvatar(scope.row.photoUrl)" width="40px" height="40px" alt="" srcset="" />
            <span class="avatar">
              <p>{{ scope.row.name || '--' }}</p>
              <p style="color:#909399; font-size:13px;">{{ scope.row.cardNo || '--' }}</p>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="gradeName" label="会员等级" width="100"></el-table-column>
        <el-table-column prop="gradeName" label="操作" width="50">
          <template slot-scope="scope">
            <el-button type="text" @click="remove(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script>
import qs from 'qs';
import { baseUrl } from '@/config/index.js';
import { log } from '@/utils/index.js';
/**
 * 清除重复
 */
function uniqueByType(arr, type) {
  let res = [];
  let json = {};
  for (let i = 0; i < arr.length; i++) {
    if (!json[arr[i][type]]) {
      res.push(arr[i]);
      json[arr[i][type]] = 1;
    }
  }
  return res;
}

let allList = [];
let sendTypeTips = {
  card: '',
  wechat: '未关注公众号的用户不可选择',
  message: '没有手机号的用户不可选择'
};
export default {
  name: 'vue-gic-confirm-people',
  props: {
    idType: {
      type: String,
      default: 'openId'
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    /* 发送类型  卡券 短信 微信
     * 卡券 不需要提示  要判断是否有openid row.openid
     * 微信 需要提示（未关注公众号的用户不可选择）  是否关注  row.attentionStatus === 1
     * 短信 需要提示（没有手机号的用户不可选择） 要判断是否有手机号码 row.phoneNumber
     */
    sendType: {
      type: String,
      default: 'card'
    }
  },
  data() {
    return {
      loading: false,
      keyWord: '',
      keyWordRight: '',
      leftList: [],
      rightList: [],
      leftSelected: [],
      rightSelected: [],
      // eslint-disable-next-line
      avatar: require('./head_default.png')
    };
  },
  watch: {
    rightList(val) {
      // log(val)
      this.$emit('get-data', val.map(v => v[this.idType]).join(','));
    },
    list(val) {
      allList = this.rightList = val.slice();
    }
  },
  methods: {
    filterAvatar(img) {
      return img ? img.replace(/^http(s)?/, 'https') : this.avatar;
    },
    handleSelectionChange(val) {
      // log(val)
      this.leftSelected = val;
    },
    handleSelectionChangeRight(val) {
      this.rightSelected = val;
    },
    toRight() {
      // log(this.leftSelected)
      this.leftSelected.map(v => {
        const index = this.rightList.indexOf(v);
        if (index < 0) {
          this.rightList.push(v);
        }
      });
      log(this.rightList.map(v => v.memberId));
      allList = this.rightList = uniqueByType(this.rightList, 'memberId');
    },
    loadList() {
      this.loading = true;
      this.leftSelected = [];
      let params = {
        searchParams: this.keyWord,
        onlyWxMember: this.sendType === 'wechat' ? 1 : 0,
        requestProject: 'gic-web'
      };
      this.axios.post(baseUrl + '/api-marketing/member-search-engine', qs.stringify(params), {}).then(res => {
        if (res.data.errorCode === 0 && res.data.result) {
          this.leftList = res.data.result;
        }
        this.loading = false;
      });
    },
    removeAll() {
      let currentList = this.rightList.slice();
      this.rightSelected.map(v => {
        const index = currentList.indexOf(v);
        if (index > -1) {
          currentList.splice(index, 1);
        }
      });
      allList = this.rightList = currentList;
    },
    remove(index) {
      this.rightList.splice(index, 0);
      allList.splice(index, 1);
    },
    //TODO
    filterRight() {
      if (!this.keyWordRight) {
        this.rightList = Object.assign([], allList);
      } else {
        const list = Object.assign([], this.rightList);
        const filterList = list.filter(v => {
          let flag = false;
          if (v.cardNo) flag = v.cardNo.indexOf(this.keyWordRight) > -1;
          if (v.memberName) flag = v.memberName.indexOf(this.keyWordRight) > -1;
          return flag;
        });
        this.rightList = filterList;
      }
    },
    renderHeader(h, { column, $index }) {
      return h('span', [h('span', { style: 'font-weight:500;' }, '会员信息'), h('span', { style: 'font-weight:500;font-size:12px;color:#909399;margin-left:5px;' }, sendTypeTips[this.sendType])]);
    },
    selectable(row, index) {
      let selectFlag = true;
      switch (this.sendType) {
        case 'message':
          selectFlag = !!row.phoneNumber;
          break;
        case 'wecaht':
          selectFlag = row.attentionStatus === 1;
          break;
        case 'card':
          selectFlag = !!row.openId;
          break;
      }
      return selectFlag;
    }
  }
};
</script>

<style lang="scss" scoped>
.confirm-people {
  width: 1000px;
  &_l,
  &_r {
    display: inline-block;
    width: 400px;
    border: 1px solid #dcdfe6;
    vertical-align: middle;
    header {
      height: 66px;
      line-height: 66px;
      padding: 0 15px;
    }
  }
  &_c {
    display: inline-block;
    vertical-align: middle;
    margin: 0 10px;
    button {
      display: block;
      margin: 10px auto;
    }
  }
  /deep/ .avatar {
    display: inline-block;
    vertical-align: middle;
  }
  /deep/ .avatar-img {
    display: inline-block;
    vertical-align: middle;
    width: 40px;
    height: 40px;
    border-radius: 2px;
    border: 1px solid #e4e7ed;
  }
}
</style>

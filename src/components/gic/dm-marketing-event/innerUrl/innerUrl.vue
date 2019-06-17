<template>
  <div class="innerUrl-wrap menu-item">
    <div class="menu-item">
      <el-select @change="selectLeftUrl" class="fl select-shop" label="黄精" v-model="leftUrl" placeholder="请选择">
        <el-option v-for="item in leftOptions" :key="item.wechat_menu_dict_id" :label="item.wechat_menu_dict_name" :value="item.wechat_menu_dict_id"> </el-option>
      </el-select>
      <div v-show="leftUrl == '12'" class="fr select-shop">
        <el-input @focus="dialogShopShow" suffix-icon="el-icon-arrow-down" v-model="selectShopUrl" placeholder="选择门店"></el-input>
      </div>
      <el-select v-show="(leftUrl != '12' && rightOptions.length > 0) || (leftUrl != '12' && rightUrl != '')" @change="selectRighgtUrl" class="fr select-shop" label="黄精" v-model="rightUrl" placeholder="请选择">
        <el-option v-for="item in rightOptions" :key="item.wechat_menu_dict_id" :label="item.wechat_menu_dict_name" :value="item.wechat_menu_dict_url"> </el-option>
      </el-select>
    </div>
    <!-- 选择门店 -->
    <div class="choose-wrap">
      <vue-gic-store :showStoreDialog="showStoreDialog" @selectStore="selectStore" :appendToBody="true"></vue-gic-store>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import { log } from '@/utils/index.js';
export default {
  name: 'innerUrl',
  props: {
    menuCode: String
  },
  data() {
    return {
      /*内部链接 级联选择器*/
      leftOptions: [],
      rightOptions: [],
      leftUrl: '',
      rightUrl: '',

      dialogShop: false, // 选择门店的弹窗
      selectShopUrl: '', // 门店的弹窗，选中之后的url

      tableData2: [], // 门店列表
      searchShopValue: '', // 搜索门店
      radioShop: null,
      showShopDetail: '', // 用于显示选中的门店
      totalCount: null,
      currentPage: 1, // 分页
      pageSize: 5,
      edit: true,
      defaultUrl: false,

      showStoreDialog: false, // 门店

      baseUrl: ''
    };
  },
  watch: {
    menuCode(newVal, oldVal) {
      // 内链
      log(newVal);
      if (newVal == 'null' || newVal == '' || newVal == undefined) {
        return;
      } else {
        let valObj = JSON.parse(newVal);

        log(valObj);
        this.leftUrl = valObj.precode;
        this.rightUrl = valObj.nextcode;
        this.defaultUrl = true;
        this.selectLeftUrl(this.leftUrl, this.rightUrl); // 获取默认信息
      }
    }
  },
  created() {
    // log(this.$parent.menuCode);
  },
  mounted() {
    this.getLeftUrlData(); // 获取左侧地址
    // this.getShopList();     // 获取门店列表
  },
  methods: {
    getLeftUrlData() {
      // 获取左侧
      this.axios
        .post(
          '/api-admin/get-inner-url',
          qs.stringify({
            requestProject: 'gic-web'
          })
        )
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            this.leftOptions = data.result;
          } else {
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        });
    },
    selectLeftUrl(val, valR) {
      // 选择左侧链接  获取右侧
      this.leftUrl = val;
      this.rightUrl = valR;
      if (!this.defaultUrl) {
        this.rightUrl = '';
      }
      this.axios
        .post(
          '/api-admin/pre-code-select',
          qs.stringify({
            requestProject: 'gic-web',
            pid: val
          })
        )
        .then(res => {
          let data = res.data;
          // log(data);
          if (data.errorCode == 0) {
            this.rightOptions = data.result.menuList;

            if (this.rightOptions[0].wechat_menu_dict_id === '112' || this.rightOptions[0].wechat_menu_dict_name === '选择门店') {
              this.baseUrl = this.rightOptions[0].wechat_menu_dict_url;
              // debugger
            } else {
              this.baseUrl = '';
            }
            this.defaultUrl = false;
          } else {
            this.$message({
              type: 'error',
              message: data.message
            });
          }
        });
    },
    selectRighgtUrl(val) {
      // 选择右侧链接
      this.rightUrl = val;
      log(this.rightUrl);
      let name = '';
      this.rightOptions.map(v => {
        if (v.wechat_menu_dict_url === val) {
          name = v.wechat_menu_dict_name;
        }
      });
      this.$emit('sendRightUrl', { name: name, url: val });
    },
    dialogShopShow() {
      // 显示门店弹窗
      let that = this;
      that.showStoreDialog = true;
    },
    selectStore(val) {
      // 子组件触发方法
      // 模拟检查数据
      log(val);
      this.showStoreDialog = false;
      this.selectShopUrl = val.storeName;
      log(this.selectShopUrl);
      this.$emit('sendShopData', { name: val.storeName, url: this.baseUrl + '?id=' + val.storeId });
    }
  }
};
</script>

<style scoped lang="scss">
.innerUrl-wrap {
  .menu-item {
    width: 450px;
    position: relative;
    .select-shop {
      width: 220px;
    }
  }
  .choose-wrap {
    .search {
      width: 260px;
      margin-bottom: 24px;
    }
    .choose-list {
      max-height: 404px;
      border-top: 1px solid #ebeef5;
      .list-img {
        width: 80px;
        height: 80px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .pagination {
      text-align: right;
      margin-top: 20px;
      line-height: 1;
    }
  }
}
.choose-shop-list /deep/ .el-table__row {
  cursor: pointer;
}
.choose-shop-list /deep/ .el-table .has-gutter {
  line-height: 1;
}
.choose-wrap /deep/ .el-dialog__body {
  padding: 10px 20px;
}
.choose-wrap /deep/ .el-dialog {
  height: auto !important;
}
</style>

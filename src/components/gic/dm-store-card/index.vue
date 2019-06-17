<template>
  <div class="dm-store__card">
    <!-- 左边 -->
    <div class="dm-store__left">
      <div class="dm-store__state">
        <el-select v-model="storeType" :disabled="readonly" placeholder="请选择" class="w100" @input="selectStoreType">
          <el-option v-for="(v, i) in storeTypeOptions" :key="i" :label="v.label" :value="v.value"></el-option>
        </el-select>
        <span class="fz13">{{ computedLeftCount }}/{{ leftTotal }}</span>
      </div>
      <div class="dm-store__search">
        <el-input v-model="leftValue" placeholder="请输入门店名称" prefix-icon="el-icon-search" @change="initLeftList"></el-input>
      </div>
      <div class="dm-store__list" v-loading="leftMoreLoading">
        <p class="dm-store__item">
          <el-checkbox v-model="saveParams.isAll" :true-label="1" :false-label="0" @change="handleCheckAllChange">全部</el-checkbox>
        </p>
        <el-checkbox-group v-model="leftCheckList">
          <p v-for="(v, i) in leftList" :key="i" class="dm-store__item dm-store__item--52">
            <el-checkbox :label="v.storeId">
              <p>{{ v.storeName }}</p>
              <p class="fz13 gray">{{ v.storeCode }}</p>
            </el-checkbox>
          </p>
          <p class="dm-store__list--more" v-if="leftMoreShow" :disabled="leftMoreLoading">
            <el-button type="text" @click="leftLoadMore">{{ leftMoreLoading ? '加载中...' : '加载更多' }}</el-button>
          </p>
          <p class="dm-store__list--more" v-else><el-button class="fz12" type="text" disabled>无更多数据</el-button></p>
        </el-checkbox-group>
      </div>
    </div>
    <!-- 中间按钮区域 -->
    <div class="dm-store__center dm-store__center--card">
      <el-button type="primary" size="mini" icon="el-icon-arrow-right" :disabled="!leftCheckList.length || readonly" @click="saveToRight">转入</el-button>
      <el-button icon="el-icon-close" size="mini" :disabled="!rightCheckList.length || readonly" @click="deleteRightItems(false)">移除</el-button>
    </div>
    <!-- 右边 -->
    <div class="dm-store__right">
      <div class="dm-store__state">
        <span
          >已选<span class="fz12 gray-color">（{{ rightTotal }}个门店）</span></span
        >
        <el-button type="text" @click="deleteRightAll">全部清除</el-button>
      </div>
      <div class="dm-store__search">
        <el-input v-model="rightParams.search" placeholder="请输入门店名称" prefix-icon="el-icon-search" @change="initRightList"></el-input>
      </div>
      <el-checkbox-group v-model="rightCheckList" class="dm-store__list" v-loading="rightMoreLoading">
        <p v-for="(v, i) in rightList" :key="i" class="dm-store__item" @mouseover="rightHoverIndex = i" @mouseout="rightHoverIndex = null">
          <el-checkbox :label="v.id">{{ v.name }}</el-checkbox>
          <i class="el-icon-close" v-show="rightHoverIndex !== i"></i>
          <i class="el-icon-circle-close" v-show="rightHoverIndex === i" @click.stop="deleteRightItems(v.id)"></i>
        </p>
        <p class="dm-store__list--more" v-if="rightMoreShow" :disabled="rightMoreLoading">
          <el-button type="text" @click="rightLoadMore">{{ rightMoreLoading ? '加载中...' : '加载更多' }}</el-button>
        </p>
        <p class="dm-store__list--more" v-else><el-button class="fz12" type="text" disabled>无更多数据</el-button></p>
      </el-checkbox-group>
    </div>
    <!-- 弹出框 -->
    <el-dialog title="门店选择" :visible.sync="dialogVisible" width="400px" :before-close="handleClose">
      <div style="margin:0 auto;position:relative;">
        <option-type v-if="storeType === 1" :uuid="dialogUuid"></option-type>
        <option-tags v-if="storeType === 2" :uuid="dialogUuid"></option-tags>
        <option-area v-if="storeType === 3" :uuid="dialogUuid"></option-area>
        <option-group v-if="storeType === 4" :uuid="dialogUuid"></option-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import qs from 'qs';
import { baseUrl } from '@/config/index.js';
import { log } from '@/utils/index.js';
import uuidv1 from 'uuid/v1';
import optionType from '../dm-store-new/options/option-type';
import optionArea from '../dm-store-new/options/option-area';
import optionTags from '../dm-store-new/options/option-tags';
import optionGroup from '../dm-store-new/options/option-group';
export default {
  name: 'vue-gic-store-card',
  components: {
    'option-type': optionType,
    'option-area': optionArea,
    'option-tags': optionTags,
    'option-group': optionGroup
  },
  props: {
    uuid: {
      type: String,
      default: ''
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    // 只读
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      storeType: 0,
      storeTypeOptions: [
        // 一级列表
        { label: '所有门店', value: 0 },
        { label: '门店类型', value: 1 },
        { label: '门店标签', value: 2 },
        { label: '门店区域', value: 3 },
        { label: '门店分组', value: 4 }
        // {label:'部分门店',value:5}
      ],
      leftList: [],
      rightList: [],
      leftValue: '',
      leftCheckList: [],
      rightCheckList: [],
      saveParams: {
        selectType: 5, // 是	int	下拉选择项
        key: '', // 是	string	32位唯一值
        isAll: 0, // 是	int	是否勾选全部 1是 0否
        value: '', //否	string	isAll=0时，必填，选中项id，多个逗号分隔
        removeItems: '', //否	string	isAll=1，取消选中项的id，多个逗号分隔
        _key: '',
        isClique: 0
      },
      leftParams: {
        searchParam: '',
        pageSize: 20,
        currentPage: 1,
        isClique: 0
      },
      rightParams: {
        key: '',
        selectType: 5,
        search: '',
        currentPage: 1,
        pageSize: 20
      },
      isIndeterminate: false,
      rightHoverIndex: null,
      rightTotal: 0,
      leftTotal: 0,
      newUuid: uuidv1().replace(/-/g, ''), // 生成uuid
      dialogUuid: uuidv1().replace(/-/g, ''),
      cacheUuid: uuidv1().replace(/-/g, ''), // 生成uuid
      dialogVisible: false,
      leftMoreShow: false,
      leftMoreLoading: false,
      rightMoreShow: false,
      rightMoreLoading: false,

      isCache: false
    };
  },
  watch: {
    isCache(val) {
      log(val);
      if (val) {
        this.$emit('update:uuid', this.cacheUuid);
      }
    },
    uuid(val) {
      log(val);
    }
  },
  computed: {
    computedLeftCount() {
      if (this.saveParams.isAll) {
        let minuend = this.leftList.length - this.leftCheckList.length;
        log('all' + minuend);
        return this.leftTotal - minuend;
      } else {
        return this.leftList
          .map(v => {
            return this.leftCheckList.includes(v.storeId);
          })
          .filter(v => v).length;
      }
    }
  },
  methods: {
    // 获取配置项
    init() {
      this.newUuid = this.uuid || this.newUuid;
      if (!this.uuid) {
        this.$emit('update:uuid', this.newUuid);
      } else {
        this.initRightList();
      }
      this.getInitLeftList().then(res => {
        this.leftList = res;
      });
    },
    //左侧初始化
    initLeftList() {
      this.leftParams.currentPage = 1;
      if (this.storeType) {
        this.getLeftList().then(res => {
          if (this.saveParams.isAll) {
            const unSelecteds = this.leftList
              .filter(v => {
                return this.leftCheckList.indexOf(v.storeId) < 0;
              })
              .map(v => v.storeId);
            this.leftCheckList = res
              .map(v => v.storeId)
              .filter(v => {
                return unSelecteds.indexOf(v) < 0;
              });
          }

          this.leftList = res;
          // log( this.leftList )
        });
      } else {
        this.getInitLeftList().then(res => {
          if (this.saveParams.isAll) {
            const unSelecteds = this.leftList
              .filter(v => {
                return this.leftCheckList.indexOf(v.storeId) < 0;
              })
              .map(v => v.storeId);
            this.leftCheckList = res
              .map(v => v.storeId)
              .filter(v => {
                return unSelecteds.indexOf(v) < 0;
              });
          }
          this.leftList = res;
          // log( this.leftList )
        });
      }
    },
    // 初始化右侧列表
    initRightList() {
      this.rightParams.currentPage = 1;
      this.getRightList().then(res => {
        this.rightList = res;
      });
    },
    // 初始化左侧数据
    getInitLeftList() {
      return new Promise((resolve, reject) => {
        this.leftMoreLoading = true;
        this.leftParams.searchParam = this.leftValue;
        this.axios
          .post(baseUrl + '/api-plug/query-store-by-code-name-new?requestProject=gic-web', qs.stringify(this.leftParams))
          .then(res => {
            this.leftMoreLoading = false;
            if (res.data.errorCode === 0) {
              let list = (res.data.result && res.data.result.result) || [];
              this.leftTotal = (res.data.result && res.data.result.totalCount) || 0;
              // 没有拉取到数据，说明没有更多数据
              if (list.length < 20) {
                this.leftMoreShow = false;
              } else {
                this.leftMoreShow = true;
              }
              log(list);
              resolve(list);
            } else {
              reject(new Error('获取列表错误'));
            }
          })
          .catch(err => {
            log(err);
            reject(new Error('获取列表错误'));
          });
      });
    },
    // 拉取左侧数据
    getLeftList() {
      return new Promise((resolve, reject) => {
        this.rightMoreLoading = true;
        let params = {
          key: this.dialogUuid,
          search: this.leftValue,
          currentPage: this.leftParams.currentPage,
          pageSize: this.leftParams.pageSize
        };
        this.axios
          .post(baseUrl + '/api-plug/get-store-widget-store?requestProject=gic-web', qs.stringify(params))
          .then(res => {
            if (res.data.errorCode === 0) {
              let list = (res.data.result && res.data.result.result) || [];
              this.leftTotal = (res.data.result && res.data.result.totalCount) || 0;
              this.rightMoreLoading = false;
              // 没有拉取到数据，说明没有更多数据
              if (list.length < 20) {
                this.leftMoreShow = false;
              } else {
                this.leftMoreShow = true;
              }
              resolve(list);
            } else {
              reject(new Error('获取列表错误'));
            }
          })
          .catch(err => {
            reject(new Error('获取列表错误'));
            this.rightMoreLoading = false;
          });
      });
    },
    // 拉取右侧数据
    getRightList() {
      return new Promise((resolve, reject) => {
        this.rightMoreLoading = true;
        this.rightParams.key = this.isCache ? this.cacheUuid : this.newUuid;
        this.axios
          .post(baseUrl + '/api-plug/list-right-data?requestProject=gic-web', qs.stringify(this.rightParams))
          .then(res => {
            this.rightMoreLoading = false;
            if (res.data.errorCode === 0) {
              this.rightTotal = (res.data.result && res.data.result.totalCount) || 0;
              let list = (res.data.result && res.data.result.result) || [];
              // 没有拉取到数据，说明没有更多数据
              if (list.length < 20) {
                this.rightMoreShow = false;
              } else {
                this.rightMoreShow = true;
              }
              resolve(list);
            } else {
              reject(new Error('获取列表错误'));
            }
          })
          .catch(err => {
            reject(new Error('获取列表错误'));
          });
      });
    },
    // 左侧侧加载更多
    leftLoadMore() {
      this.leftParams.currentPage += 1;
      if (this.storeType) {
        this.getLeftList().then(res => {
          if (res instanceof Array) {
            res.map(v => {
              this.leftList.push(v);
              if (this.saveParams.isAll) {
                this.leftCheckList.push(v.storeId);
              }
            });
          }
        });
      } else {
        this.getInitLeftList().then(res => {
          if (res instanceof Array) {
            res.map(v => {
              this.leftList.push(v);
              if (this.saveParams.isAll) {
                this.leftCheckList.push(v.storeId);
              }
            });
          }
        });
      }
    },

    // 右侧加载更多
    rightLoadMore() {
      this.rightParams.currentPage += 1;
      this.getRightList().then(res => {
        if (res instanceof Array) {
          res.map(v => {
            this.rightList.push(v);
          });
        }
      });
    },

    // 左侧数据移动到右侧
    saveToRight() {
      this.saveParams.key = this.isAdd ? this.newUuid : this.cacheUuid;
      if (this.saveParams.isAll && !this.leftValue) {
        this.saveParams._key = this.storeType ? this.dialogUuid : '';
        this.saveParams.removeItems = this.leftList
          .filter(v => {
            return this.leftCheckList.indexOf(v.storeId) < 0;
          })
          .map(v => v.storeId)
          .join(',');
      } else if (this.saveParams.isAll && this.leftValue) {
        this.saveParams.isAll = 0;
        this.saveParams.value = this.leftCheckList.join(',');
      } else {
        this.saveParams.value = this.leftCheckList.join(',');
      }

      log(this.saveParams);
      this.axios
        .post(baseUrl + '/api-plug/save-store-widget?requestProject=gic-web', qs.stringify(this.saveParams))
        .then(res => {
          if (!this.isAdd) {
            this.isCache = true;
          }
          this.$nextTick(_ => {
            this.initRightList();
          });
        })
        .catch(err => {
          log(err);
        });
    },
    // 删除右侧全部
    deleteRightAll() {
      if (this.rightParams.search) {
        this.deleteRightItems(this.rightList.map(v => v.id).join(','));
      } else {
        this.axios
          .get(baseUrl + '/api-plug/remove-allitems?requestProject=gic-web&key=' + (this.isAdd ? this.newUuid : this.cacheUuid))
          .then(res => {
            if (res.data.errorCode === 0) {
              if (!this.isAdd) {
                this.isCache = true;
              }
              this.$nextTick(_ => {
                this.initRightList();
              });
            } else {
              this.$message({ type: 'error', message: '清除全部失败' });
            }
          })
          .catch(err => {
            log(err);
          });
      }
    },
    // 删除右侧单选或者多选数据
    deleteRightItems(item) {
      this.rightMoreLoading = true;
      let params = {
        key: this.isAdd ? this.newUuid : this.cacheUuid,
        removeItems: item || this.rightCheckList.join(',')
      };
      this.saveParams.value = this.leftCheckList.join(',');
      this.axios
        .post(baseUrl + '/api-plug/remove-items?requestProject=gic-web', qs.stringify(params))
        .then(res => {
          if (!this.isAdd) {
            this.isCache = true;
          }
          this.$nextTick(_ => {
            this.initRightList();
            this.rightCheckList = [];
          });

          this.rightMoreLoading = false;
        })
        .catch(err => {
          this.rightMoreLoading = false;
          log(err);
        });
    },
    // 关闭弹出框
    handleClose() {
      this.dialogVisible = false;
    },
    // 弹出框确认
    confirm() {
      this.getLeftList().then(res => {
        this.leftList = res;
      });
      this.dialogVisible = false;
    },
    // 选择门店类型
    selectStoreType() {
      if (this.storeType) {
        this.dialogVisible = true;
      } else {
        this.initLeftList();
      }
    },
    // 选中所有数据
    handleCheckAllChange(val) {
      this.leftCheckList = val ? this.leftList.map(v => v.storeId) : [];
    }
  }
};
</script>
<style lang="scss">
@import url('../dm-store-new/index.css');
</style>

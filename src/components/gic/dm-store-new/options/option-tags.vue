<template>
  <el-popover class="vertical-baseline" placement="bottom-start" width="465" height="378" trigger="click" v-model="popoverShow">
    <div class="dm-store__wrap" style="height: 378px;">
      <div class="dm-store__left">
        <div class="dm-store__state">
          <el-checkbox v-model="params.isAll" :true-label="1" :false-label="0" @change="handleCheckAllChange">所有门店</el-checkbox>
          <span class="fz13">{{ computedLeftCount }}/{{ leftTotal }}</span>
        </div>
        <div class="dm-store__search">
          <el-input v-model="leftValue" placeholder="请输入标签名称" prefix-icon="el-icon-search" @change="getLeftList"></el-input>
        </div>
        <el-checkbox-group v-model="leftCheckList" class="dm-store__list">
          <p v-for="(v, i) in leftList" :key="i" class="dm-store__item">
            <el-checkbox :label="v.tagId">{{ v.tagName }}</el-checkbox>
            <!-- <i class="el-icon-arrow-right"></i> -->
          </p>
        </el-checkbox-group>
      </div>
      <div class="dm-store__center">
        <el-button type="primary" icon="el-icon-arrow-right" circle :disabled="!leftCheckList.length" @click="saveToRight"></el-button>
        <el-button icon="el-icon-close" circle :disabled="!rightCheckList.length" @click="deleteRightItems(false)"></el-button>
      </div>
      <div class="dm-store__right">
        <div class="dm-store__state">
          <span
            >已选<span class="fz12 gray-color">（{{ rightTotal }}个类型）</span></span
          >
          <el-button type="text" @click="deleteRightAll">全部清除</el-button>
        </div>
        <div class="dm-store__search">
          <el-input v-model="rightValue" placeholder="请输入标签名称" prefix-icon="el-icon-search" @change="rightSearch"></el-input>
        </div>
        <el-checkbox-group v-model="rightCheckList" class="dm-store__list">
          <p v-for="(v, i) in rightList" :key="i" class="dm-store__item" @mouseover="rightHoverIndex = i" @mouseout="rightHoverIndex = null">
            <el-checkbox :label="v.id">{{ v.name }}</el-checkbox>
            <i class="el-icon-close" v-show="rightHoverIndex !== i"></i>
            <i class="el-icon-circle-close" v-show="rightHoverIndex === i" @click.stop="deleteRightItems(v.id)"></i>
          </p>
          <p class="dm-store__list--more" v-if="moreShow" :disabled="moreLoading">
            <el-button type="text" @click="loadMore">{{ moreLoading ? '加载中...' : '加载更多' }}</el-button>
          </p>
        </el-checkbox-group>
      </div>
    </div>
    <div class="el-input dm-store__reference w240" slot="reference">
      <div class="el-input__inner dm-store__inputtag">
        <el-tag size="small" v-for="v in rightList" :key="v.id" @close="deleteRightItems(v.id)" closable>{{ v.name }}</el-tag>
        <span class="gray-color dm-store__inputtag--tips" v-show="rightList.length === 0">请选择门店</span>
      </div>
      <el-popover placement="top-start" popper-class="select-shop__popper" width="300" trigger="hover">
        <el-tag class="dm-store__total--tag" v-for="v in rightList" :key="v.id" @close="deleteRightItems(v.id)" closable>{{ v.name }}</el-tag>
        <span slot="reference" class="dm-store__inputtag--total" v-show="rightList.length">共{{ params.isAll ? rightTotal : rightList.length }}项</span>
      </el-popover>
    </div>
    <!-- 操作按钮 -->
    <div class="dm-store__btn">
      <el-button class="dm-store__btn--cancel" type="text" @click="confirm">确 定</el-button>
    </div>
  </el-popover>
</template>
<script>
import qs from 'qs';
import { baseUrl } from '@/config/index.js';
import { log } from '@/utils/index.js';
export default {
  name: 'options-tags',
  props: {
    uuid: {
      type: String,
      default: ''
    },
    scenesVal: {
      type: String,
      default: ''
    },
    cacheUuid: {
      type: String,
      default: ''
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    isCache: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      popoverShow: false,
      leftList: [],
      rightList: [],
      leftValue: '',
      rightValue: '',
      leftCheckList: [],
      rightCheckList: [],
      params: {
        selectType: 2, //下拉选择项
        key: '', //32位唯一值
        isAll: 0, //是否勾选全部 1是 0否
        value: '', //isAll=0时，必填，选中项id，多个逗号分隔
        removeItems: '', //否isAll=1，取消选中项的id，多个逗号分隔
        isClique: 0,
        search: ''
      },
      rightParams: {
        key: this.uuid,
        selectType: 2,
        search: this.rightValue,
        currentPage: 1,
        pageSize: 20
      },
      rightHoverIndex: null,
      rightTotal: 0,
      leftTotal: 0,
      moreShow: false,
      moreLoading: false
    };
  },
  computed: {
    computedLeftCount() {
      if (this.params.isAll) {
        let minuend = this.leftList.length - this.leftCheckList.length;
        return this.leftTotal - minuend;
      } else {
        return this.leftList
          .map(v => {
            return this.leftCheckList.includes(v.tagId);
          })
          .filter(v => v).length;
      }
    }
  },
  created() {
    this.getLeftList();
    this.rightSearch();
    if (!this.isAdd) {
      this.copyStoreWidget();
    }
    log(this.uuid, this.cacheUuid);
  },
  methods: {
    // 右侧搜索
    rightSearch() {
      this.rightParams.currentPage = 1;
      this.getRightList().then(res => {
        this.rightList = res;
      });
    },
    // 拉取左侧数据
    getLeftList() {
      this.params.isAll = 0;
      this.leftCheckList = [];
      this.axios
        .get(baseUrl + '/api-plug/tag-list?requestProject=gic-web&search=' + this.leftValue)
        .then(res => {
          this.leftList = (res.data.result && res.data.result.result) || [];
          this.leftTotal = (res.data.result && res.data.result.totalCount) || 0;
        })
        .catch(err => {
          log(err);
        });
    },
    // 拉取右侧数据
    getRightList() {
      return new Promise((resolve, reject) => {
        this.moreLoading = true;
        this.rightParams.key = this.isCache ? this.cacheUuid : this.uuid;
        this.rightParams.search = this.rightValue;
        this.axios
          .post(baseUrl + '/api-plug/list-right-data?requestProject=gic-web', qs.stringify(this.rightParams))
          .then(res => {
            this.moreLoading = false;
            if (res.data.errorCode === 0) {
              this.rightTotal = (res.data.result && res.data.result.totalCount) || 0;
              let list = (res.data.result && res.data.result.result) || [];
              // 没有拉取到数据，说明没有更多数据
              if (list.length < 20) {
                this.moreShow = false;
              } else {
                this.moreShow = true;
              }
              resolve(list);
            } else {
              reject(new Error('获取列表错误'));
            }
          })
          .catch(err => {
            reject(new Error('获取列表错误'));
            log(err);
          });
      });
    },
    // 左侧数据移动到右侧
    saveToRight() {
      this.params.key = this.isAdd ? this.uuid : this.cacheUuid;
      this.params.search = this.leftValue || '';
      if (this.params.isAll) {
        this.params.removeItems = this.leftList
          .filter(v => {
            return this.leftCheckList.indexOf(v.tagId) < 0;
          })
          .map(v => v.tagId)
          .join(',');
      } else {
        this.params.value = this.leftCheckList.join(',');
        if (!this.params.value) {
          this.$message({ type: 'warning', message: '门店选择不能为空' });
          return;
        }
      }
      if (this.scenesVal) {
        this.params.scenes = this.scenesVal;
      }
      this.axios
        .post(baseUrl + '/api-plug/save-store-widget?requestProject=gic-web', qs.stringify(this.params))
        .then(res => {
          this.rightParams.currentPage = 1;
          if (!this.isAdd) {
            this.$emit('update:isCache', true);
          }
          this.$nextTick(_ => {
            this.getRightList().then(res => {
              this.rightList = res;
            });
          });
        })
        .catch(err => {
          log(err);
        });
    },
    // 删除右侧全部
    deleteRightAll() {
      this.axios
        .get(baseUrl + '/api-plug/remove-allitems?requestProject=gic-web&key=' + (this.isAdd ? this.uuid : this.cacheUuid))
        .then(res => {
          if (res.data.errorCode === 0) {
            if (!this.isAdd) {
              this.$emit('update:isCache', true);
            }
            this.rightParams.currentPage = 1;
            this.$nextTick(_ => {
              this.getRightList().then(res => {
                this.rightList = res;
              });
            });
          } else {
            this.$message({ type: 'error', message: '清除全部失败' });
          }
        })
        .catch(err => {
          log(err);
        });
    },

    // 删除右侧单选或者多选数据
    deleteRightItems(item) {
      let params = {
        key: this.isAdd ? this.uuid : this.cacheUuid,
        removeItems: item || this.rightCheckList.join(',')
      };
      log(this.isAdd, this.uuid, this.cacheUuid, this.deleteRightItems);
      // return;
      // debugger;
      this.params.value = this.leftCheckList.join(',');
      this.axios
        .post(baseUrl + '/api-plug/remove-items?requestProject=gic-web', qs.stringify(params))
        .then(res => {
          if (!this.isAdd) {
            this.$emit('update:isCache', true);
          }
          this.rightParams.currentPage = 1;
          this.$nextTick(_ => {
            this.getRightList().then(res => {
              this.rightList = res;
            });
            this.rightCheckList = [];
          });
        })
        .catch(err => {
          log(err);
        });
    },
    // 选中所有数据
    handleCheckAllChange(val) {
      this.leftCheckList = val ? this.leftList.map(v => v.tagId) : [];
    },
    // 加载更多
    loadMore() {
      this.rightParams.currentPage += 1;
      this.getRightList().then(res => {
        if (res instanceof Array) {
          res.map(v => {
            this.rightList.push(v);
          });
        }
      });
    },
    // 把老数据拷贝到新的临时id上
    copyStoreWidget() {
      if (this.scenesVal) {
        this.axios.get(baseUrl + '/api-plug/copy-store-widget?requestProject=gic-web&oldKey=' + this.uuid + '&newKey=' + this.cacheUuid + '&scencs=' + this.scenesVal).then(res => {
          if (res.data.errorCode === 0) {
            log('拷贝成功');
          }
        });
      } else {
        this.axios.get(baseUrl + '/api-plug/copy-store-widget?requestProject=gic-web&oldKey=' + this.uuid + '&newKey=' + this.cacheUuid).then(res => {
          if (res.data.errorCode === 0) {
            log('拷贝成功');
          }
        });
      }
    },
    // 确定并派发事件
    confirm() {
      this.$emit('option-change');
      this.popoverShow = false;
    }
  }
};
</script>

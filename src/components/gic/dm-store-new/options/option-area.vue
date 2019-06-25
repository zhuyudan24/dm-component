<template>
  <el-popover class="vertical-baseline" placement="bottom-start" width="430" height="400" trigger="click" v-model="popoverShow">
    <div class="dm-store__area" style="height: 400px;">
      <!-- 左侧 -->
      <div class="dm-store__left">
        <div class="dm-store__list" style="height:100%;">
          <div v-for="(v, i) in areaList" :key="i" class="dm-store__item" @click="clickProvince(v, i)">
            <div>
              <el-checkbox class="inline-block" :indeterminate="v.indeterminate" v-model="v.isCheck" @change="checkProvinceChange(v, i)"></el-checkbox>
              <span class="inline-block"> {{ v.provinceName }}</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="dm-store__right">
        <div class="dm-store__list" style="height:100%;">
          <p v-for="(v, i) in currentCityList" :key="i" class="dm-store__item">
            <el-checkbox v-model="v.isCheck" @change="checkCityChange(v)">{{ v.cityName }}</el-checkbox>
          </p>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="dm-store__btn">
        <span class="dm-store__btn--cancel" @click="popoverShow = false">取 消</span>
        <el-button class="dm-store__btn--cancel" type="text" @click="saveArea">确 定</el-button>
      </div>
    </div>
    <!-- 展示区 -->
    <div class="el-input dm-store__reference w240" slot="reference">
      <div class="el-input__inner block">已选择{{ totalProvince }}个省、{{ totalCity }}个市</div>
    </div>
  </el-popover>
</template>
<script>
import qs from 'qs';
import { baseUrl } from '@/config/index.js';
import { log } from '@/utils/index.js';
export default {
  name: 'options-area',
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
  watch: {
    areaList: {
      /* indeterminate isCheck
       * true true 半勾选
       * false false 不选
       * false true 全选
       */
      handler(val) {
        // 全选计算省数量
        this.totalProvince = this.areaList.filter(v => !v.indeterminate && v.isCheck).length;
        this.totalCity = 0;
        this.areaList.map(v => {
          // 半勾选计算市数量
          if (v.isCheck && v.children.length) {
            v.children.map(w => {
              if (w.isCheck) {
                this.totalCity++;
              }
            });
          }
        });
      },
      deep: true
    }
  },
  data() {
    return {
      popoverShow: false,
      areaList: [],
      currentCityList: [],
      currentIndex: 0,
      totalCity: 0,
      totalProvince: 0,
      defaultProps: {
        children: 'children',
        label: 'label',
        id: 'id'
      },
      params: {
        selectType: 3, // 是	int	下拉选择项
        key: '', // 是	string	32位唯一值
        isAll: 0, // 是	int	是否勾选全部 1是 0否
        value: '', //否	string	isAll=0时，必填，选中项id，多个逗号分隔
        removeItems: '', //否	string	isAll=1，取消选中项的id，多个逗号分隔
        isClique: 0
      }
    };
  },
  created() {
    this.getAreaTree();
    if (!this.isAdd) {
      this.copyStoreWidget();
    }
    log(this.uuid, this.cacheUuid);
  },
  methods: {
    // 获取树形结构
    async getAreaTree() {
      let res = await this.axios.get(baseUrl + '/api-plug/dict-district-tree?requestProject=gic-web');
      this.areaList = res.data.result.map(v => ({
        isCheck: false,
        indeterminate: false,
        label: v.provinceName,
        id: v.provinceId,
        ...v,
        children: v.children.map(w => ({
          isCheck: false,
          label: w.cityName,
          id: w.cityId,
          ...w
        }))
      }));
      await this.getCheckedData();
    },
    // 获取已选择项
    getCheckedData() {
      return new Promise((resolve, reject) => {
        let params = {
          key: this.isCache ? this.cacheUuid : this.uuid,
          selectType: 3,
          search: '',
          currentPage: 1,
          pageSize: 3000
        };
        this.axios
          .post(baseUrl + '/api-plug/list-right-data?requestProject=gic-web', qs.stringify(params))
          .then(res => {
            let list = (res.data.result && res.data.result.result) || [];
            list
              .map(u => u.id)
              .map(u => {
                this.areaList.map(v => {
                  // 全选 市一起勾选
                  if (u === v.provinceId) {
                    v.indeterminate = false;
                    v.isCheck = true;
                    v.children.map(w => {
                      w.isCheck = true;
                    });
                  }
                  // 半勾选
                  v.children.map(w => {
                    if (u === w.cityId) {
                      w.isCheck = true;
                      v.indeterminate = true;
                      v.isCheck = true;
                    }
                  });
                });
              });
          })
          .catch(err => {
            log(err);
          });
      });
    },
    clickProvince(item, index) {
      this.currentIndex = index;
      this.currentCityList = item.children || [];
    },
    checkProvinceChange(item, index) {
      this.currentIndex = index;
      this.currentCityList = item.children || [];
      item.children.map(v => {
        v.isCheck = item.isCheck;
      });
      if (item.children.length) {
        const isAllCheck = item.children.every(v => v.isCheck);
        const isSomeCheck = item.children.some(v => v.isCheck);
        item.isCheck = isSomeCheck;
        item.indeterminate = !isAllCheck && isSomeCheck;
      }
    },
    /* indeterminate isCheck
     * true true 半勾选
     * false false 不选
     * false true 全选
     */
    checkCityChange() {
      let item = this.areaList[this.currentIndex];
      const isAllCheck = item.children.every(v => v.isCheck);
      const isSomeCheck = item.children.some(v => v.isCheck);
      item.isCheck = isSomeCheck;
      item.indeterminate = !isAllCheck && isSomeCheck;
      log(item.indeterminate, item.isCheck);
    },
    saveArea() {
      this.params.key = this.isAdd ? this.uuid : this.cacheUuid;
      let valueList = [];
      this.areaList.map(v => {
        // 全选 只传省ID
        if (!v.indeterminate && v.isCheck) {
          valueList.push(v.provinceId);
        }
        if (v.indeterminate && v.isCheck && v.children.length) {
          // 半选 传市id
          v.children.map(w => {
            if (w.isCheck) {
              valueList.push(w.cityId);
            }
          });
        }
      });
      this.params.value = valueList.filter(v => v).join(',');
      if (!this.params.value) {
        this.$message({ type: 'warning', message: '门店选择不能为空' });
        return;
      }
      if (this.scenesVal) {
        this.params.scenes = this.scenesVal;
      }
      this.axios
        .post(baseUrl + '/api-plug/save-store-widget?requestProject=gic-web', qs.stringify(this.params))
        .then(res => {
          if (res.data.errorCode === 0) {
            if (!this.isAdd) {
              this.$emit('update:isCache', true);
            }
            this.$emit('option-change');
            this.popoverShow = false;
          } else {
            this.$message({ type: 'error', message: '保存失败' });
          }
        })
        .catch(err => {
          log(err);
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
    }
  }
};
</script>

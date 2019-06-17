<template>
  <section class="dm-store">
    <el-select v-model="storeType" placeholder="请选择" class="w200 inline-block mr5">
      <el-option v-for="(v, i) in leftList" :key="i" :label="v.label" :value="v.value"></el-option>
    </el-select>
    <option-type v-if="storeType === 1" :uuid="newUuid" :scenesVal="scenesVal" :cacheUuid="cacheUuid" :isAdd="isAdd" :isCache.sync="isSendCache"></option-type>
    <option-tags v-if="storeType === 2" :uuid="newUuid" :scenesVal="scenesVal" :cacheUuid="cacheUuid" :isAdd="isAdd" :isCache.sync="isSendCache"></option-tags>
    <option-area v-if="storeType === 3" :uuid="newUuid" :scenesVal="scenesVal" :cacheUuid="cacheUuid" :isAdd="isAdd" :isCache.sync="isSendCache"></option-area>
    <option-group v-if="storeType === 4" :uuid="newUuid" :scenesVal="scenesVal" :cacheUuid="cacheUuid" :isAdd="isAdd" :isCache.sync="isSendCache"></option-group>
    <option-part v-if="storeType === 5" :uuid="newUuid" :scenesVal="scenesVal" :cacheUuid="cacheUuid" :isAdd="isAdd" :isCache.sync="isSendCache"></option-part>
  </section>
</template>

<script>
import qs from 'qs';
import uuidv1 from 'uuid/v1';
import { baseUrl } from '@/config/index.js';
import { log } from '@/utils/index.js';
import optionType from './options/option-type';
import optionArea from './options/option-area';
import optionTags from './options/option-tags';
import optionGroup from './options/option-group';
import optionPart from './options/option-part';
const leftList = [{ label: '所有门店', value: 0 }, { label: '门店类型', value: 1 }, { label: '门店标签', value: 2 }, { label: '门店区域', value: 3 }, { label: '门店分组', value: 4 }, { label: '部分门店', value: 5 }];
const typeList = [{ label: '自营', value: '0' }, { label: '联营', value: '1' }, { label: '代理', value: '2' }, { label: '代销', value: '3' }, { label: '托管', value: '4' }];

export default {
  name: 'vue-gic-store-group',
  props: {
    uuid: {
      type: String,
      default: ''
    },
    scenesVal: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default() {
        return [0, 1, 2, 3, 4, 5];
      }
    },
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  components: {
    'option-type': optionType,
    'option-area': optionArea,
    'option-tags': optionTags,
    'option-group': optionGroup,
    'option-part': optionPart
  },
  watch: {
    storeType(val) {
      if (!val) {
        this.$emit('update:uuid', this.cacheUuid);
        this.isSendCache = true;
        this.saveInit(this.isSendCache);
      }
    },
    uuid(val) {
      // 编辑或者详情
      if (val && !this.isAdd) {
        if (this.isSendCache) return;
        this.init();
      }
    },
    isSendCache(val) {
      if (val) {
        this.$emit('update:uuid', this.cacheUuid);
        this.$nextTick(_ => {
          log(this.uuid);
        });
      }
    }
  },
  data() {
    return {
      storeType: 0, // 一级选择值
      leftList: [],
      // 创建一个新的uuid
      newUuid: uuidv1().replace(/-/g, ''),
      // 编辑情况下的备份id
      cacheUuid: uuidv1().replace(/-/g, ''), // 生成uuid
      // 编辑的情况下是否发送备份ID
      isSendCache: false
    };
  },
  created() {
    if (this.options instanceof Array) {
      leftList.map(v => {
        if (this.options.indexOf(v.value) >= 0) {
          this.leftList.push(v);
        }
      });
    }
    this.init();
  },
  methods: {
    // 获取配置项
    init() {
      this.storeType = 0;
      /*如果没有uuid的情况下
      1 设置一个新的uuid
      2 并传给父级
      3 保存
      */
      if (this.isAdd) {
        this.$emit('update:uuid', this.newUuid);
        // 这是保存新的id
        this.saveInit();
      } else {
        /*如果有uuid的情况下
         * 1 创建一个新的uuid备用 newUUid
         * 2 保存 一下这个新的uuid
         * 3 用父级传来的uuid获取配置项
         */
        this.newUuid = this.uuid;
        // 这里保存备份id
        this.saveInit(true);
        if (this.newUuid) {
          this.getStoreConfig();
        }
      }
    },
    //获取配置
    getStoreConfig() {
      return new Promise((resolve, reject) => {
        let params = {
          key: this.isAdd ? this.newUuid : this.isSendCache ? this.cacheUuid : this.uuid,
          currentPage: 1,
          pageSize: 20
        };
        this.axios
          .post(baseUrl + '/api-plug/get-store-widget-config?requestProject=gic-clique', qs.stringify(params))
          .then(res => {
            if (res.data.errorCode === 0) {
              this.storeType = res.data.result.selectType || 0;
              let list = res.data.result.config.result || [];
              let computedList = [];
              let name = '';
              if (this.storeType === 1) {
                list.map(v => {
                  typeList.map(w => {
                    if (v.id == w.value) {
                      computedList.push({ id: v.id, name: w.label });
                    }
                  });
                });
              }
              leftList.map(v => {
                if (this.storeType === v.value) {
                  name = v.label;
                }
              });
              resolve({
                list: this.storeType === 1 ? computedList : list,
                type: res.data.result.selectType || 0,
                name: name
              });
            } else {
              reject('接口错误');
            }
          })
          .catch(err => {
            reject(err);
            log(err);
          });
      });
    },
    // 保存
    saveInit(isCacheUuid = false) {
      let params = {
        selectType: 0,
        key: isCacheUuid ? this.cacheUuid : this.newUuid,
        isAll: 0,
        value: '',
        removeItems: '',
        isClique: 1,
        scencs: this.scenesVal
      };
      this.axios
        .post(baseUrl + '/api-plug/save-store-widget?requestProject=gic-clique', qs.stringify(params))
        .then(res => {})
        .catch(err => {
          log(err);
        });
    },
    // 判断门店是否保存
    isStoreSave() {
      return new Promise((resolve, reject) => {
        let params = {
          key: this.isAdd ? this.newUuid : this.isSendCache ? this.cacheUuid : this.uuid,
          selectType: this.storeType
        };
        if (params.selectType === 0) {
          resolve(true);
        }
        this.axios
          .post(baseUrl + '/api-plug/is-empty?requestProject=gic-clique', qs.stringify(params))
          .then(res => {
            log(res);
            if (res.data.errorCode === 0) {
              resolve(res.data.result);
            } else {
              reject(new Error('系统错误'));
            }
          })
          .catch(err => {
            reject(new Error('系统错误'));
          });
      });
    }
  }
};
</script>

<style lang="scss">
@import url('../dm-store-new/index.css');
</style>

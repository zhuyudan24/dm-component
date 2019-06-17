<template>
  <el-popover class="vertical-baseline" placement="bottom-start" width="214" trigger="click" v-model="popoverShow">
    <el-checkbox-group v-model="checkedList" @change="saveToRight">
      <label :name="v.value" class="dm-store__type__item" v-for="(v, i) in typeList" :key="i">
        <el-checkbox :label="v.value">{{ v.label }}</el-checkbox>
      </label>
    </el-checkbox-group>
    <div class="dm-store__line"></div>
    <div class="el-input dm-store__reference w240" slot="reference">
      <div class="el-input__inner dm-store__inputtag">
        <el-tag v-for="(v, i) in checkedList" size="small" :key="i" closable @close="delItem(v)">{{ filterLabel(v) }}</el-tag>
        <span class="gray-color dm-store__inputtag--tips" v-show="checkedList.length === 0">请选择门店</span>
      </div>
      <el-popover placement="top-start" popper-class="select-shop__popper" width="300" trigger="hover">
        <el-tag v-for="(v, i) in checkedList" class="dm-store__total--tag" size="small" :key="i" closable @close="delItem(v)">{{ filterLabel(v) }}</el-tag>
        <span slot="reference" class="dm-store__inputtag--total" v-show="checkedList.length">共{{ checkedList.length }}项</span>
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
  name: 'options-type',
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
  created() {
    this.getRightList();
    if (!this.isAdd) {
      this.copyStoreWidget();
    }
    log(this.uuid, this.cacheUuid);
  },
  data() {
    return {
      typeList: [{ label: '自营', value: '0' }, { label: '联营', value: '1' }, { label: '代理', value: '2' }, { label: '代销', value: '3' }, { label: '托管', value: '4' }],
      checkedList: [],
      popoverShow: false,
      params: {
        selectType: 1, //下拉选择项
        key: '', // 32位唯一值
        isAll: 0, //是否勾选全部 1是 0否
        value: '', //isAll=0时，必填，选中项id，多个逗号分隔
        removeItems: '', //isAll=1，取消选中项的id，多个逗号分隔
        isClique: 0
      }
    };
  },
  methods: {
    // label 的filter
    filterLabel(val) {
      let result = '';
      this.typeList.map(v => {
        if (val === v.value) {
          result = v.label;
        }
      });
      return result;
    },
    // 拉取右侧数据
    getRightList() {
      let params = {
        key: this.isCache ? this.cacheUuid : this.uuid,
        selectType: 1,
        search: '',
        currentPage: 1,
        pageSize: 20
      };
      this.axios
        .post(baseUrl + '/api-plug/list-right-data?requestProject=gic-web', qs.stringify(params))
        .then(res => {
          if (res.data.errorCode === 0) {
            this.checkedList = ((res.data.result && res.data.result.result) || []).map(v => v.id);
          }
        })
        .catch(err => {
          log(err);
        });
    },
    // 保存
    saveToRight() {
      this.params.key = this.isAdd ? this.uuid : this.cacheUuid;
      this.params.value = this.checkedList.join(',');
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
          // 如果是编辑 并且有操作 把isCache设为true 最终保存是临时id
          if (!this.isAdd) {
            this.$emit('update:isCache', true);
          }
        })
        .catch(err => {
          log(err);
        });
    },
    // 删除右侧单选或者多选数据
    delItem(v) {
      let params = {
        key: this.isAdd ? this.uuid : this.cacheUuid,
        removeItems: v,
        value: ''
      };
      log(this.isAdd, this.uuid, this.cacheUuid);
      this.axios
        .post(baseUrl + '/api-plug/remove-items?requestProject=gic-web', qs.stringify(params))
        .then(res => {
          if (!this.isAdd) {
            this.$emit('update:isCache', true);
          }
          this.$nextTick(_ => {
            this.getRightList();
          });
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
    },
    // 确定并派发事件
    confirm() {
      this.$emit('option-change');
      this.popoverShow = false;
    }
  }
};
</script>

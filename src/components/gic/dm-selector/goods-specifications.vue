<template>
  <div class="goods-specifications">
    <div class="check-title">
      选择规格 &nbsp;
      <load-select v-model="specvalue" @scrollload="loadMore" :load="load" @change-load="changeLoad">
        <gic-load-item v-for="item in speOptions" :key="item.standardId" :value="item.standardId" :label="item.standardName" @pass-item="resiver"> </gic-load-item>
      </load-select>

      <!-- 规格类型筛选 -->
      <div class="spe-type">
        <el-radio v-model="speRadio" label="2">通过规格值筛选</el-radio>
        <el-radio v-model="speRadio" label="1">通过规格值组筛选</el-radio>
      </div>
    </div>

    <div class="spe-con">
      <!-- <spes v-if="spesGroup" :list-spes="spesList" :goods-index="goodsIndex"></spes>
      <spe-group v-if="spesVal" :list-group="groupList" :goods-index="goodsIndex" @spe-list="speList"></spe-group> -->
      <spes v-if="spesGroup && speRadio == '1'" :list-spes="spesList" :return-list="returnList" :goods-index="goodsIndex"></spes>
      <spe-group v-if="spesVal && speRadio == '2'" :list-group="groupList" :return-list="returnList" :goods-index="goodsIndex" @spe-list="speList"></spe-group>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import Emitter from './assist/emitter';
import Spes from './spes';
import SpeGroup from './spe-group';
import LoadSelect from './load-select';
import GicLoadItem from './load-item';
import { baseUrl } from '@/config/index.js';
export default {
  name: 'goods-specifications',

  mixins: [Emitter],

  components: {
    Spes,
    SpeGroup,
    LoadSelect,
    GicLoadItem
  },

  props: {
    goodsIndex: Array,
    listReback: [Array, Object]
  },

  data() {
    return {
      spesGroup: false,
      spesVal: false,
      speOptions: [], // 规格
      speRadio: '2',
      currentPage: 1,
      load: false,
      specvalue: '',
      spesList: [],
      returnList: [],
      groupList: [] // 规格值 在规格值组里面
    };
  },

  methods: {
    speList(list) {
      this.dispatch('vue-gic-goods-selector', 'pass-spe-group-list', {
        index: this.goodsIndex,
        item: list,
        type: 'standard'
      });
    },
    loadMore() {
      if (this.speOptions.length == (this.currentPage - 1) * 20) {
        this.getOptionsData('success');
      } else {
        this.load = true;
      }
    },
    // 规格查找
    getOptionsData(suc) {
      const param = {
        type: 'TYP_NORMAL',
        currentPage: this.currentPage,
        pageSize: 10000
      };
      this.axios
        .get(`${baseUrl}/api-goods/page-standard?requestProject=goods`, {
          params: param
        })
        .then(res => {
          let data;
          if (res.data.errorCode === 0) {
            data = res.data.result;
            this.speOptions = this.speOptions.concat(data.result);
            this.currentPage++;
            if (suc == 'success') {
              this.load = true;
            }
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },

    changeLoad() {
      this.load = false;
    },
    resiver(val) {
      // 选中的值
      this.specvalue = val;
      this.specList = this.speOptions.find(val => val.standardName == this.specvalue);
      if (this.specList && this.specList.standardId) {
        this.validateGoods();
      }
      this.dispatch('vue-gic-goods-selector', 'pass-standardId', {
        index: this.goodsIndex,
        items: {
          parentId: this.specList.standardId
        }
      });
    },
    // 查询是规格值还是规格值组
    validateGoods() {
      this.axios.get(`${baseUrl}/api-goods/validate-standard-pull-data?requestProject=goods&standardId=${this.specList.standardId}`).then(res => {
        const data = res.data;
        // false是规格值组 true 是规格值
        if (data.errorCode === 0) {
          if (data.result) {
            this.spesGroup = false;
            this.spesVal = true;
            this.speRadio = '2';
            this.getSpeData();
          } else {
            this.spesVal = false;
            this.spesGroup = true;
            this.speRadio = '1';
            this.getSpeGroupData();
          }
        }
      });
    },
    // 规格值分组数据
    getSpeGroupData() {
      const param = {
        currentPage: 1,
        pageSize: 10000,
        parentId: this.specList.standardId,
        type: 'TYP_GROUP',
        categoryId: this.specList.gicStandardId
      };
      this.axios
        .get(`${baseUrl}/api-goods/page-standard?requestProject=goods`, {
          params: param
        })
        .then(res => {
          if (res.data.errorCode === 0) {
            const data = res.data.result;
            if (data.result && data.result.length) {
              this.spesList = data.result;
            } else {
              this.spesList = [];
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 规格值数据
    getSpeData() {
      const param = {
        currentPage: 1,
        pageSize: 20,
        standardId: this.specList.standardId
      };
      this.axios
        .get(`${baseUrl}/api-goods/page-standard-values?requestProject=goods`, {
          params: param
        })
        .then(res => {
          if (res.data.errorCode === 0) {
            const data = res.data.result;
            if (data.result && data.result.length) {
              const middleData = data.result;
              this.groupList = middleData;
            } else {
              this.groupList = [];
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  mounted() {
    this.$on('pass-item', this.resiver);
    // 用来回显规格
    setTimeout(() => {
      let index = this.speOptions.findIndex(el => el.standardId == this.listReback.parentId);
      if (index > -1) {
        this.specvalue = this.speOptions[index].standardName;
        this.specList = this.speOptions.find(val => val.standardName == this.specvalue);
        this.returnList = this.listReback.ids;
        this.validateGoods(this.listReback.parentId);
      }
    }, 100);
  },

  beforeMount() {
    this.getOptionsData();
  }
};
</script>
<style lang="less" scoped>
.goods-box {
  .check-title {
    height: 48px;
    line-height: 48px;
    padding-left: 20px;
    font-size: 14px;
    background-color: #ebeef5;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }
  .spe-con {
    max-height: 295px;
    padding: 10px 20px;
    overflow: hidden;
  }
  .spe-type {
    float: right;
    margin-right: 20px;
  }
}
</style>

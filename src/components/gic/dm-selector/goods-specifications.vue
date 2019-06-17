<template>
  <div class="goods-specifications">
    <div class="check-title">
      选择规格 &nbsp;
      <load-select v-model="specvalue" @scrollload="loadMore" :load="load" @change-load="changeLoad">
        <gic-load-item v-for="item in speOptions" :key="item.standardId" :value="item.standardId" :label="item.standardName" @pass-item="resiver"> </gic-load-item>
      </load-select>

      <!-- 规格类型筛选 -->
      <div class="spe-type">
        <el-radio v-model="speRadio" v-if="spesGroup" label="1">通过规格值组筛选</el-radio>
        <el-radio v-model="speRadio" v-if="spesVal" label="2">通过规格值筛选</el-radio>
      </div>
    </div>

    <div class="spe-con">
      <spes v-if="spesGroup && speRadio == '1'" :list-spes="spesList" :goods-index="goodsIndex"></spes>
      <spe-group v-if="spesVal && speRadio == '2'" :list-group="groupList" :goods-index="goodsIndex"></spe-group>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import Spes from './spes';
import SpeGroup from './spe-group';
import LoadSelect from './load-select';
import GicLoadItem from './load-item';
import { baseUrl } from '@/config/index.js';
import { log } from '@/utils/index.js';
export default {
  name: 'goods-specifications',

  components: {
    Spes,
    SpeGroup,
    LoadSelect,
    GicLoadItem
  },

  props: {
    goodsIndex: Array
  },

  data() {
    return {
      spesGroup: false,
      spesVal: false,
      speOptions: [], // 规格
      speRadio: '1',
      currentPage: 1,
      load: false,
      specvalue: '',
      spesList: [],
      groupList: [] // 规格值 在规格值组里面
    };
  },

  methods: {
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
        pageSize: 20
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
        pageSize: 20,
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
          log(err);
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
              this.groupList = middleData.map(el => {
                if (el.standardGroupNames && el.standardGroupNames.length) {
                  el.standardGroup = [];
                  for (let i = 0; i < el.standardGroupNames.length; i++) {
                    el.standardGroup.push({
                      valueName: el.standardGroupNames[i],
                      valueId: el.standardGroupIds[i]
                    });
                  }
                }
                return el;
              });
            } else {
              this.groupList = [];
            }
          }
        })
        .catch(err => {
          log(err);
        });
    }
  },

  mounted() {
    // this.$on('pass-item', this.resiver);
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
    max-height: 285px;
    padding: 10px 20px;
    overflow: hidden;
  }
  .spe-type {
    float: right;
    margin-right: 20px;
  }
}
</style>

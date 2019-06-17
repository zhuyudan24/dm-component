<template>
  <div class="caspanel-box">
    <span class="ate-keys-box">
      <el-input placeholder="搜索关键字" prefix-icon="el-icon-search" v-model="keys"> </el-input>
    </span>
    <div class="casitem-box">
      <ul v-if="data && data.length" class="casitem-ul">
        <Casitem v-for="(item, i) in data" :key="i" :data="item" :tmp-item="tmpItem" @click.native.stop="handleClickItem(item)" @dblclick.native.stop="handleDbClickItem(item)"> </Casitem>
      </ul>
    </div>

    <Caspanel v-if="sublist && sublist.length" :data="sublist" :change-on-select="changeOnSelect"></Caspanel>
  </div>
</template>

<script>
import Casitem from './casitem';
import Emitter from '../assist/emitter';
import { baseUrl } from '@/config/index.js';
import { log } from '@/utils/index.js';
let key = 1;

export default {
  name: 'Caspanel',

  components: {
    Casitem
  },

  mixins: [Emitter],

  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    changeOnSelect: Boolean
  },

  data() {
    return {
      tmpItem: {},
      result: [],
      sublist: [],
      keys: ''
    };
  },

  methods: {
    handleClickItem(item) {
      this.tmpItem = Object.assign({}, item);
      this.getNextData(item.categoryId);
    },
    // 双击
    handleDbClickItem(item) {
      const goodItem = this.findComponentUpward(this, 'gooditem');
      item.index = goodItem.goodsIndex;
      const tags = Object.assign({}, item);
      // 拿到tags比较是否有重复的id
      const ategory = this.findComponentUpward(this, 'goods-ategory');
      const Tags = ategory.tags;
      let hasTag;

      if (Tags && Tags.length) {
        hasTag = Tags.findIndex(tag => {
          return tag.categoryId === item.categoryId;
        });
      }
      if (hasTag != void 0 && hasTag != -1) {
        this.$message({
          message: '已存在改品类，不能重复添加',
          type: 'warning'
        });
      } else {
        this.dispatch('vue-gic-selector', 'handle-ategory', tags);
      }
    },
    // 查找下级
    getNextData(id) {
      this.axios
        .get(`${baseUrl}/api-mall/list-mall-goods-children-category?requestProject=mall&categoryId=${id}`)
        .then(res => {
          if (res.data.errorCode === 0) {
            const data = res.data.result;
            if (data && data.length) {
              this.sublist = data;
            } else if (data && data.length == 0) {
              this.sublist = [];
            }
          } else {
            // 占位
          }
        })
        .catch(err => {
          log(err);
        });
    },
    getKey() {
      return key++;
    }
  }
};
</script>

<style lang="less" scoped>
.caspanel-box {
  position: relative;
  display: inline-block;
  vertical-align: top;
  height: 240px;
  .ate-keys-box {
    display: inline-block;
    height: 32px;
    width: 138px;
    padding: 8px 10px;
    border: 1px solid #e8eaec;
    border-bottom: none;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-color: #f5f7fa;
  }
  .casitem-box {
    position: absolute;
    border: 1px solid #e8eaec;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-top: none;
    background-color: #fff;
    .casitem-ul {
      display: inline-block;
      vertical-align: top;
      width: 158px;
      height: 190px;
      list-style: none;
      margin: 0;
      overflow: auto;
    }
  }
  .caspanel-box {
    position: absolute;
    margin-left: 12px;
  }
}
</style>

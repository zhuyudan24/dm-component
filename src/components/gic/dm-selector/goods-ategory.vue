<template>
  <div class="goods-ategory">
    <div class="check-title">
      <div class="ategory-lists">
        <span class="ate-txt" v-if="!tags.length">下方选择品类</span>
        <el-tag v-for="tag in tags" size="small" :key="tag.categoryId" closable @close="handleClose(tag)"> {{ tag.categoryName }} </el-tag>
        <el-popover placement="top" width="320" trigger="hover" popper-class="selector-popper">
          <el-tag class="dm-pop-tag" v-for="tag in tags" size="small" :key="tag.categoryId" closable @close="handleClose(tag)"> {{ tag.categoryName }} </el-tag>
          <span class="pop-tips" slot="reference">共{{ tags.length }}项</span>
        </el-popover>
      </div>
    </div>
    <div class="ate-group">
      <Cascader :data="ateData"></Cascader>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import Cascader from './cascader';
import { baseUrl } from '@/config/index.js';
import { log } from '@/utils/index.js';
export default {
  name: 'goods-ategory',

  components: {
    Cascader
  },

  props: {
    tags: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      ateData: [{}]
    };
  },

  methods: {
    getData() {
      this.axios
        .get(`${baseUrl}/api-mall/list-mall-goods-all-category?requestProject=mall`)
        .then(res => {
          if (res.data.errorCode == 0) {
            const data = res.data.result;
            if (data && data.length) {
              this.ateData = data;
            }
          } else {
            // 占位
          }
        })
        .catch(err => {
          log(err);
        });
    },
    handleClose(tag) {
      let index = this.tags.findIndex(t => {
        return t.categoryId === tag.categoryId;
      });

      if (index != -1) {
        this.tags.splice(index, 1);
      }
    }
  },

  created() {
    this.getData();
  }
};
</script>

<style lang="less" scoped>
.goods-ategory {
  .check-title {
    height: 48px;
    line-height: 48px;
    background-color: #ebeef5;
    overflow: hidden;
  }
  .ategory-lists {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    margin: 7px 20px;
    padding: 2px 10px;
    height: 32px;
    line-height: 24px;
    font-size: 0px;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: #fff;
    .ate-txt {
      font-size: 14px;
      color: #c0c4cc;
    }
    .pop-tips {
      position: absolute;
      top: 0;
      right: 0;
      height: 32px;
      line-height: 32px;
      width: 70px;
      text-align: center;
      font-size: 14px;
      color: #606266;
      background-color: rgba(255, 255, 255, 1);
    }
  }
  .ate-group {
    padding: 10px 12px;
    overflow-x: scroll;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.dm-pop-tag {
  margin-right: 10px;
  margin-bottom: 5px;
}
.dm-pop-tag + .dm-pop-tag {
  margin-left: 0px;
}
</style>

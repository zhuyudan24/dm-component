<template>
  <div class="spe-group">
    <div class="spe-transfer-left spe-transfer">
      <div class="check-all check-all-left">
        <el-checkbox v-model="checkLeft" @change="handleChange">全选</el-checkbox>
        <span></span>
      </div>
      <div class="transfer-tree">
        <el-input prefix-icon="el-icon-search" style="width: 200px; margin: 10px 0px;" v-model="treeLeftval" placeholder="请输入规格值名称筛选"></el-input>
        <div class="tree-content">
          <el-tree ref="leftTree" :data="rightData" show-checkbox node-key="valueId" :default-expand-all="true" :default-checked-keys="defaultLeftKeys" :props="defaultProps" @check="handleLeftCheck"> </el-tree>
        </div>
      </div>
    </div>

    <div class="spe-transfer-button">
      <el-button type="primary" @click.native="addToLeft" :disabled="!leftChecked.length" class="el-transfer__button">
        <i class="el-icon-arrow-right"></i>
      </el-button>
      <el-button type="primary" @click.native="addToRight" :disabled="!rightChecked.length" class="el-transfer__button ">
        <i class="el-icon-arrow-left"></i>
      </el-button>
    </div>

    <div class="spe-transfer-right spe-transfer">
      <div class="check-all check-all-right">
        <el-checkbox v-model="checkRight">全选</el-checkbox>
        <span></span>
      </div>

      <div class="transfer-tree">
        <el-input prefix-icon="el-icon-search" style="width: 200px; margin: 10px 0px;" v-model="treeRightval" placeholder="请输入规格值名称筛选"> </el-input>
        <div class="tree-content">
          <el-tree ref="rightTree" :data="leftData" show-checkbox node-key="valueId" :default-expand-all="true" :default-checked-keys="defaultRightKeys" :props="defaultProps" @check="handleRightCheck"> </el-tree>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'spe-group',
  props: {
    listGroup: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      leftData: [],
      rightData: [],
      leftChecked: [],
      rightChecked: [],
      defaultProps: {
        children: 'standardGroup',
        label: 'valueName'
      },
      treeRightval: '',
      treeLeftval: '',
      checkLeft: false,
      checkRight: false,
      defaultLeftKeys: [], // 左边默认选中
      defaultRightKeys: [] //
    };
  },

  watch: {
    listGroup: {
      immediate: true,
      handler(val) {
        this.rightData = val;
        this.leftData = [];
      }
    },
    leftData(newval) {
      //
    }
  },

  methods: {
    addToRight() {
      const checkIds = this.$refs.rightTree.getCheckedKeys();
      for (let i = 0; i < checkIds.length; i++) {
        for (let k = 0; k < this.leftData.length; k++) {
          if (checkIds[i] === this.leftData[k].valueId) {
            let length = this.leftData[k].standardGroupIds.length;
            checkIds.splice(i, 1 + length);
            this.leftData.splice(k, 1);
          } else {
            if (this.leftData[k].standardGroup && this.leftData[k].standardGroup.length) {
              for (let j = 0; j < this.leftData[k].standardGroup.length; j++) {
                if (this.leftData[k].standardGroup[j].valueId === checkIds[i]) {
                  this.leftData[k].standardGroup.splice(j, 1);
                }
              }
            }
          }
        }
      }
      this.rightChecked = [];
      this.$refs.rightTree.setCheckedKeys([]);
    },

    addToLeft() {
      /**
       * 首先获取左边选中的id集合 然后把左边的数据深度拷贝一份
       * 先对比第一层的id 如果不相等就比较第二层的id 过滤
       */
      this.leftData = [];
      // const checkNodes = this.$refs.leftTree.getCheckedNodes();
      const checkIds = this.$refs.leftTree.getCheckedKeys();
      const middleData = JSON.parse(JSON.stringify(this.rightData));

      for (let i = 0; i < checkIds.length; i++) {
        for (let j = 0; j < middleData.length; j++) {
          if (middleData[j].valueId === checkIds[i]) {
            // 如果存在外层的id 表示全部选择这个id
            let length = middleData[j].standardGroupIds.length;
            checkIds.splice(i, 1 + length);
            this.leftData.push(middleData[j]);
            // this.rightData.splice(j, 1);
          } else {
            if (middleData[j].standardGroup && middleData[j].standardGroup.length) {
              for (let k = 0; k < middleData[j].standardGroup.length; k++) {
                if (middleData[j].standardGroup[k].valueId === checkIds[i]) {
                  checkIds.splice(i, 1);
                  if (!middleData[j].standardCacheGroup) {
                    middleData[j].standardCacheGroup = [];
                  }
                  middleData[j].standardCacheGroup.push(middleData[j].standardGroup[k]);
                  // this.rightData[j].standardGroup.splice(k, 1);
                }
              }
              this.leftData.push(middleData[j]);
            }
          }
        }
      }

      for (let i = 0; i < this.leftData.length; i++) {
        if (this.leftData[i].standardCacheGroup) {
          this.leftData[i].standardGroup = this.leftData[i].standardCacheGroup;
        }
      }
      // 清空一下
      this.leftChecked = [];
      // this.$refs.leftTree.setCheckedKeys([]);
    },
    handleLeftCheck(data, current) {
      // 左边选择的节点
      this.leftChecked = current.checkedKeys;
    },
    handleRightCheck(data, current) {
      // 右边选择的节点
      this.rightChecked = current.checkedKeys;
    },
    handleChange(val) {
      if (this.rightData && this.rightData.length) {
        if (val) {
          this.defaultLeftKeys = this.rightData.map(el => el.valueId);
          this.leftChecked = this.rightData;
        } else {
          this.$refs.leftTree.setCheckedKeys([]);
          this.leftChecked = [];
        }
      }
    },
    handleRightChange(val) {
      if (this.leftData && this.leftData.length) {
        if (val) {
          this.defaultRightKeys = this.leftData.map(el => el.valueId);
          this.rightChecked = this.leftData;
        } else {
          this.$refs.rightTree.setCheckedKeys([]);
          this.rightChecked = [];
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.spe-group {
  position: relative;
  height: 285px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #dcdfe6;
  font-size: 0px;
  .spe-transfer {
    display: inline-block;
    vertical-align: middle;
    width: 247px;
    height: 285px;
    box-sizing: border-box;
    .check-all {
      height: 20px;
      line-height: 20px;
      padding: 10px;
      background-color: #f5f7fa;
    }
    .check-all-left {
      border-top-left-radius: 5px;
    }
    .check-all-right {
      border-top-right-radius: 5px;
    }
    .transfer-tree {
      text-align: center;
      border-radius: 50%;
    }
    .tree-content {
      height: 190px;
      overflow: auto;
    }
  }
  .spe-transfer-left {
    border-right: 1px solid #dcdfe6;
  }
  .spe-transfer-right {
    border-left: 1px solid #dcdfe6;
  }
  .spe-transfer-button {
    display: inline-block;
    vertical-align: middle;
    width: 50px;
    padding: 0 20px;
  }
  .el-transfer__button {
    margin: 0 auto;
    margin-bottom: 10px;
  }
}
</style>

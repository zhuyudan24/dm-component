<template>
  <el-popover placement="bottom" width="195" trigger="click" v-model="loadShow" popper-class="select-popper">
    <ul class="load-ul" @scroll="handleScroll" ref="loadbox">
      <slot></slot>
      <p class="el-select-dropdown__empty no-data" v-if="isEmpty">
        <i class="el-icon-loading"></i>
        {{ emptyTxt }}
      </p>
    </ul>

    <div class="load-select" slot="reference">
      <el-input placeholder="请选择" v-model="selectLabel" readonly="readonly" :class="{ 'is-focus': visible }" ref="select">
        <i slot="suffix" :class="['el-select__caret', 'el-input__icon', 'el-icon-arrow-up' + iconClass]" @click="handleIconClick"> </i>
      </el-input>
    </div>
  </el-popover>
</template>

<script>
import LoadItem from './load-item'; // 加载的item选项

export default {
  name: 'load-select',

  components: {
    LoadItem
  },

  props: {
    value: {
      required: true
    },
    load: {
      type: Boolean,
      default: false
    },
    loadover: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    iconClass() {
      if (this.visible) {
        return ' is-reverse';
      } else {
        return '';
      }
    }
  },

  data() {
    return {
      readonly: false,
      visible: false,
      selectLabel: '',
      isEmpty: false,
      emptyTxt: '',
      loadShow: false
    };
  },

  watch: {
    load: {
      immediate: true,
      handler(newval) {
        if (newval) {
          this.isEmpty = false;
          this.$emit('change-load');
          // 方案一 加载时候移动一下
          // 方案二 价格loadover 标识
          this.$refs.loadbox.scrollTop = this.$refs.loadbox.scrollHeight - 250;
        }
      }
    },
    value(newval) {
      this.selectLabel = newval;
      this.loadShow = false;
      this.visible = false;
    },
    loadShow(newval) {
      if (newval) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    }
  },

  methods: {
    handleIconClick() {
      this.visible = !this.visible;
    },
    // 滚动监听
    handleScroll(e) {
      const ele = e.target;
      // scrollHeight 获取元素内容高度
      // scrollTop 可以获取或者设置元素的偏移值
      // 满足滚到底部和上次加载结束两个条件
      if (ele.scrollHeight - ele.scrollTop == 220 && !this.isEmpty) {
        // 滚到底部 先加载
        this.emptyTxt = '加载中';
        this.isEmpty = true;
        setTimeout(_ => {
          this.$emit('scrollload');
        }, 500);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.load-select {
  display: inline-block;
  width: 200px;
  cursor: pointer;
}
.load-ul {
  position: relative;
  max-height: 200px;
  padding-bottom: 20px;
  overflow: auto;
  .no-data {
    padding: 0;
    text-align: center;
    color: #ccc;
  }
}
.el-select__caret {
  color: #c0c4cc;
  font-size: 14px;
  transition: transform 0.3s;
  transform: rotateZ(180deg);
  cursor: pointer;
}

.el-select__caret.is-reverse {
  transform: rotateZ(0deg);
}
</style>

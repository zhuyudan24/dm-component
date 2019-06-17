<template>
  <div class="dm-input" :class="{ disabled: disabled }">
    <el-input ref="elInput" v-model="currentValue" :placeholder="placeholder" :size="size" :resize="resize" :name="name" :form="form" :id="id" :minlength="minlength" :readonly="readonly" :autofocus="autofocus" :disabled="disabled" :type="type" :autosize="autosize" :rows="rows" :autoComplete="autoComplete" :max="max" :min="min" :step="step" :validateEvent="validateEvent" :suffixIcon="suffixIcon" :prefixIcon="prefixIcon" :label="label" :clearable="clearable" :tabindex="tabindex" @keyup.native="input($event.target.value)"></el-input>
    <div class="dm-input__counter" :class="{ 'text-area': type === 'textarea' }">
      <div class="dm-input__counter--inner">
        <span class="cur">{{ inputNum }}</span>
        <span class="split"> / </span>
        <span class="max">{{ maxlength || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import emitter from '../../../mixins/emitter';
import { getZhLength, getByte } from '../../../utils/index.js';

export default {
  name: 'dm-input',
  props: {
    // 自定义属性
    // maxLength: Number,
    // 原生属性
    value: [String, Number],
    placeholder: String,
    size: String,
    resize: String,
    name: String,
    form: String,
    id: String,
    maxlength: Number,
    minlength: Number,
    readonly: Boolean,
    autofocus: Boolean,
    disabled: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    rows: {
      type: Number,
      default: 2
    },
    autoComplete: {
      type: String,
      default: 'off'
    },
    max: {},
    min: {},
    step: {},
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    tabindex: String,
    /*
     * 1 一个汉字算1个字，字母数字0.5个字
     * 2 一个汉字算2个字，字母数字1个字
     * 0 一个汉字算1个字，字母数字1个字
     */
    byteType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentValue: this.value,
      inputNum: 0
    };
  },
  methods: {
    input(value) {
      this.currentValue = getByte(value, this.maxlength, this.byteType) || value;
      this.inputNum = getZhLength(this.currentValue, this.byteType);
      this.$emit('input', this.currentValue);
      this.dispatch('ElFormItem', 'el.form.change', [this.currentValue]);
    }
  },
  watch: {
    value: {
      handler(val) {
        this.input(val);
        if (val !== this.currentValue) {
          this.currentValue = val;
        }
      },
      immediate: true
    }
  },
  mixins: [emitter]
};
</script>

<style lang="scss" scoped>
.dm-input {
  display: inline-block;
  background: #fff;
  width: 100%;
  position: relative;
  &.disabled {
    background: #f5f7fa;
  }
  &__counter {
    position: absolute;
    bottom: 1px;
    right: 10px;
    height: 28px;
    line-height: 12px;
    font-size: 12px;
    background: inherit;
    opacity: 0.9;
    &--inner {
      display: flex;
      align-items: center;
      height: 100%;
      & > span {
        color: #909399;
      }
    }
  }
  &__counter.text-area {
    bottom: -20px;
    height: 20px;
    right: 0;
    background: none;
  }
}
</style>

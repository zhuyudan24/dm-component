<template>
  <div
    @click="focusNewTag()"
    :class="{
      'read-only': readOnly,
      'vue-input-tag-wrapper--active': isInputActive,
      'gic-select': 'gic-select'
    }"
    class="vue-input-tag-wrapper"
  >
    <span v-for="(tag, index) in innerTags" :key="index" class="input-tag el-tag el-tag--info el-tag--small">
      <span class="el-select__tags-text">{{ tag }}</span>
      <i v-if="!readOnly" @click.prevent.stop="remove(index)" class="el-tag__close el-icon-close"></i>
    </span>
    <input v-if="!readOnly && !isLimit" ref="inputtag" :placeholder="placeholder" type="text" v-model="newTag" v-on:keydown.delete.stop="removeLastTag" v-on:keydown="addNew" v-on:blur="handleInputBlur" v-on:focus="handleInputFocus" class="new-tag" />
  </div>
</template>

<script>
/* eslint-disable */
const validators = {
  email: new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
  url: new RegExp(/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i),
  text: new RegExp(/^[a-zA-Z]+$/),
  digits: new RegExp(/^[\d() \.\:\-\+#]+$/),
  isodate: new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/)
};
/* eslint-enable */
export default {
  name: 'InputTag',
  props: {
    tags: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    validate: {
      type: String | Function | Object,
      default: ''
    },
    addTagOnKeys: {
      type: Array,
      default: function() {
        return [
          13, // Return
          188, // Comma ','
          9 // Tab
        ];
      }
    },
    addTagOnBlur: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: -1
    },
    allowDuplicates: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newTag: '',
      innerTags: [...this.tags],
      isInputActive: false
    };
  },
  watch: {
    tags() {
      this.innerTags = [...this.tags];
    }
  },
  computed: {
    isLimit: function() {
      return this.limit > 0 && Number(this.limit) === this.innerTags.length;
    }
  },
  methods: {
    focusNewTag() {
      if (this.readOnly || !this.$el.querySelector('.new-tag')) {
        return;
      }
      this.$el.querySelector('.new-tag').focus();
    },
    handleInputFocus() {
      this.isInputActive = true;
    },
    handleInputBlur(e) {
      this.isInputActive = false;
      this.addNew(e);
    },
    addNew(e) {
      const keyShouldAddTag = e ? this.addTagOnKeys.indexOf(e.keyCode) !== -1 : true;
      const typeIsNotBlur = e && e.type !== 'blur';
      if ((!keyShouldAddTag && (typeIsNotBlur || !this.addTagOnBlur)) || this.isLimit) {
        return;
      }
      if (this.innerTags.indexOf(this.newTag.trim()) !== -1) {
        this.newTag = '';
        return;
      }

      if (this.newTag.trim() && (this.allowDuplicates || this.innerTags.indexOf(this.newTag) === -1) && this.validateIfNeeded(this.newTag)) {
        this.innerTags.push(this.newTag.trim());
        this.newTag = '';
        this.tagChange();
      }
    },
    validateIfNeeded(tagValue) {
      if (this.validate === '' || this.validate === undefined) {
        return true;
      }
      if (typeof this.validate === 'function') {
        return this.validate(tagValue);
      }
      if (typeof this.validate === 'string' && Object.keys(validators).indexOf(this.validate) > -1) {
        return validators[this.validate].test(tagValue);
      }
      if (typeof this.validate === 'object' && this.validate.test !== undefined) {
        return this.validate.test(tagValue);
      }
      return true;
    },
    remove(index) {
      this.innerTags.splice(index, 1);
      this.tagChange();
    },
    removeLastTag() {
      if (this.newTag) {
        return;
      }
      this.innerTags.pop();
      this.tagChange();
    },
    tagChange() {
      this.$emit('update:tags', this.innerTags);
      this.chageTag();
    },
    chageTag() {
      this.$emit('tagsChange', this.innerTags);
    }
  }
};
</script>

<style>
.vue-input-tag-wrapper {
  background-color: #fff;
  border: 1px solid #e7e7eb;
  overflow: hidden;
  padding-left: 4px;
  padding: 3px 2px;
  cursor: text;
  text-align: left;
  -webkit-appearance: textfield;
  display: flex;
  flex-wrap: wrap;
  border-radius: 4px;
}
.vue-input-tag-wrapper .input-tag {
  background-color: #f0f2f5;
  border-radius: 4px;
  border: 1px solid #e7e7eb;
  border-color: transparent;
  color: #909099;
  display: inline-block;
  font-size: 12px;
  font-weight: 400;
  max-width: 182px;
  position: relative;
  /*margin-bottom: 4px;
  margin-right: 4px;*/
  /*padding: 3px;*/
}

.vue-input-tag-wrapper .el-select__tags-text {
  display: inline-block;
  vertical-align: top;
  max-width: 148px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.vue-input-tag-wrapper .input-tag .remove {
  cursor: pointer;
  font-weight: bold;
  color: #638421;
}
.vue-input-tag-wrapper .input-tag .remove:hover {
  /*text-decoration: none;*/
}
.vue-input-tag-wrapper .input-tag .remove::before {
  /*content: " x";*/
}
.vue-input-tag-wrapper .new-tag {
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 400;
  padding: 4px;
  padding-left: 15px;
  flex: 1;
  min-width: 20px;
  width: 360px;
}
.vue-input-tag-wrapper.read-only {
  cursor: default;
}
.new-tag::placeholder {
  color: #ccc;
}
</style>

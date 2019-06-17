<template>
  <el-dialog title="编辑话务" :visible.sync="show" width="600px" :before-close="close">
    <el-form ref="form" :model="form" label-width="110px" :rules="rules" v-loading="loading">
      <el-form-item label="话务任务标题" class="pb10" prop="title">
        <dm-input class="w400" v-model="form.title" placeholder="限制20个字符" :maxlength="20"></dm-input>
      </el-form-item>
      <el-form-item label="话务任务内容" class="pb10" prop="content">
        <dm-input class="w400" :rows="4" type="textarea" v-model="form.content" placeholder="限制200个字符" :maxlength="200"></dm-input>
      </el-form-item>
      <el-form-item label="任务逾期判定" prop="lateDays"> <el-input-number controls-position="right" class="w400" v-model="form.lateDays"></el-input-number> 天之后 </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">关 闭</el-button>
      <el-button type="primary" @click="addItem">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dmInput from './dm-input.vue';
import { log } from '@/utils/index.js';
export default {
  name: 'lib-tel',
  components: {
    'dm-input': dmInput
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        title: '',
        lateDays: '',
        content: ''
      },
      rules: {
        title: { required: true, type: 'string', message: '话务任务标题不能为空', trigger: 'blur' },
        content: { required: true, type: 'string', message: '话务任务内容不能为空', trigger: 'blur' },
        lateDays: { required: true, type: 'number', message: '任务逾期判定不能为空', trigger: 'blur' }
      },
      loading: false
    };
  },
  watch: {
    show(val) {
      this.form = {
        title: '',
        lateDays: '',
        content: ''
      };
      if (val && this.item.ecmMarketingTypeRelationId) {
        log('编辑');
        this.form = JSON.parse(JSON.stringify(this.item));
      }
    }
  },
  methods: {
    close() {
      this.$refs.form.resetFields();
      this.$emit('update:show', false);
    },
    addItem() {
      this.form.comName = 'teltask';
      if (!this.form.title || !this.form.content) {
        this.$message({ type: 'warning', message: '话务未填写完整' });
        return;
      }
      this.$emit('sendItem', this.form);
      this.close();
    }
  }
};
</script>

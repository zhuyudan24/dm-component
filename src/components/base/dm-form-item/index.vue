<template>
  <el-form-item :label="label" :label-width="labelWidth" :prop="prop" :required="required" :rules="rules" :error="error" :validate-status="validateStatus" :show-message="showMessage">
    <span slot="label"
      >{{ label }}
      <el-tooltip v-if="tooltip" class="item" effect="dark" :content="tooltip" placement="top-start">
        <i style="position:relative;top:2px;">
          <svg width="14" height="14" fill="#606266" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path d="m486.4 418.304h68.096v349.696h-68.096z" />
            <path d="m512 938.496c239.104 0 426.496-187.904 426.496-426.496s-187.392-426.496-426.496-426.496-426.496 187.392-426.496 426.496 187.392 426.496 426.496 426.496zm0 85.504c-281.6 0-512-230.4-512-512s230.4-512 512-512 512 230.4 512 512-230.4 512-512 512z" />
            <path d="m469.504 327.68a51.2 51.2 0 1 0 102.4 0 51.2 51.2 0 1 0 -102.4 0z" />
          </svg>
        </i>
      </el-tooltip>
    </span>
    <slot></slot>
  </el-form-item>
</template>

<script>
export default {
  name: 'dm-form-item',
  props: {
    label: String,
    labelWidth: String,
    prop: String,
    required: Boolean,
    rules: [Object, Array],
    error: String,
    validateStatus: String,
    showMessage: {
      type: Boolean,
      default: true
    },
    // 以下是自定义属性
    tooltip: String
  }
};
</script>

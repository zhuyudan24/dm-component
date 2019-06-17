<template>
  <article>
    <section class="dm-section">
      <h3 class="dm-section--title">
        组件
        <span class="dm-section--span">维护:{{ $route.meta.adminName }}</span>
      </h3>
      <slot name="component"></slot>
    </section>
    <section class="dm-section">
      <h3 class="dm-section--title">
        数据
        <!-- <i @click="toggleData" :class="dataShow ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline'"></i> -->
      </h3>
      <!-- <div v-show="dataShow"> -->
      <slot name="data"></slot>
      <!-- </div> -->
    </section>
    <section class="dm-section">
      <h3 class="dm-section--title">
        说明
        <!-- <i @click="toggleMarkdown" :class="markdownShow ? 'el-icon-remove-outline' : 'el-icon-circle-plus-outline'"></i> -->
      </h3>
      <div class="md">
        <slot name="markdown"></slot>
      </div>
    </section>
  </article>
</template>

<script>
export default {
  name: 'layout',
  data() {
    return {};
  }
};
</script>

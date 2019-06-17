<template>
  <section class="dm-section">
    <MyMarkdown></MyMarkdown>
  </section>
</template>
<script>
export default {
  name: 'quick-start-view',
  components: {
    MyMarkdown: () => import('./quick-start.md')
  }
};
</script>

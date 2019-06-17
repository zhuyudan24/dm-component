<template>
  <section class="dm-section">
    <MyMarkdown></MyMarkdown>
  </section>
</template>
<script>
export default {
  name: 'introduction-view',
  components: {
    MyMarkdown: () => import('./introduction.md')
  }
};
</script>

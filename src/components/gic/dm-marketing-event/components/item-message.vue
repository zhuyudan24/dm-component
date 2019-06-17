<template>
  <span class="dm-message__item__wrap">
    <div class="dm-message__item">
      <p class="dm-message__item--title">{{ item.title }}</p>
      <p class="dm-message__item--content">{{ item.content }}</p>
    </div>
  </span>
</template>

<script>
export default {
  name: 'item-message',
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
</script>

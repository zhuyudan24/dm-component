<template>
  <span class="dm-teltask__item__wrap">
    <div class="dm-teltask__item">
      <p class="dm-teltask__item--title">
        {{ item.title }} <span class="fz13 gray-color">任务逾期判定{{ item.lateDays }}天之后</span>
      </p>
      <p class="dm-teltask__item--content">{{ item.content }}</p>
    </div>
  </span>
</template>

<script>
export default {
  name: 'item-teltask',
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

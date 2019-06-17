<template>
  <span class="dm-image__item__wrap">
    <img :src="item.qcloudImageUrl || loadErrorImg" alt="" />
  </span>
</template>

<script>
export default {
  name: 'item-image',
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      // eslint-disable-next-line
      loadErrorImg: require('../assets/img/loaderror.png')
    };
  }
};
</script>

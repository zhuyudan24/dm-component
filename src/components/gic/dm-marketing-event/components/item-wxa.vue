<template>
  <div class="dm-wxa__item__wrap" @mouseover="maskShow = true" @mouseout="maskShow = false">
    <div class="dm-wxa__item">
      <div class="dm-wxa__avatar">
        <img :src="item.brandLogo || loadErrorImg" alt="" />
        <span>{{ item.brandName }}</span>
      </div>
      <p class="ellipsis-l2">{{ item.title }}</p>
      <img :src="item.imageUrl || loadErrorImg" alt="" srcset="" />
      <p class="dm-wxa__item--bottom"><img src="../assets/img/wxa-circle.svg" alt="" srcset="" /><span> 小程序</span></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'item-wxa',
  data() {
    return {
      maskShow: false,
      // eslint-disable-next-line
      loadErrorImg: require('../assets/img/loaderror.png')
    };
  },
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

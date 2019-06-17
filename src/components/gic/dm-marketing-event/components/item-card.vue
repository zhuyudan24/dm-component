<template>
  <div class="dm-card__item__wrap">
    <div class="dm-card__item" :style="{ background: item.cardColor }">
      <img class="dm-card__item__avatar" :src="item.brandLogo || loadErrorImg" alt="" />
      <div class="inline-block">
        <p class="dm-card__item__title">{{ item.cardName }}</p>
        <p class="dm-card__item__desc" v-if="item.cardEffectiveMode !== 0">领取后第{{ item.startDay + 1 }}-{{ item.limitDay + item.startDay }}天</p>
        <p class="dm-card__item__desc" v-if="item.cardEffectiveMode === 0">{{ formateDateTimeByType(item.beginDate, 'yyyy-MM-dd') }} 至 {{ formateDateTimeByType(item.endDate, 'yyyy-MM-dd') }}</p>
      </div>
    </div>
    <p class="dm-card__item--bottom">
      <span>适用{{ item.storeMode === 0 ? '所有门店' : item.storeMode === 1 ? '部分分组' : '部分门店' }}</span>
    </p>
  </div>
</template>

<script>
import { formateDateTimeByType } from '../assets/utils.js';
export default {
  name: 'item-card',
  data() {
    return {
      formateDateTimeByType,
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

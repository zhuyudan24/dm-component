<template>
  <div class="dm-imgText__item__wrap">
    <div v-for="(v, i) in item.itemList" :key="i">
      <div class="dm-imgText__item" v-if="i === 0" @mouseover="itemMouseover(v)" @mouseout="itemMouseout(v)">
        <div class="dm-imgText__item__mask" v-if="v.maskShow" @click="preview(v)">预览文章</div>
        <p class="ellipsis-l2">{{ v.titleName }}</p>
        <img :src="v.qcloudImageUrl || loadErrorImg" alt="" srcset="" />
        <p class="ellipsis fz13 gray-color">{{ v.remark }}</p>
      </div>
      <div class="dm-imgText__item__other clearfix" v-else @mouseover="itemMouseover(v)" @mouseout="itemMouseout(v)">
        <div v-if="v.maskShow" class="dm-imgText__item__other__mask" @click="preview(v)">预览文章</div>
        <img :src="v.qcloudImageUrl || loadErrorImg" alt="" srcset="" />
        <p class="ellipsis-l2">{{ v.titleName }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'item-teletext',
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
        return {
          itemList: []
        };
      }
    }
  },
  created() {
    if (this.item.itemList instanceof Array) {
      this.item.itemList.forEach((v, i) => {
        this.$set(this.item.itemList, i, { ...v, maskShow: false });
      });
    }
  },
  methods: {
    preview(item) {
      window.open(item.mediaUrl);
    },
    itemMouseover(item) {
      item.maskShow = true;
    },
    itemMouseout(item) {
      item.maskShow = false;
    }
  }
};
</script>

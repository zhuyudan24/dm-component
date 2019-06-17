<template>
  <li class="good-item">
    <el-checkbox v-model="item.check"></el-checkbox>
    <div class="good-info">
      <img :src="item.img" />
      <p>{{ item.name }}</p>
      <p>{{ item.code }}</p>
    </div>
    <span class="price"> {{ item.price }} </span>
    <span class="store"> {{ item.store }} </span>
  </li>
</template>

<script>
export default {
  name: 'GoodFilterItem',

  props: {
    goods: Object
  },

  data() {
    return {
      item: {}
    };
  },

  watch: {
    goods: {
      immediate: true,
      handler(newval) {
        this.item = newval;
      }
    }
  }
};
</script>

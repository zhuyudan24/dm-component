<template>
  <div class="inline-block dm-marketing__opt">
    <span v-for="(v, i) in options" :key="i" class="dm-marketing__opt__item" @click="addItem(v)">
      <img :src="v.img" alt="" srcset="" /><span> {{ v.name }}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'opt',
  props: {
    options: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    addItem(item) {
      this.$emit('addItem', item);
    }
  }
};
</script>

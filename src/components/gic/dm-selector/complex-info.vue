<template>
  <div class="complex-info">
    <div class="complex-items" v-for="(item, i) in abbrInfos" :key="i">
      <complex-item :data="item"></complex-item>
      <strong class="complex-and" v-if="abbrInfos[i + 1] && abbrInfos[i + 1].length">并且</strong>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ComplexItem from './complex-item';

export default {
	name: 'complex-info',

	props: {
		complexData: Array
	},

	components: {
		ComplexItem
	},
	watch: {
		complexData: {
			immediate: true,
			handler(newval) {
				this.abbrInfos = newval;
			}
		}
	},

	data() {
		return {
			abbrInfos: []
		};
	}
};
</script>

<style lang="less" scoped>
.complex-items {
	.complex-and {
		display: inline-block;
		margin: 10px 0;
		padding: 10px 20px;
		color: #64666a;
		border-radius: 20px;
		background-color: #e2e2e2;
	}
}
.complex-info {
	display: inline-block;
  vertical-align: middle;
}
</style>

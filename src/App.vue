<template>
  <div id="app" class="dm-reset-style">
    <Navigator></Navigator>
    <router-view />
  </div>
</template>

<script>
import Navigator from './docs/navigator';
export default {
  name: 'App',
  components: {
    Navigator
  },
  created() {
    console.log('app');
  },
  mounted() {
    console.log(this);
  }
};
</script>

<style lang="sass">
@import url('./assets/style/reset.css');
@import url('./assets/theme/index.css');
@import url('./assets/style/style.scss');
@import url('./assets/style/markdown.scss');
@import url('../static/css/dmreset.css');
</style>

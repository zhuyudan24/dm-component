<template>
  <div id="app">
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
  }
};
</script>

<style lang="sass">
@import url('./assets/style/reset.css');
@import url('./assets/theme/index.css');
@import url('./assets/style/style.scss');
@import url('./assets/style/markdown.scss');
</style>

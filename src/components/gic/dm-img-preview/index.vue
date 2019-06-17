<template>
  <div class="image-view-contain" v-if="showFlag">
    <!-- <div class="image-view-mask" @click.stop="hideImage"></div> -->

    <transition name="fade">
      <div class="image-view-body" @click.stop="hideImage">
        <i class="el-icon-close"></i>
        <img :src="imgSrc" alt="" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'vue-gic-img-preview',
  props: {
    imgUrl: String,
    imgShowFlag: Boolean
  },
  data() {
    return {
      showFlag: false,
      imgSrc: ''
    };
  },
  methods: {
    hideImage() {
      var that = this;
      that.showFlag = false;
      that.$emit('hideImage', that.showFlag);
    },
    hidePanel() {
      var that = this;
      if (!!that.showFlag) {
        that.hideImage();
      }
    }
  },
  watch: {
    imgUrl: function(newVal) {
      this.imgSrc = newVal;
    },
    imgShowFlag: function(newVal) {
      this.showFlag = newVal;
    }
  },
  mounted() {
    var that = this;
    that.imgSrc = this.imgUrl;
    this.showFlag = that.imgShowFlag;

    // 监听点击隐藏弹层
    document.addEventListener('mousedown', that.hidePanel, false);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.image-view-contain {
  position: relative;
  width: 100%;
}

.image-view-body {
  position: fixed;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  z-index: 50;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  /*width: 520px;
    height: 520px;*/
  padding: 24px;
  background: #fff;
  text-align: center;
  border-radius: 4px;
  -webkit-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.el-icon-close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 14px;
  color: #909399;
  cursor: pointer;
}

.image-view-body img {
  /*-webkit-flex: 1;
  -moz-flex: 1;
  -ms-flex: 1;
  -o-flex: 1;
  flex: 1;*/
  max-width: 452px;
  max-height: 452px;
}

.image-view-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}
</style>

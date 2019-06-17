<template>
  <section class="dm-marketing">
    <!-- 操作区 -->
    <div class="dm-marketing__opt--wrap" v-if="list.length === 0">
      <span class="dm-marketing__opt--label">添加内容</span>
      <i class="el-icon-plus dm-marketing__opt--icon" @click="optTopShow = !optTopShow"></i>
      <transition name="fade">
        <opt @addItem="addItem" :options="options" v-if="optTopShow"></opt>
      </transition>
    </div>
    <!-- item组件区 -->
    <div class="dm-marketing__content--wrap" v-if="list.length">
      <span class="dm-marketing__content--label">回复内容</span>
      <div class="dm-marketing__content">
        <!-- 组件 区域 -->
        <div class="dm-marketing__content__item" v-for="(v, i) in list" :key="i">
          <i class="dm-marketing__content--index">{{ i + 1 }}</i>
          <component :is="v.comName" :item="v.item" :isSupportVar="isSupportVar"></component>
          <i class="el-icon-edit dm-marketing__opt--icon" v-if="v.comName === 'item-teltask' || v.comName === 'item-text' || v.comName === 'item-wxa'" @click="editItem(v)"></i>
          <dm-delete @confirm="delItem(v)">
            <i class="el-icon-delete dm-marketing__opt--icon"></i>
          </dm-delete>
        </div>
      </div>
    </div>
    <div class="dm-marketing__opt--wrap" @mouseleave="optShow = false">
      <i class="el-icon-plus dm-marketing__opt--icon--bottom" v-if="list.length && list.length < maxEventCount" @mouseover="optShow = true"></i>
      <transition name="fade">
        <opt @addItem="addItem" :options="options" v-if="list.length && list.length < maxEventCount && optShow" style="margin:20px 0 0 15px;"></opt>
      </transition>
    </div>
    <!-- 弹窗组件 -->
    <component :is="dialogCom" @sendItem="saveToList" :item="currentItem" :show.sync="dialogShow" :isSupportVar="isSupportVar"></component>
  </section>
</template>

<script>
import { log } from '@/utils/index.js';
import { getMarketingEvent, getMarketingTypeDetails, saveUpdateMarketingType, deleteMarketingType } from './assets/api.js';
// 删除组件
import dmDelete from './components/dm-delete.vue';
// 操作组件
import opt from './components/opt.vue';
// 页面item组件
import itemTeletext from './components/item-teletext.vue';
import itemWxa from './components/item-wxa.vue';
import itemCard from './components/item-card.vue';
import itemText from './components/item-text.vue';
import itemImage from './components/item-image.vue';
import itemMessage from './components/item-Message.vue';
import itemTeltask from './components/item-teltask.vue';
//弹窗组件
import libTeletext from './components/lib-teletext.vue';
import libMessage from './components/lib-Message.vue';
import libCard from './components/lib-card.vue';
import libText from './components/lib-text.vue';
import libWxa from './components/lib-wxa.vue';
import libImage from './components/lib-image.vue';
import libTeltask from './components/lib-teltask.vue';

// 全部的操作项
// eslint-disable-next-line
const allOptions = [{ name: '图文', value: 'teletext', key: 1, img: require('./assets/img/teletext.svg') }, { name: '文本', value: 'text', key: 2, img: require('./assets/img/text.svg') }, { name: '小程序', value: 'wxa', key: 3, img: require('./assets/img/wxa.svg') }, { name: '图片', value: 'image', key: 4, img: require('./assets/img/image.svg') }, { name: '卡券', value: 'card', key: 5, img: require('./assets/img/card.svg') }, { name: '短信', value: 'message', key: 6, img: require('./assets/img/message.svg') }, { name: '话务', value: 'teltask', key: 7, img: require('./assets/img/teltask.svg') }];
export default {
  name: 'vue-gic-marketing-event',
  components: {
    opt: opt,
    'dm-delete': dmDelete,

    'item-teletext': itemTeletext,
    'item-wxa': itemWxa,
    'item-card': itemCard,
    'item-text': itemText,
    'item-image': itemImage,
    'item-message': itemMessage,
    'item-teltask': itemTeltask,

    'lib-teletext': libTeletext,
    'lib-message': libMessage,
    'lib-card': libCard,
    'lib-text': libText,
    'lib-wxa': libWxa,
    'lib-image': libImage,
    'lib-teltask': libTeltask
  },
  props: {
    //  页面编码——- 1001-智能引擎; 1002-微信营销; 1003-被关注回复; 1004-关键字回复
    code: {
      type: String,
      default: '1001'
    },
    ecmPlanId: {
      type: String,
      default: ''
    },
    // 是否能发短信的flag
    enabledMessageState: {
      type: Number,
      default: 1
    },
    isSupportVar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      dialogShow: false,
      dialogCom: '',
      options: [],
      maxEventCount: 0, //item最大数
      currentItem: {},
      optShow: false,
      optTopShow: true
    };
  },
  created() {
    this.init();
  },
  methods: {
    /*------------------逻辑方法--------------*/
    // 初始化获取配置项
    init() {
      getMarketingEvent({ pageCode: this.code }).then(res => {
        log(res);
        if (res.errorCode === 0) {
          this.maxEventCount = Number((res.result && res.result.maxEventCount) || 0);
          let list = res.result.list || [];
          let optionNameList = list.map(v => v.eventName);
          allOptions.map(v => {
            if (optionNameList.indexOf(v.name) >= 0) {
              this.options.push(v);
            }
          });
          this.getMarketingList();
        } else {
          this.$message({ type: 'warning', message: '组件初始化失败' });
        }
        log(res);
      });
    },
    // 初始化获取列表
    getMarketingList() {
      log(this.ecmPlanId);
      getMarketingTypeDetails({ ecmPlanId: this.ecmPlanId }).then(res => {
        if (res.errorCode === 0) {
          this.list = [];
          let result = res.result.typeRelationList || [];
          let brandInfo = res.result.enterprise || {};
          // 七种类型 处理
          result.map(v => {
            switch (v.marketingType) {
              case 'teletext': // 1 图文
                this.list.push({ comName: 'item-teletext', item: { ...v.imageText, ecmMarketingTypeRelationId: v.ecmMarketingTypeRelationId, relationId: v.relationId, ecmPlanId: v.ecmPlanId } });
                break;
              case 'text': // 2 文本
                this.list.push({ comName: 'item-text', item: { ...v.text, ecmMarketingTypeRelationId: v.ecmMarketingTypeRelationId, relationId: v.relationId, ecmPlanId: v.ecmPlanId } });
                break;
              case 'wxa': // 3 小程序
                this.list.push({ comName: 'item-wxa', item: { ...v.wxa, ecmMarketingTypeRelationId: v.ecmMarketingTypeRelationId, relationId: v.relationId, ecmPlanId: v.ecmPlanId, brandLogo: brandInfo.qcloudImageUrl, brandName: brandInfo.brandName } });
                break;
              case 'card': // 5 卡券
                this.list.push({ comName: 'item-card', item: { ...v.card, ecmMarketingTypeRelationId: v.ecmMarketingTypeRelationId, relationId: v.relationId, ecmPlanId: v.ecmPlanId, brandLogo: brandInfo.qcloudImageUrl } });
                break;
              case 'image': // 4 图片
                this.list.push({ comName: 'item-image', item: { ...v.image, ecmMarketingTypeRelationId: v.ecmMarketingTypeRelationId, relationId: v.relationId, ecmPlanId: v.ecmPlanId } });
                break;
              case 'message': // 6 短信
                this.list.push({ comName: 'item-message', item: { ...v.sms, ecmMarketingTypeRelationId: v.ecmMarketingTypeRelationId, relationId: v.relationId, ecmPlanId: v.ecmPlanId } });
                break;
              case 'teltask': // 7 话务
                this.list.push({ comName: 'item-teltask', item: { ...v.teltask, ecmMarketingTypeRelationId: v.ecmMarketingTypeRelationId, relationId: v.relationId, ecmPlanId: v.ecmPlanId } });
                break;
            }
          });

          this.hasReturnCard();
        }
      });
    },
    // 保存操作
    saveToList(val) {
      // 这里得提示一下短信是否欠费
      if (val.comName === 'message' && !this.enabledMessageState) {
        this.$message({ type: 'warning', message: "'您的通讯费已欠费，请及时于计费中心充值，并联系我司客服恢复功能使用，谢谢。" });
      }
      let params = {
        ecmPlanId: this.ecmPlanId, //从prop中取
        marketingType: val.comName
      };
      // 营销事件类型主键id, 新增不传, 修改必传
      if (val.ecmMarketingTypeRelationId) {
        params.ecmMarketingTypeRelationId = val.ecmMarketingTypeRelationId;
      }
      // 七种传值  1.话务
      if (val.comName === 'teltask') {
        params.title = val.title;
        params.teltask = {
          // ecm话务对象
          title: val.title,
          content: val.content,
          lateDays: val.lateDays
        };
      }
      // 2.文本
      if (val.comName === 'text') {
        params.title = val.content;
        // 如果有链接，需要判断链接类型
        params.text = {
          content: val.content,
          jumpUrlInfo: val.jumpUrlInfo && JSON.stringify(val.jumpUrlInfo),
          urlType: val.urlType
        };
      }
      // 3.小程序
      if (val.comName === 'wxa') {
        params.title = val.title;
        params.wxa = {
          title: val.title,
          mediaId: val.mediaId,
          pagePath: val.pagePath
        };
      }
      //4.图文
      if (val.comName === 'teletext') {
        params.title = val.title;
        params.relationId = val.imageTextWechatId;
      }

      //5.图片
      if (val.comName === 'image') {
        params.title = val.title;
        params.relationId = val.imageMediaId;
      }

      //6.卡券
      if (val.comName === 'card') {
        params.title = val.cardName;
        params.relationId = val.wechatCardId;
      }

      //7.短信
      if (val.comName === 'message') {
        params.title = val.title;
        params.relationId = val.smsTemplateId;
      }

      // 接口请求 保存
      saveUpdateMarketingType({ marketingType: JSON.stringify(params) }).then(res => {
        this.getMarketingList();
      });
    },
    // 新增前置 不能超过营销事件限制数量
    addItem(v) {
      if (this.isOverMaxCount()) {
        this.$message({ type: 'warning', message: `最多只能添加${this.maxEventCount}个营销事件` });
        return;
      }
      // 判断是否欠费
      if (v.value === 'message' && this.checkAccountState()) return;

      this.dialogCom = 'lib-' + v.value;
      // 新增的时候设置为空对象
      this.currentItem = {};
      this.dialogShow = true;
    },
    // 删除操作
    delItem(item) {
      log(item);
      deleteMarketingType({ ecmMarketingTypeRelationId: item.item.ecmMarketingTypeRelationId }).then(res => {
        if (res.errorCode === 0) {
          this.getMarketingList();
        }
      });
    },
    // 编辑前置
    editItem(obj) {
      this.currentItem = obj.item;
      this.dialogCom = 'lib-' + obj.comName.slice(5);
      this.$nextTick(_ => {
        this.dialogShow = true;
      });
    },

    /*------------------辅助方法--------------*/
    // 账户状态判断
    checkAccountState() {
      if (localStorage.getItem('accountStatus') == 3) {
        this.$alert(
          `<div>
        <i class="el-icon-warning warning-color fz30 vertical-middle mr20"></i>
        <p class="inline-block vertical-middle w300">当前账户已欠费，无法正常使用短信服务。为了保障您的权益，请及时充值。</p>
        </div>`,
          '提示',
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '前往充值中心',
            customClass: 'message-box--btn-center'
          }
        ).then(res => {
          if (res === 'confirm') {
            this.$router.push('/recharge/do');
          }
        });
        return true;
      }
    },
    //  判断是否大于最大数量
    isOverMaxCount() {
      return this.list.length >= this.maxEventCount;
    },
    //判断营销列表里是否有短信 提供给父级使用
    hasMessageInList() {
      return this.list.some(v => v.comName === 'item-message' && v.item.type === 1);
    },
    //判断营销列表里是否有卡券 提供给父级使用
    hasReturnCard() {
      let item = {};
      try {
        this.list.forEach(v => {
          if (v.comName === 'item-card') {
            item = v;
            throw new Error();
          }
        });
      } catch (e) {
        log(e);
      }
      this.$emit('has-card', item);
    }
  }
};
</script>
<style lang="scss">
@import url('./assets/style/index.css');

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
  transform: translate(0);
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  display: none;
}
</style>

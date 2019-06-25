<template>
  <el-popover :placement="placement" width="440" height="180" trigger="hover" @show="getMemberInfo">
    <div class="corsur-pointer">
      <div class="singelinfo" @click="linkDetail">
        <div class="singelinfo-img">
          <img width="100" height="100" v-if="memberInfo.photoUrl" :src="memberInfo.photoUrl" alt="" />
          <img width="100" height="100" v-else src="../../../../static/img/head_default.png" alt="" />
        </div>
        <div class="member-info-content">
          <div class="info-top">
            <span class="lheigt20 fl">{{ memberObj.memberName }}</span>
            <div class="fr">
              <img title="已取消关注公众号" v-if="memberInfo.status == 0" src="../../../../static/img/status@gzhcanclegray.png" style="margin-right:5px" />
              <img title="已关注公众号" v-else-if="memberInfo.status == 1" src="../../../../static/img/status@gzh.png" style="margin-right:5px" />
              <img title="未关注公众号" v-else-if="memberInfo.status == 2" src="../../../../static/img/status@gzhgray.png" style="margin-right:5px" />
              <img title="使用过小程序" v-if="memberInfo.wxStatus === 1" src="../../../../static/img/status@xcx.png" style="margin-right:5px" />
              <img title="未使用小程序" v-if="memberInfo.wxStatus === 0" src="../../../../static/img/status@xcxgray.png" style="margin-right:5px" />
              <img title="已绑定手机号" v-if="memberInfo.phoneStatus === 1" src="../../../../static/img/phone_icon.png" style="margin-right:5px" />
              <img title="未绑定手机号" v-if="memberInfo.phoneStatus === 0" src="../../../../static/img/phone_icon_gray.png" style="margin-right:5px" />
              <img title="已认证" v-if="memberInfo.authStatus === 1" src="../../../../static/img/member_icon.png" style="margin-right:5px" />
              <img title="未认证" v-if="memberInfo.authStatus === 0" src="../../../../static/img/member_icon_gray.png" style="margin-right:5px" />
            </div>
          </div>
          <p class="member-detal-info">
            <span style="margin-right:5px;">{{ memberInfo.sex === 0 ? '未知性别' : memberInfo.sex === 1 ? '男' : '女' }}</span>
            <span style="margin-right:5px;">{{ memberInfo.age }}</span>
            <span>{{ memberInfo.cardNo }}</span>
          </p>
          <p class="member-detal-info">{{ memberInfo.mainStoreName }}</p>
          <div class="singelinfo-cost">
            <div class="singelinfo-costitem">
              <p>{{ memberInfo.costFee || 0 }}</p>
              <p>消费总额</p>
            </div>
            <div class="singelinfo-costitem">
              <p>{{ memberInfo.costTimes || 0 }}</p>
              <p>消费次数</p>
            </div>
            <div class="singelinfo-costitem">
              <p class="no-wrap">{{ memberInfo.lastCost || 0 }}</p>
              <p>最近消费</p>
            </div>
          </div>
        </div>
      </div>
      <div class="singelinfo-jl">
        <a class="singelinfo-jlitem">消费记录 ({{ memberInfo.numOfSale }})</a>
        <a class="singelinfo-jlitem">营销记录 ({{ memberInfo.numOfmarket }})</a>
        <a class="singelinfo-jlitem">卡券记录 ({{ memberInfo.couponCount }})</a>
      </div>
    </div>
    <div slot="reference" style="width:200px;">
      <a :href="'/member/#/wechatmemberDetail?memberId=' + memberObj.memberId" target="_blank" class="link-content">
        <img class="vertical-middle table__avatar" :src="filterAvatar(memberObj.memberImgUrl)" width="60" height="60" alt="" srcset="" />
        <div class="table-info">
          <p class="table-name--ellipsis">{{ memberObj.memberName || '--' }}</p>
        </div>
      </a>
    </div>
  </el-popover>
</template>
<script>
import { baseUrl } from '@/config/index.js';
export default {
  name: 'vue-member-info',
  props: {
    memberObj: {
      type: Object,
      default() {
        return {};
      }
    },
    requestProject: {
      type: String
    },
    placement: {
      type: String
    }
  },
  data() {
    return {
      memberInfo: {},
      baseUrl
    };
  },
  methods: {
    filterAvatar(img) {
      return img ? img.replace(/^http(s)?/, 'https') : this.defaultAvatar;
    },
    //获取会员详情
    getMemberInfo() {
      let params = {
        memberId: this.memberObj.memberId
      };
      this.axios.post(this.baseUrl + '/api-member/load-member-single-info?requestProject=' + this.requestProject, params).then(res => {
        if (res.data.errorCode == 0) {
          this.memberInfo = res.data.result.memberSingle;
        } else {
          this.memberInfo = {};
          this.$message.error(res.data.message);
        }
      });
    },
    linkDetail() {
      window.open(`/member/#/wechatmemberDetail?memberId=${this.memberObj.memberId}`);
    }
  }
};
</script>
<style scoped>
.link-content {
  display: flex;
  align-items: center;
}
.table-info {
  width: 200px;
  margin-left: 5px;
}
.table-name--ellipsis {
  line-height: 18px;
  color: #303133;
}

.table-card--ellipsis {
  font-size: 13px;
  line-height: 18px;
  word-break: break-all;
}
.singelinfo {
  display: flex;
}
.singelinfo-img {
  display: inline-block;
  vertical-align: top;
}
.lheigt20 {
  line-height: 20px;
}
.member-info-content {
  margin-left: 10px;
  flex: 1;
}
.info-top {
  height: 20px;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.member-detal-info {
  margin: 5px 0;
  line-height: 16px;
}
.singelinfo-cost {
  display: flex;
  align-content: center;
}
.singelinfo-costitem {
  text-align: center;
  flex: 1;
}
.singelinfo-jl {
  display: flex;
  margin: 15px 0;
}
.singelinfo-jlitem {
  text-align: center;
  flex: 1;
}
</style>

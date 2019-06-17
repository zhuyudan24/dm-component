<template>
  <li class="sku-left-item">
    <div class="goods-box" :class="{ expands: expands }">
      <div class="gic-icon">
        <el-checkbox v-model="skuItem.check" @change="handleChange" v-if="!checked"></el-checkbox>
        <i class="icon-trans el-icon-arrow-right" @click="expands = !expands" v-if="checked"></i>
      </div>
      <div class="good-img">
        <img class="img" :src="skuItem.mainImageUrl" />
        <div class="info">
          <p class="name" :title="skuItem.goodsName">{{ skuItem.goodsName }}</p>
          <p class="code" :titile="skuItem.goodsCode">{{ skuItem.goodsCode }}</p>
        </div>
      </div>
      <div class="good-item good-price">
        {{ skuItem.salePrice }}
      </div>
      <div class="good-item good-store">
        {{ skuItem.spuStock }}
      </div>
    </div>
    <!-- 如果勾选sku 展示sku show-checkbox 决定是左边的勾选 还是右边的pop显示 一个是展示 一个是待操作 -->
    <el-collapse-transition>
      <table-checkbox :data="skuItem.skus" show-checkbox v-if="expands" :inx="inx" @passku="resiverSku"></table-checkbox>
    </el-collapse-transition>
  </li>
</template>

<script>
import ElCollapseTransition from './collapse-transition';
import TableCheckbox from './table-checkbox';
import Emitter from './assist/emitter';
import { baseUrl } from '@/config/index.js';
import { log } from '@/utils/index.js';
export default {
  name: 'sku-left-item',
  mixins: [Emitter],
  components: {
    ElCollapseTransition,
    TableCheckbox
  },
  props: {
    check: Boolean,
    goods: Object,
    inx: Number
  },

  data() {
    return {
      checked: null, // 是显示el-box 还是显示 > ( 也就是sku的筛选 )
      skuItem: null,
      expands: false
    };
  },

  methods: {
    handleChange(val) {
      this.$emit('update:checkbox', val);
      this.$emit('changeIndeterminate');
    },
    // 接收 sku筛选的时候传过来的值
    resiverSku(item) {
      log(item);
    },
    getSkuList() {
      this.axios
        .get(`${baseUrl}/api-goods/list-store-goods-select-sku?goodsId=${this.skuItem.goodsId}`)
        .then(res => {
          if (res.data.errorCode === 0) {
            const data = res.data.result;
            if (data && data.length) {
              this.skuItem.skus = data.map(el => ({
                ...el,
                color: this.parseAttr(el.skuAttributes).color,
                size: this.parseAttr(el.skuAttributes).size
              }));
              // 当前商品id 跟左边的数据对比
              const component = this.findComponentUpward(this, 'goods-some');
              if (component.filterData.length) {
                const data = component.filterData;
                // 当前商品左边的商品
                if (data.length) {
                  const currentGoods = data.find(ele => this.skuItem.goodsId === ele.goodsId);
                  // 找到存在的sku 然后切换状态
                  currentGoods.skus.forEach(sku => {
                    for (let i = 0; i < this.skuItem.skus.length; i++) {
                      if (this.skuItem.skus[i].skuId === sku.skuId) {
                        this.skuItem.skus[i].check = true;
                        break;
                      }
                    }
                  });
                  // 主动切换sku的状态
                  this.broadcast('table-checkbox', 'changeSkuStatus');
                }
              }
            } else {
              this.skuItem.skus = [];
            }
          }
        })
        .catch(err => {
          //
        });
    },
    parseAttr(attr = '') {
      if (!attr) return { color: '--', size: '--' };
      let attrs = JSON.parse(attr);
      return {
        color: attrs[0].valueName,
        size: attrs[1].valueName
      };
    }
  },

  watch: {
    check: {
      immediate: true,
      handler(newval) {
        this.checked = newval;
        if (!newval) {
          this.expands = false;
        }
      }
    },
    goods: {
      immediate: true,
      handler(newval) {
        this.skuItem = newval;
      }
    },
    expands(newval) {
      // 请求商品的sku
      if (newval) {
        this.getSkuList();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.sku-left-item {
  font-size: 12px;
  color: #606266;
  border-bottom: 1px solid #dcdfe6;
  .expands {
    border-bottom: 1px solid #dcdfe6;
  }
  .gic-icon {
    display: inline-block;
    vertical-align: middle;
    width: 16px;
    height: 56px;
    line-height: 56px;
    padding: 0 10px;
  }
  .good-img {
    display: inline-block;
    vertical-align: middle;
    height: 56px;
    width: 160px;
    .img {
      display: inline-block;
      vertical-align: middle;
      height: 40px;
      width: 40px;
      border-radius: 2px;
    }
    .info {
      display: inline-block;
      vertical-align: middle;
      padding: 6px 0;
      p {
        width: 110px;
        height: 16px;
        line-height: 16px;
        margin: 4px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .good-info {
    display: inline-block;
    vertical-align: middle;
  }
  .good-item {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    width: 60px;
  }
  .goods-box {
    .icon-trans {
      padding: 4px;
      transition: all 0.3s;
    }
  }
  .expands .icon-trans {
    transform: rotate(90deg);
  }
  &:last-child {
    margin-bottom: -1px;
    padding-bottom: 20px;
  }
}
</style>

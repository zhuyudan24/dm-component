import GoodsBrand from './goods-brand'; // 商品品牌
import GoodsAtegory from './goods-ategory'; // 商品品类
import GoodsSpecifications from './goods-specifications'; // 规格
import GoodsSome from './goods-some'; // 部分商品
import GoodsProperties from './goods-properties'; // 商品属性
import ElCollapseTransition from './collapse-transition';

export default {
  name: 'gooditem',

  components: {
    GoodsBrand,
    GoodsAtegory,
    GoodsSpecifications,
    GoodsSome,
    GoodsProperties,
    ElCollapseTransition
  },

  props: {
    type: {
      type: String,
      validator: val => ['brand', 'ategory', 'specifications', 'properties', 'some'].includes(val)
    },
    goodsIndex: Array,
    tags: Array,
    goodsBrands: Array
  },

  data() {
    return {};
  },

  render(h) {
    // 定义五种类型
    const slotVal = this.$slots.default;
    const type = this.type;
    let FinalComponent;

    // 扩展的属性
    const goodsData = {
      props: {
        tags: this.tags,
        'goods-brands': this.goodsBrands,
        'goods-index': this.goodsIndex
      }
    };

    if (type == 'brand') {
      // 品牌
      FinalComponent = <goods-brand {...goodsData}>{slotVal}</goods-brand>;
    } else if (type == 'ategory') {
      // 品类
      FinalComponent = <goods-ategory {...goodsData}>{slotVal}</goods-ategory>;
    } else if (type == 'specifications') {
      // 规格
      FinalComponent = <goods-specifications {...goodsData}>{slotVal}</goods-specifications>;
    } else if (type == 'properties') {
      // 属性
      FinalComponent = <goods-properties {...goodsData}>{slotVal}</goods-properties>;
    } else if (type == 'some') {
      // 部分商品
      FinalComponent = <goods-some {...goodsData}>{slotVal}</goods-some>;
    }

    return <el-collapse-transition>{FinalComponent}</el-collapse-transition>;
  }
};

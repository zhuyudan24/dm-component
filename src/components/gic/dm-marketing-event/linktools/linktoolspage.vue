<template>
  <!-- 链接小工具 -->
  <div class="link-tools-contain">
    <div :class="activeName ? 'min-780' : 'min-1028'">
      <div class="el-dialog">
        <div class="el-dialog__body">
          <!-- 链接类型 -->
          <div class="links-types">
            <label class="types-title">链接类型</label>
            <el-select style="max-width:200px;" v-model="linksType" placeholder="请选择" @change="linksTypeChange">
              <el-option v-for="item in linksTypeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <!-- 二级下拉 -->
            <el-select style="max-width:200px;" v-model="twoLevelValue" placeholder="请选择" v-if="twoLevelVisible" @change="twoLevelValueChange">
              <el-option v-for="item in twoLevelOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <!-- 三级下拉 -->
            <div class="three-level-wrap" v-if="threeLevelVisible">
              <!-- 三级单选 -->
              <el-select style="max-width:200px;" v-model="threeLevelValue" placeholder="请选择" v-if="threeLeveloneVisible" @change="threeSingleValueChange">
                <el-option v-for="item in threeLevelOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
              <!-- 商品分类链接 -->
              <treeselect v-if="threeLevelTreeVisible" v-model="threeLevelValue" :options="goodsCategoryOptions" :normalizer="normalizer" :default-expand-level="1" placeholder="所有分类" noOptionsText="暂无数据" noResultsText="无数据" @select="goodsCategorySelect" />
              <!-- 搜索后出现下列 -->
              <el-select v-if="threeLevelSearchVisible" v-model="threeLevelValue" multiple filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" @change="threeLevelValueChange">
                <el-option v-for="item in threeLevelOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </div>
          </div>

          <!-- h5 -->
          <div class="h5link-contain" v-if="h5linkVisible">
            <div class="h5link-row">
              <label class="h5link-title">进入条件</label>
              <el-select class="conditionType-select" v-model="h5linkObj.conditionType" placeholder="请选择进入条件">
                <el-option v-for="item in h5linkObj.conditionTypeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </div>
            <div class="h5link-row">
              <label class="h5link-title">名称</label>
              <el-input v-model="h5linkObj.name" placeholder="请输入名称"></el-input>
            </div>
            <div class="h5link-row">
              <label class="h5link-title">网址</label>
              <el-input v-model="h5linkObj.url" placeholder="请输入网址"></el-input><a class="h5link-help" href="http://doc.demogic.com/doc/index.php?s=/41&page_id=441" target="_blank">【帮助文档】请联系公司技术人员查看文档配置标准链接</a>
            </div>
            <div class="h5link-row">
              <label class="h5link-title">固定参数</label>
              <el-input v-model="h5linkObj.fixParam" type="textarea" resize="none" :rows="4" placeholder="请输入固定参数(可选)"></el-input>
            </div>
            <div class="h5link-row">
              <label class="h5link-title">时间戳开关</label>
              <el-switch v-model="h5linkObj.timeSwitch" @change="timeSwitch($event, h5linkObj.timeSwitch)"></el-switch>
              <!--  <el-select class="dynamic-param-select" v-model="h5linkObj.dynamicPara" multiple placeholder="请选择动态参数(可选)">
                <el-option
                  v-for="item in h5linkObj.dynamicParaOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
            </div>
          </div>

          <!-- 商品链接 -->
          <div class="goods-links-contian" v-if="goodsLinksVisible">
            <div class="links-tools-row">
              <!-- 品类 -->
              <treeselect v-model="category" :options="categoryOptions" :normalizer="normalizer" :default-expand-level="1" :flat="true" placeholder="所有品类" noOptionsText="暂无数据" noResultsText="无数据" no-children-text="无数据" :load-options="loadOptions" :beforeClearAll="beforeClearCategory" @select="categorySelect" />
              <!-- 分类树形结构 -->
              <treeselect v-model="classify" :options="classifyOptions" :normalizer="normalizer" :default-expand-level="1" placeholder="所有分类" noOptionsText="暂无数据" noResultsText="无数据" noChildrenText="无数据" :beforeClearAll="beforeClearClassify" @select="classifySelect" />
              <el-input class="links-tools-input" placeholder="请输入商品名称/货号" v-model="searchGoods" @keyup.native="value => toSearchInput(value)" clearable @clear="clearInput">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>
            <!-- 商品列表 -->
            <div class="goods-link-content">
              <ul class="goods-link-list">
                <li :class="item.mallProId == selectGoodId ? 'goods-link-item goodSelect' : 'goods-link-item'" v-for="(item, index) in goodsList" :key="index" @click="selectGoodLinkItem(item)">
                  <img :src="item.mallProImageUrl" alt="商品图片" />
                  <div class="inline-block goods-message">
                    <p class="limit-2 pro-name">{{ item.proName }}</p>
                    <p class="gray-color pro-code">货号：{{ item.proCode }}</p>
                    <span class="pro-price">￥{{ item.mallProSpuPrice }}</span>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 分页 -->
            <div class="links-tools-page">
              <el-pagination @size-change="linkSizeChange" @current-change="linkCurrentChange" :current-page="currentPage" :page-sizes="[9]" :page-size="pageSize" layout="prev, pager, next" :total="total"> </el-pagination>
            </div>
          </div>

          <!-- 底部按钮 -->
          <span slot="footer" class="dialog-footer">
            <!--  <el-button @click="cancelLinkSelect">取 消</el-button>
            <el-button type="primary" @click="confirmLinkSelect">确 定</el-button> -->
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 使用树形插件
// import the component
import Treeselect from '@riophae/vue-treeselect';
import { log } from '@/utils/index.js';
// import axios from 'axios'
import qs from 'qs';

export default {
  name: 'links',
  props: ['linkToolsVisible', 'showType', 'projectName', 'activeName'],
  data() {
    return {
      repProjectName: 'gic-web', // 项目名
      linkShowType: 0, //传参数判断显示类型
      // ---------------------------
      twoLevelVisible: false, // 二级下拉
      threeLevelVisible: false, // 三级整个
      // 链接类型
      linksType: '',
      linksTypeOptions: [
        // {
        //   id: '1',
        //   value: 'shoplink',
        //   label: '商城链接'
        // },
        // {
        //   id: '2',
        //   value: 'memberlink',
        //   label: '会员功能链接'
        // },
        // {
        //   id: '3',
        //   value: 'definelink',
        //   label: '自定义页面'
        // },
        // {
        //   id: '4',
        //   value: 'h5link',
        //   label: 'H5页面'
        // },
        // {
        //   id: '5',
        //   value: 'otherlink',
        //   label: '其他小程序'
        // }
      ],
      // 二级数据
      twoLevelValue: '',
      twoLevelOptions: [
        // {
        //   id: '1',
        //   value: 'shoplink',
        //   label: '商城链接'
        // },
      ],
      // 三级数据
      threeLeveloneVisible: false, // 三级中第一个下拉单选
      threeLevelTreeVisible: false, // 三级中第二个下拉树形结构
      threeLevelSearchVisible: false, // 三级中第三个搜索下拉
      threeLevelValue: '',
      threeLevelOptions: [
        // {
        //   id: '1',
        //   value: 'shoplink',
        //   label: '商城链接'
        // },
      ],
      // h5link
      h5linkVisible: false,
      h5linkObj: {
        name: '',
        url: '',
        fixParam: '',
        timeSwitch: false, // 默认false->0: 关闭; true->1: 开启
        dynamicPara: '',
        dynamicParaOptions: [
          // 2018.6.12 动态参数目前让写页面
          {
            value: 'openid',
            label: 'openid'
          },
          {
            value: 'unionid',
            label: 'unionid'
          },
          {
            value: 'wxOpenid',
            label: 'wxOpenid'
          },
          {
            value: 'appkey',
            label: 'appkey'
          },
          {
            value: 'enterpriseId',
            label: 'enterpriseId'
          },
          {
            value: 'appid',
            label: 'appid'
          },
          {
            value: 'memberID',
            label: 'memberID'
          }
        ],
        // 进入条件
        conditionType: '0',
        conditionTypeOptions: [
          {
            value: '0',
            label: '不限'
          },
          {
            value: '1',
            label: '开卡会员'
          },
          {
            value: '2',
            label: '认证会员'
          }
        ]
      },
      // ---------------------------
      // ---------------------------
      // 父组件传递的 props
      mylinkToolsVisible: this.linkToolsVisible,

      // 商品链接
      goodsLinksVisible: false,
      searchGoods: '',
      category: null,
      // 品类
      categoryOptions: [
        // {
        //   key: 'a',
        //   name: 'a',
        //   subOptions: [ {
        //     key: 'aa',
        //     name: 'aa',
        //   } ],
        // }
      ],
      normalizer(node /*, id */) {
        // there is an extra `id` argument,
        // which could be useful if you have multiple instances
        // of vue-treeselect that share the same `normalizer` function
        return {
          id: node.key,
          label: node.name,
          children: node.subOptions
        };
      },

      // 商品列表数据
      selectGoodId: '',
      goodsList: [
        // {
        //   id:'111',
        //   proName: '美商海盗船Gaming系列 K70 RGB Rapidfire',
        //   proCode: "errerr",
        //   mallProImageUrl: 'https://pic01-10001430.image.myqcloud.com/adb6387e-a3f4-4b7f-a7dd-1b7fe242f9f7',
        //   mallProSpuPrice: 567
        // }
      ],
      // 分页
      currentPage: 1, // 当前页
      pageSize: 9, // 一页显示的个数
      total: 0, // 总数

      // 分类
      classify: null,
      classifyOptions: [
        // {
        //   key: 'b',
        //   name: 'b',
        //   subOptions: [ {
        //     key: 'bb',
        //     name: 'bb',
        //   } ],
        // }
      ],

      // 商品分类
      goodsCategory: null,
      goodsCategoryOptions: [
        // {
        //   key: 'a',
        //   name: 'a',
        //   subOptions: [
        //     {
        //       key: 'aa',
        //       name: 'aa',
        //     }
        //   ],
        // }
      ],

      // 保存需要的参数
      oneLevelTypeValue: '',
      twoLevelSelectValue: '',
      threeLevelSelectValue: '',

      // 触发传递的对象
      selectLinkObj: {
        id: '',
        name: '',
        url: '',
        params: '',
        timeSwitch: 0
      },
      // 获取 location origin
      baseUrl: ''
    };
  },
  beforeMount() {
    let that = this;
    let host = window.location.origin;
    log('当前host:', host);
    if (host.indexOf('localhost') != '-1') {
      that.baseUrl = 'http://gicdev.demogic.com';
    } else {
      that.baseUrl = host;
    }
  },
  methods: {
    // --------------------------------------------------
    // 选择类型改变 (一级选择,保存选择类型)
    linksTypeChange: function(e) {
      let that = this;
      log('选择的链接Id:' + e);

      let selectOneItem = '';

      that.linksTypeOptions.forEach(function(ele, inde) {
        if (ele.linkId == e) {
          selectOneItem = ele;
        }
      });
      // 保存选择的类型
      that.oneLevelTypeValue = selectOneItem.type;
      log('that.oneLevelTypeValue:', that.oneLevelTypeValue);
      log('一级选择的类型:', selectOneItem);
      // 判断出现下拉内容/h5部分

      // 每次修改选择类型,清空已选择的值

      that.selectLinkObj.name = '';
      that.selectLinkObj.url = '';
      that.selectLinkObj.params = '';

      that.twoLevelSelectValue = '';
      that.threeLevelSelectValue = '';

      // 如果是 h5,二级,三级隐藏,
      let type = selectOneItem.type == 5 ? true : false;
      that.setOneLevelVisible(type, selectOneItem);
    },

    // set onelevel visible
    setOneLevelVisible(type, selectOneItem) {
      let that = this;
      if (type) {
        // 设置选择的 id
        that.selectLinkObj.id = selectOneItem.linkId;
        log('一级选择obj:', that.selectLinkObj);
        that.h5linkVisible = true; // h5 链接参数输入部分显示
        that.twoLevelVisible = false; // 二级部分隐藏
        that.threeLevelVisible = false; // 三级部分隐藏
        that.goodsLinksVisible = false; // 商品链接列表部分
      } else {
        // 不是 h5,显示二级,隐藏三级
        that.h5linkVisible = false; // h5 链接参数输入部分隐藏
        that.twoLevelVisible = true; // 二级部分显示
        that.twoLevelOptions = [];
        that.threeLevelVisible = false; // 三级部分隐藏
        that.goodsLinksVisible = false; // 商品链接列表部分
        that.twoLevelValue = ''; // 清空二级数据
        that.threeLevelValue = ''; // 清空三级数据

        // 如果是自定义
        if (selectOneItem.type == 6) {
          log('自定义:', selectOneItem);
          that.selectLinkObj.id = selectOneItem.linkId;
          // that.selectLinkObj.name = selectOneItem.label;
          that.selectLinkObj.url = selectOneItem.content;
          that.getDefinePage();
          log(that.selectLinkObj);
          return false;
        }

        // 清空设置选择的 id
        that.selectLinkObj.id = '';
        log('一级选择obj:', that.selectLinkObj);

        // 获取二级列表数据
        that.getLinksList(selectOneItem.linkId, 2);
      }
    },

    // twoLevelValueChange (二级选择,保存选择类型)
    twoLevelValueChange(e) {
      let that = this;
      log('二级选择值:', e);

      // 判断自定义
      if (that.oneLevelTypeValue == 6) {
        let selectDefineItem = '';
        that.twoLevelOptions.forEach(function(ele, index) {
          if (e == ele.id) {
            selectDefineItem = ele;
          }
        });
        that.selectLinkObj.name = selectDefineItem.label;
        that.selectLinkObj.params = {
          pageId: e
        };
        log('二级选择是自定义:', that.twoLevelOptions, that.selectLinkObj);
        return;
      }
      let selectTwoItem = '';
      that.twoLevelOptions.forEach(function(ele, index) {
        if (e == ele.linkId) {
          selectTwoItem = ele;
        }
      });
      log('二级选择的类型:', selectTwoItem);
      // 每次选择清空原有选择参数
      that.selectLinkObj.params = '';
      // 设置选择的 id
      that.selectLinkObj.id = e;

      log('二级选择的 obj: ', that.selectLinkObj.id);
      // 判断是否结束, 1:结束;
      if (selectTwoItem.type == 1 || selectTwoItem.type == 4 || selectTwoItem.type == 6) {
        that.threeLevelVisible = false; // 三级部分隐藏
        that.threeLevelValue = ''; // 清空三级数据
        that.twoLevelSelectValue = ''; // 清空门店签到
        that.threeLevelSelectValue = ''; //清空商品分类
        // 清空已经选择
        that.selectLinkObj.name = '';
        that.selectLinkObj.url = '';

        // 如果选择商品链接
        if (selectTwoItem.type == 4) {
          that.getGoodsList(); // 获取商品列表
          that.getGoodsCategory(); // 获取商品品类
          that.getGoodsClassify(); // 获取商品分类

          that.threeLevelVisible = false; // 三级部分隐藏
          that.goodsLinksVisible = true; // 商品链接列表部分显示
          return false;
        }

        that.twoLevelOptions.forEach(function(ele, index) {
          if (e == ele.value) {
            that.selectLinkObj.name = ele.label;
            that.selectLinkObj.url = ele.content;
          }
        });

        log('二级结束选择的链接:', that.selectLinkObj);
        that.$emit('linkSelect', that.selectLinkObj);
      } else {
        // 判断三级中下拉/下拉树形/搜索下拉
        that.goodsLinksVisible = false; // 商品列表隐藏
        that.threeLevelVisible = true; // 三级部分显示
        that.threeLevelValue = ''; // 清空三级数据
        that.twoLevelSelectValue = '';
        that.threeLevelSelectValue = '';
        let twoType = selectTwoItem.type;
        // 判断三级显示的下拉组件
        that.setThreeVisible(twoType, selectTwoItem);

        // 如果是门店,直接返回,需要输入后搜索出现下拉列表
        if (twoType == 2) {
          that.twoLevelSelectValue = 'sign';
          return false;
        }
        if (twoType == 3) {
          that.twoLevelSelectValue = 'goodsCate';
          that.getGoodsClassify();
          return false;
        }
        // 获取三级列表数据
        that.getLinksList(selectTwoItem.linkId, 3, twoType);
      }
    },

    // set threelevel visible
    setThreeVisible(type, selectTwoItem) {
      let that = this;
      switch (type) {
        // 如果下拉显示
        case 0: // 单选
          that.threeLeveloneVisible = true; // 三级中第一个下拉单选
          that.threeLevelTreeVisible = false; // 三级中第二个下拉树形结构
          that.threeLevelSearchVisible = false; // 三级中第三个搜索下拉
          break;
        case 2: // 搜索下拉
          that.threeLeveloneVisible = false; // 三级中第一个下拉单选
          that.threeLevelTreeVisible = false; // 三级中第二个下拉树形结构
          that.threeLevelSearchVisible = true; // 三级中第三个搜索下拉
          // 设置链接 门店签到
          that.selectLinkObj.name = selectTwoItem.name;
          that.selectLinkObj.url = selectTwoItem.content;
          log('二级结束选择的链接:', that.selectLinkObj);
          break;
        case 3: // 树形结构
          that.threeLevelValue = null;
          that.threeLeveloneVisible = false; // 三级中第一个下拉单选
          that.threeLevelTreeVisible = true; // 三级中第二个下拉树形结构
          that.threeLevelSearchVisible = false; // 三级中第三个搜索下拉
          // 设置链接 商品分类
          that.selectLinkObj.name = selectTwoItem.name;
          that.selectLinkObj.url = selectTwoItem.content;
          break;
      }
    },

    // 获取商品品类
    getGoodsCategory() {
      let that = this;
      let para = {
        filterGoods: 1,
        parentId: '',
        requestProject: that.repProjectName
      };
      that.axios
        .post(that.baseUrl + '/api-mall/list_mall_goods_category', qs.stringify(para))
        .then(res => {
          log(res, res.data, res.data.errorCode);
          let resData = res.data;
          let onelevelCategory = '';
          if (resData.errorCode == 0) {
            resData.result.forEach(function(ele, index) {
              if (ele.parentId == '-1') {
                ele.subOptions = [];
                ele.key = ele.mallCategoryId;
                onelevelCategory = ele;
                resData.result.splice(index, 1);
              }
            });
            log('resdata: ', resData);
            let list = resData.result;
            let lists = resData.result;

            list.forEach(function(ele, index) {
              if (ele.isLeaf == 0) {
                ele.subOptions = null;
              }
              ele.key = ele.mallCategoryId;
              lists.forEach(function(el, ind) {
                el.key = el.mallCategoryId;
                if (el.parentId == ele.mallCategoryId) {
                  log(index, ind);
                  ele.subOptions = [];
                  ele.subOptions.push(el);
                  list.splice(ind, 1);
                }
              });
            });
            log('list:', list, onelevelCategory);

            list.forEach(function(ele, index) {
              onelevelCategory.subOptions.push(ele);
            });
            that.categoryOptions = [];
            that.categoryOptions.push(onelevelCategory);

            log('list:', that.categoryOptions);
            return false;
          }

          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          log(error);
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // 获取商品分类
    getGoodsClassify() {
      let that = this;
      let para = {
        requestProject: that.repProjectName
      };
      that.axios
        .post(that.baseUrl + '/api-mall/list_mall_goods_tag_tree', qs.stringify(para))
        .then(res => {
          log(res, res.data, res.data.errorCode);
          let resData = res.data;
          if (resData.errorCode == 0) {
            let list = [resData.result];
            // let lists = resData.result;

            list.forEach(function(ele, index) {
              ele.name = ele.tagName;
              ele.key = ele.mallProTagId;
              if (!!ele.childTagList) {
                ele.subOptions = that.checkChildren(ele.childTagList);
              }
            });

            that.goodsCategoryOptions = list;
            that.classifyOptions = list;
            // that.classifyOptions = list;

            log('list:', list, that.goodsCategoryOptions);
            // log(that.goodsCategoryOptions)
            return;
          }

          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          log(error);
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    checkChildren(childTagList) {
      let that = this;
      if (!!childTagList) {
        childTagList.forEach(function(ele, index) {
          ele.name = ele.tagName;
          ele.key = ele.mallProTagId;
          if (!!ele.childTagList) {
            ele.subOptions = that.checkChildren(ele.childTagList);
          }
        });
      }
      // log(childTagList)
      return childTagList;
    },

    // threeLevelValueChange
    threeLevelValueChange(e) {
      let that = this;
      log(e, that.threeLevelValue);
    },

    // threeSingleValueChange
    threeSingleValueChange(e) {
      let that = this;
      log(e, that.threeLevelValue);
      let selThreeItem = '';
      that.threeLevelOptions.forEach(function(ele, index) {
        if (e == ele.linkId) {
          selThreeItem = ele;
        }
      });
      // 非门店签到
      that.selectLinkObj.id = e;
      that.selectLinkObj.url = selThreeItem.content;
      that.selectLinkObj.name = selThreeItem.name;
      that.$emit('linkSelect', that.selectLinkObj);
    },

    // 获取自定义列表
    getDefinePage() {
      let that = this;
      let para = {
        pageType: 1,
        title: '',
        currentPage: 1,
        pageSize: 50,
        status: 1,
        requestProject: that.repProjectName
      };
      that.axios
        .post(that.baseUrl + '/api-admin/list-page', qs.stringify(para))
        .then(res => {
          log(res, res.data, res.data.errorCode);
          let resData = res.data;
          if (resData.errorCode == 0) {
            resData.result.result.forEach(function(ele, index) {
              ele.id = ele.pageId;
              ele.label = ele.title;
              ele.value = ele.pageId;
            });
            log('自定义列表:', resData.result.result);
            that.twoLevelOptions = resData.result.result;
            return;
          }
          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          log(error);
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // --------------------------------------------------

    // -------------------------------------------
    // 选择树形节点方法

    // 商品链接部分 categorySelect
    categorySelect(node, id) {
      let that = this;
      log(node, id, that.category);
      that.category = node.key;
      // 重新获取商品列表
      if (that.currentPage == 1) {
        that.getGoodsList();
      } else {
        that.currentPage = 1;
        that.getGoodsList();
      }
    },
    beforeClearCategory(node, id) {
      let that = this;
      log(node, id);
      that.category = null;
      // 重新获取商品列表
      if (that.currentPage == 1) {
        that.getGoodsList();
      } else {
        that.currentPage = 1;
        that.getGoodsList();
      }
    },

    loadOptions({ action, parentNode, callback }) {
      // Typically, do the AJAX stuff here.
      // Once the server has responded,
      // assign children options to the parent node & call the callback.
      // We just use `setTimeout()` here to simulate an async operation
      // instead of requesting a real API server for demo purpose.
      let that = this;
      log(action, parentNode, callback);
      if (action === 'LOAD_CHILDREN_OPTIONS') {
        if (parentNode.key) {
          that.getChildrenNode(parentNode, parentNode.key);
        }
      }
    },

    // 获取子节点方法
    getChildrenNode(parentNode, parentId) {
      let that = this;
      let para = {
        filterGoods: 1,
        parentId: parentId,
        requestProject: that.repProjectName
      };
      that.axios
        .post(that.baseUrl + '/api-mall/list_mall_goods_category', qs.stringify(para))
        .then(res => {
          log('获取子节点数据', res, res.data, res.data.errorCode);
          let resData = res.data;
          if (resData.errorCode == 0) {
            resData.result.forEach(function(ele, index) {
              if (ele.isLeaf == 0) {
                ele.subOptions = null;
              } else {
                ele.subOptions = [];
              }
              ele.key = ele.mallCategoryId;
            });
            parentNode.subOptions = resData.result;
            return;
          }
          that.$message.error({
            duration: 1000,
            message: '错误'
          });
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: '错误'
          });
        });
    },

    // classifySelect  分类
    classifySelect(node, id) {
      let that = this;
      log(node, id, that.classify);
      that.classify = node.key;
      // 重新获取商品列表
      if (that.currentPage == 1) {
        that.getGoodsList();
      } else {
        that.currentPage = 1;
        that.getGoodsList();
      }
    },
    beforeClearClassify(node, id) {
      let that = this;
      log(node, id, that.classify);
      that.classify = null;
      // 重新获取商品列表
      if (that.currentPage == 1) {
        that.getGoodsList();
      } else {
        that.currentPage = 1;
        that.getGoodsList();
      }
    },

    // 商品分类 goodsCategorySelect
    goodsCategorySelect(node, id) {
      let that = this;
      log(node, id, that.threeLevelValue);
      // 调用
      // that.selectLinkItem()
    },

    // --------------------------------------------

    // 关闭
    handleClose(done) {
      let that = this;
      that
        .$confirm('确认关闭？')
        .then(_ => {
          done();
          that.mylinkToolsVisible = false;
          log(this.mylinkToolsVisible);
          that.$emit('linkSelect');
        })
        .catch(_ => {
          log('取消关闭');
        });
    },

    // 分页
    linkSizeChange(val) {
      let that = this;
      log(`每页 ${val} 条`, that.pageSize);
      that.pageSize = val;
      // 请求商品列表
      that.getGoodsList();
    },

    // 页码变化触发
    linkCurrentChange(val) {
      let that = this;
      log(`当前页: ${val}`, that.currentPage);
      that.currentPage = val;
      // 请求商品列表
      that.getGoodsList();
    },

    // 选择商品链接
    selectGoodLinkItem(item) {
      let that = this;
      log(item);
      that.selectGoodId = item.mallProId;
      // 调用函数传递链接/名字
      that.selectLinkItem(item);
    },

    // 选择链接以后调用函数
    selectLinkItem(item) {
      let that = this;
      log(item);
      that.selectLinkObj.name = item.proName;
      that.selectLinkObj.url = item.url;
      that.selectLinkObj.params = { proId: item.mallProId }; // 2018.6.28修改参数 proId
      that.$emit('linkSelect', that.selectLinkObj);
    },

    // 搜索输入
    toSearchInput: function(value) {
      let that = this;
      log('搜索////////:', that.searchGoods, value);
      // 搜索重置当前页 为 1

      if (that.currentPage == 1) {
        that.getGoodsList();
      } else {
        that.currentPage = 1;
        that.getGoodsList();
      }
    },
    // 清空输入
    clearInput: function(e) {
      let that = this;
      log(e, that.searchGoods);
      // 搜索重置当前页 为 1

      if (that.currentPage == 1) {
        that.getGoodsList();
      } else {
        that.currentPage = 1;
        that.getGoodsList();
      }
    },

    // 获取商品列表
    getGoodsList() {
      let that = this;
      log('获取商品列表');
      let para = {
        pageNum: that.currentPage,
        searchparams: that.searchGoods || '',
        pageSize: that.pageSize,
        // 品类
        mallCategoryId: that.category,
        tagId: that.classify, // 分类
        requestProject: that.repProjectName
      };

      // that.currentPage = 1;
      // that.pageSize = 10;
      // that.total = 50;

      that.axios
        .post(that.baseUrl + '/api-mall/page-mall-goods', qs.stringify(para))
        .then(res => {
          log(res, res.data, res.data.errorCode);
          let resData = res.data;
          if (resData.errorCode == 0) {
            that.goodsList = resData.result.result;

            that.total = resData.result.totalCount;
            log(that.total);
            return;
          }

          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          log(error);
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // 搜索后出现下拉列表
    // 搜索
    remoteMethod(query) {
      let that = this;
      if (query !== '') {
        // 获取搜索列表数据
        that.getStoreList(query, that.threeLevelValue);
      } else {
        that.threeLevelOptions = [];
      }
    },

    // h5 时间开关
    timeSwitch(e, obj) {
      log(e, obj);
    },

    // 取消操作
    cancelLinkSelect() {
      let that = this;
      this.$confirm('确认关闭?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: ''
      })
        .then(() => {
          log('点击确认');
          that.$emit('linkSelect');
        })
        .catch(() => {
          log('取消 取消关闭');
        });
    },

    // 确认操作
    confirmLinkSelect() {
      let that = this;
      log(that.linksType, that.twoLevelValue, that.threeLevelValue);
      // 如果选择 h5 判断选择的链接
      if (that.oneLevelTypeValue == 5) {
        if (!that.h5linkObj.name.trim() || !that.h5linkObj.url.trim()) {
          that.$message.error({
            duration: 1000,
            message: '请填写链接内容'
          });
          return;
        }
        that.selectLinkObj.conditionType = that.h5linkObj.conditionType;
        that.selectLinkObj.name = that.h5linkObj.name;
        that.selectLinkObj.url = that.h5linkObj.url; // +'?'+that.h5linkObj.fixParam+'&'+that.h5linkObj.dynamicPara;
        that.selectLinkObj.params = that.h5linkObj.fixParam;
        that.selectLinkObj.timeSwitch = that.h5linkObj.timeSwitch == true ? 1 : 0;
        log(that.selectLinkObj);
        // that.selectLinkObj.fixParam = that.h5linkObj.fixParam;
        // that.selectLinkObj.dynamicPara = that.h5linkObj.dynamicPara;
        // 触发父组件方法,传递参数
        that.transData();
        return;
      }

      // 如果选择的自定义页面
      if (that.oneLevelTypeValue == 6) {
        if (!that.twoLevelValue.trim()) {
          that.$message.error({
            duration: 1000,
            message: '请选择自定义页面'
          });
          return;
        }
        // 触发父组件方法,传递参数
        log(that.selectLinkObj);
        that.transData();
        return;
      }

      // 如果门店签到
      log('门店签到:', that.twoLevelSelectValue);
      // log(that.checkTwoLevel(that.twoLevelSelectValue))
      if (that.twoLevelSelectValue == 'sign') {
        // log("///////",that.checkTwoLevel(that.twoLevelSelectValue))
        if (!that.checkTwoLevel(that.twoLevelSelectValue)) {
          return false;
        }
        return false;
      }
      // 如果是商品分类
      if (that.twoLevelSelectValue == 'goodsCate') {
        if (!that.checkTwoLevel(that.twoLevelSelectValue)) {
          return false;
        }
        return false;
      }
      log(that.selectLinkObj);
      if (!!that.selectLinkObj.name && !!that.selectLinkObj.id) {
        // 触发父组件方法,传递参数
        that.transData();
      } else {
        that.$message.error({
          duration: 1000,
          message: '请选择链接'
        });
      }
    },

    checkTwoLevel(v) {
      let that = this;
      log(that.threeLevelValue);
      if (!that.threeLevelValue || !that.threeLevelValue.length) {
        that.$message.error({
          duration: 1000,
          message: '请选择' + (v == 'sign' ? '门店' : '商品分类')
        });
        return false;
      }
      that.selectLinkObj.url = that.selectLinkObj.url; // +'?'+that.threeLevelValue
      that.selectLinkObj.params = {
        storeId: that.threeLevelValue
      };
      // 触发父组件方法,传递参数
      that.transData();
    },

    // 重置所有组件
    resetAll() {
      let that = this;
      that.h5linkVisible = false;
      that.linksType = '';
      that.twoLevelVisible = false; // 二级下拉
      that.threeLevelVisible = false; // 三级整个
      that.goodsLinksVisible = false; // 商品列表隐藏
      that.twoLevelValue = ''; // 清空所有选择的
      that.twoLevelSelectValue = '';
      that.threeLevelValue = ''; // 清空所有选择的

      that.selectLinkObj = {
        url: '',
        name: ''
      };
      that.currentPage = 1;
      that.total = 0;
      that.pageSize = 9;
      that.searchGoods = '';
      that.classify = null;
      that.category = null;

      that.h5linkObj.name = '';
      that.h5linkObj.url = '';
      that.h5linkObj.fixParam = '';
      // that.h5linkObj.dynamicPara ='';
    },

    // 触发父组件方法,传递参数
    transData() {
      let that = this;
      that.$emit('linkSelect', that.selectLinkObj);
      that.resetAll();
    },

    // 获取一级列表/二级列表
    getLinksList(parentId, num, twoType) {
      let that = this;
      // 如果不传传的显示类型,设置
      twoType = twoType ? twoType : '';

      let para = {
        parentId: parentId,
        requestProject: that.repProjectName,
        linkScene: that.linkShowType
      };

      that.axios
        .post(that.baseUrl + '/api-plug/list-link-data', qs.stringify(para))
        .then(res => {
          log(res, res.data, res.data.errorCode);
          let resData = res.data;
          let result = res.data.result && res.data.result.filter(v => v.name !== '自定义页面');
          if (resData.errorCode == 0) {
            that.setLevelListOptions(parentId, result, num, twoType);
            return;
          }

          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          log(error);
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    setLevelListOptions(parentId, result, num, twoType) {
      let that = this;
      // 设置一级
      if (parentId == 0) {
        result.forEach(function(ele, index) {
          ele.id = ele.linkId;
          ele.label = ele.name;
          ele.value = ele.linkId;
        });

        that.linksTypeOptions = result;
        log('获取一级类型: ', that.linksTypeOptions);
        return;
      }
      // 设置二级
      if (num == 2 && result[0]) {
        result.forEach(function(ele, index) {
          ele.id = ele.linkId;
          ele.label = ele.name;
          ele.value = ele.linkId;
        });
        that.twoLevelOptions = result;
        log('获取二级类型: ', that.twoLevelOptions);
        return;
      }

      // 设置三级
      if (num == 3 && result[0]) {
        // 如果是分类
        // if (twoType == 3) {
        //   return false;
        // }
        // 如果是单选下拉
        if (twoType == 0) {
          result.forEach(function(ele, index) {
            ele.id = ele.linkId;
            ele.label = ele.name;
            ele.value = ele.linkId;
          });
          that.threeLevelOptions = result;
        }

        log('获取三级类型: ', that.threeLevelOptions);
        return;
      }
    },

    // 获取门店列表
    getStoreList(query, threeLevelValue) {
      let that = this;
      log(threeLevelValue.toString());
      let para = {
        searchParam: query,
        selectedIds: threeLevelValue.toString(),
        flag: null,
        requestProject: that.repProjectName
      };

      that.axios
        .post(that.baseUrl + '/api-plug/query-store-by-code-name', qs.stringify(para))
        .then(res => {
          log(res, res.data, res.data.errorCode);
          let resData = res.data;
          if (resData.errorCode == 0) {
            resData.result.forEach(function(ele, index) {
              ele.id = ele.storeId;
              ele.label = ele.storeName;
              ele.value = ele.storeId;
            });
            that.threeLevelOptions = resData.result;
            return;
          }

          that.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          log(error);
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    toLogin() {
      let that = this;
      let para = {
        loginName: 'damogic',
        password: '1',
        eid: 'ff808081593917d90159398ec6340012'
      };

      that.axios
        .post(that.baseUrl + '/api-auth/do-login', qs.stringify(para))
        .then(res => {
          log(res, res.data, res.data.errorCode);
          that.getLinksList(0, 1);
        })
        .catch(function(error) {
          log('error:', error);
        });
    }
  },

  watch: {
    linkToolsVisible(val) {
      log(val);
      this.mylinkToolsVisible = val; // 新增linkToolsVisible的watch，监听变更并同步到linkToolsVisible上
    },
    // isWx(val) {
    //   let that = this
    //   that.isWxapp = val;
    // },
    showType(val) {
      let that = this;
      that.linkShowType = val || 0;
    },
    projectName: function(newData, oldData) {
      let that = this;
      // log("新数据:",newData,oldData)
      that.repProjectName = newData || 'gic-web';
    }
  },

  mounted() {
    // log('00000');
    let that = this;
    // 项目名
    that.repProjectName = that.projectName || 'gic-web';
    // that.toLogin()
    // 获取 ShowType
    that.linkShowType = that.showType || 0;
    that.getLinksList(0);
  },

  components: {
    Treeselect
  }
};
</script>

<style lang="scss" scoped>
/************************************************/

/* tab linktools*/

.link-tools-contain /deep/ {
  .vue-treeselect-helper-zoom-effect-off {
    transform: none !important;
  }
  /**
     * Animations
     */
  @keyframes vue-treeselect-animation-fade-in {
    0% {
      opacity: 0;
    }
  }
  @keyframes vue-treeselect-animation-bounce {
    0%,
    100% {
      transform: scale(0);
    }
    50% {
      transform: scale(1);
    }
  }
  @keyframes vue-treeselect-animation-rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  /**
     * Transitions
     */
  .vue-treeselect__multi-value-item--transition-enter-active,
  .vue-treeselect__multi-value-item--transition-leave-active {
    transition-duration: 200ms;
    transition-property: transform, opacity;
  }
  .vue-treeselect__multi-value-item--transition-enter-active {
    transition-timing-function: ease-out-circ;
  }
  .vue-treeselect__multi-value-item--transition-leave-active {
    transition-timing-function: ease-out-cubic;
    position: absolute;
  }
  .vue-treeselect__multi-value-item--transition-enter,
  .vue-treeselect__multi-value-item--transition-leave-to {
    transform: scale(0.7);
    opacity: 0;
  }
  .vue-treeselect__multi-value-item--transition-move {
    transition: 200ms transform ease-out-quart;
  }
  .vue-treeselect__menu--transition-enter-active,
  .vue-treeselect__menu--transition-leave-active {
    /* to be overriden */
  }
  .vue-treeselect__menu--transition-enter,
  .vue-treeselect__menu--transition-leave-to {
    /* to be overriden */
  }
  .vue-treeselect__list--transition-enter-active,
  .vue-treeselect__list--transition-leave-active {
    /* to be overriden */
  }
  .vue-treeselect__list--transition-enter,
  .vue-treeselect__list--transition-leave-to {
    /* to be overriden */
  }
  /**
     * Namespace
     */
  .vue-treeselect {
    position: relative;
    text-align: left;
  }
  .vue-treeselect div,
  .vue-treeselect span {
    box-sizing: border-box;
  }
  .vue-treeselect svg {
    fill: currentColor;
  }
  /**
     * Control
     */
  .vue-treeselect__control {
    padding-left: 5px;
    padding-right: 5px;
    display: table;
    table-layout: fixed;
    width: 100%;
    height: 36px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #fff;
    transition-duration: 200ms;
    transition-property: border-color, box-shadow, width, height, background-color, opacity;
    transition-timing-function: ease-out-cubic;
  }
  .vue-treeselect:not(.vue-treeselect--disabled):not(.vue-treeselect--focused) .vue-treeselect__control:hover {
    border-color: #cfcfcf;
  }
  .vue-treeselect--focused:not(.vue-treeselect--open) .vue-treeselect__control {
    border-color: #039be5;
    box-shadow: 0 0 0 3px rgba(3, 155, 229, 0.1);
  }
  .vue-treeselect--disabled .vue-treeselect__control {
    background-color: #f9f9f9;
  }
  .vue-treeselect--open .vue-treeselect__control,
  .vue-treeselect__control:hover {
    border-color: #cfcfcf;
  }
  .vue-treeselect--open.vue-treeselect--open-below .vue-treeselect__control {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .vue-treeselect--open.vue-treeselect--open-above .vue-treeselect__control {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .vue-treeselect__value-container,
  .vue-treeselect__multi-value {
    width: 100%;
    vertical-align: middle;
  }
  .vue-treeselect__value-container {
    display: table-cell;
    position: relative;
  }
  .vue-treeselect--searchable:not(.vue-treeselect--disabled) .vue-treeselect__value-container {
    cursor: text;
  }
  .vue-treeselect__multi-value {
    display: inline-block;
  }
  .vue-treeselect--has-value .vue-treeselect__multi-value {
    margin-bottom: 5px;
  }
  .vue-treeselect__placeholder,
  .vue-treeselect__single-value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 5px;
    padding-right: 5px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    line-height: 32px;
    user-select: none;
    pointer-events: none;
  }
  .vue-treeselect__placeholder {
    color: #bdbdbd;
  }
  .vue-treeselect__single-value {
    color: #333;
  }
  .vue-treeselect--focused.vue-treeselect--searchable .vue-treeselect__single-value {
    color: #bdbdbd;
  }
  .vue-treeselect__multi-value-item-container {
    display: inline-block;
    padding-top: 5px;
    padding-right: 5px;
    vertical-align: top;
  }
  .vue-treeselect__multi-value-item {
    display: inline-table;
    background: #e3f2fd;
    padding: 2px 0;
    border: 1px solid transparent;
    border-radius: 2px;
    color: #039be5;
    font-size: 12px;
    vertical-align: top;
  }
  .vue-treeselect:not(.vue-treeselect--disabled) .vue-treeselect__multi-value-item:not(.vue-treeselect__multi-value-item-disabled):hover {
    cursor: pointer;
    background: #e3f2fd;
    color: #039be5;
  }
  .vue-treeselect__multi-value-item.vue-treeselect__multi-value-item-disabled {
    cursor: default;
    background: #f5f5f5;
    color: #757575;
  }
  .vue-treeselect--disabled .vue-treeselect__multi-value-item {
    cursor: default;
    background: #fff;
    border-color: #e5e5e5;
    color: #555;
  }
  .vue-treeselect__value-remove,
  .vue-treeselect__multi-value-label {
    display: table-cell;
    padding: 0 5px;
    vertical-align: middle;
  }
  .vue-treeselect__value-remove {
    cursor: pointer;
    color: #039be5;
    padding-left: 5px;
    border-left: 1px solid #fff;
    line-height: 0;
  }
  .vue-treeselect__multi-value-item:hover .vue-treeselect__value-remove {
    color: #e53935;
  }
  .vue-treeselect--disabled .vue-treeselect__value-remove,
  .vue-treeselect__multi-value-item-disabled .vue-treeselect__value-remove {
    display: none;
  }
  .vue-treeselect__value-remove > svg {
    width: 6px;
    height: 6px;
  }
  .vue-treeselect__multi-value-label {
    padding-right: 5px;
    white-space: pre-line;
    user-select: none;
  }
  .vue-treeselect__limit-tip {
    display: inline-block;
    padding-top: 5px;
    padding-right: 5px;
    vertical-align: top;
  }
  .vue-treeselect__limit-tip-text {
    cursor: default;
    display: block;
    margin: 2px 0;
    padding: 1px 0;
    color: #bdbdbd;
    font-size: 12px;
    font-weight: 600;
  }
  .vue-treeselect__input-container {
    display: block;
    max-width: 100%;
    outline: none;
  }
  .vue-treeselect--single .vue-treeselect__input-container {
    font-size: inherit;
    height: 100%;
  }
  .vue-treeselect--multi .vue-treeselect__input-container {
    display: inline-block;
    font-size: 12px;
    vertical-align: top;
  }
  .vue-treeselect--searchable .vue-treeselect__input-container {
    padding-left: 5px;
    padding-right: 5px;
  }
  .vue-treeselect--searchable.vue-treeselect--multi.vue-treeselect--has-value .vue-treeselect__input-container {
    padding-top: 5px;
    padding-left: 0;
  }
  .vue-treeselect--disabled .vue-treeselect__input-container {
    display: none;
  }
  .vue-treeselect__input,
  .vue-treeselect__sizer {
    margin: 0;
    line-height: inherit;
    font-family: inherit;
    font-size: inherit;
  }
  .vue-treeselect__input {
    max-width: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    box-sizing: content-box;
    box-shadow: none;
    background: none transparent;
    line-height: 1;
    vertical-align: middle;
  }
  .vue-treeselect__input::-ms-clear {
    display: none;
  }
  .vue-treeselect--single .vue-treeselect__input {
    width: 100%;
    height: 100%;
  }
  .vue-treeselect--multi .vue-treeselect__input {
    padding-top: 3px;
    padding-bottom: 3px;
  }
  .vue-treeselect--has-value .vue-treeselect__input {
    line-height: inherit;
    vertical-align: top;
  }
  .vue-treeselect__sizer {
    position: absolute;
    top: 0;
    left: 0;
    visibility: hidden;
    height: 0;
    overflow: scroll;
    white-space: pre;
  }
  .vue-treeselect__x-container {
    display: table-cell;
    vertical-align: middle;
    width: 20px;
    text-align: center;
    line-height: 0;
    cursor: pointer;
    color: #ccc;
    animation: 200ms vue-treeselect-animation-fade-in ease-out-circ;
  }
  .vue-treeselect__x-container:hover {
    color: #e53935;
  }
  .vue-treeselect__x {
    width: 8px;
    height: 8px;
  }
  .vue-treeselect__control-arrow-container {
    display: table-cell;
    vertical-align: middle;
    width: 20px;
    text-align: center;
    line-height: 0;
    cursor: pointer;
  }
  .vue-treeselect--disabled .vue-treeselect__control-arrow-container {
    cursor: default;
  }
  .vue-treeselect__control-arrow {
    width: 9px;
    height: 9px;
    color: #ccc;
  }
  .vue-treeselect:not(.vue-treeselect--disabled) .vue-treeselect__control-arrow-container:hover .vue-treeselect__control-arrow {
    color: #616161;
  }
  .vue-treeselect--disabled .vue-treeselect__control-arrow {
    opacity: 0.35;
  }
  .vue-treeselect__control-arrow--rotated {
    transform: rotateZ(180deg);
  }
  /**
     * Menu
     */
  .vue-treeselect__menu {
    cursor: default;
    padding-top: 5px;
    padding-bottom: 5px;
    display: block;
    position: absolute;
    right: 0;
    left: 0;
    z-index: 999;
    overflow-x: hidden;
    overflow-y: auto;
    border: 1px solid #cfcfcf;
    background: #fff;
    line-height: 180%;
    -webkit-overflow-scrolling: touch;
  }
  .vue-treeselect--open-below .vue-treeselect__menu {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    top: 100%;
    margin-top: -1px;
    border-top-color: #f2f2f2;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
  }
  .vue-treeselect--open-above .vue-treeselect__menu {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    bottom: 100%;
    margin-bottom: -1px;
    border-bottom-color: #f2f2f2;
  }
  .vue-treeselect__indent-level-0 .vue-treeselect__option {
    padding-left: 5px;
  }
  .vue-treeselect__indent-level-0 .vue-treeselect__tip {
    padding-left: 25px;
  }
  .vue-treeselect__indent-level-1 .vue-treeselect__option {
    padding-left: 25px;
  }
  .vue-treeselect__indent-level-1 .vue-treeselect__tip {
    padding-left: 45px;
  }
  .vue-treeselect__indent-level-2 .vue-treeselect__option {
    padding-left: 45px;
  }
  .vue-treeselect__indent-level-2 .vue-treeselect__tip {
    padding-left: 65px;
  }
  .vue-treeselect__indent-level-3 .vue-treeselect__option {
    padding-left: 65px;
  }
  .vue-treeselect__indent-level-3 .vue-treeselect__tip {
    padding-left: 85px;
  }
  .vue-treeselect__indent-level-4 .vue-treeselect__option {
    padding-left: 85px;
  }
  .vue-treeselect__indent-level-4 .vue-treeselect__tip {
    padding-left: 105px;
  }
  .vue-treeselect__indent-level-5 .vue-treeselect__option {
    padding-left: 105px;
  }
  .vue-treeselect__indent-level-5 .vue-treeselect__tip {
    padding-left: 125px;
  }
  .vue-treeselect__indent-level-6 .vue-treeselect__option {
    padding-left: 125px;
  }
  .vue-treeselect__indent-level-6 .vue-treeselect__tip {
    padding-left: 145px;
  }
  .vue-treeselect__indent-level-7 .vue-treeselect__option {
    padding-left: 145px;
  }
  .vue-treeselect__indent-level-7 .vue-treeselect__tip {
    padding-left: 165px;
  }
  .vue-treeselect__indent-level-8 .vue-treeselect__option {
    padding-left: 165px;
  }
  .vue-treeselect__indent-level-8 .vue-treeselect__tip {
    padding-left: 185px;
  }
  .vue-treeselect__option {
    padding-left: 5px;
    padding-right: 5px;
    display: table;
    table-layout: fixed;
    width: 100%;
  }
  .vue-treeselect__option--highlight {
    background: #f5f5f5;
  }
  .vue-treeselect--single .vue-treeselect__option--selected {
    background: #e3f2fd;
    font-weight: 600;
  }
  .vue-treeselect--single .vue-treeselect__option--selected:hover {
    background: #e3f2fd;
  }
  .vue-treeselect__option--hide {
    display: none;
  }
  .vue-treeselect__option-arrow-container,
  .vue-treeselect__option-arrow-placeholder {
    display: table-cell;
    vertical-align: middle;
    width: 20px;
    text-align: center;
    line-height: 0;
  }
  .vue-treeselect__option-arrow-container {
    cursor: pointer;
  }
  .vue-treeselect__option-arrow {
    display: inline-block;
    width: 9px;
    height: 9px;
    color: #ccc;
    vertical-align: middle;
    transition: 200ms transform ease-out-expo;
    transform: rotateZ(-90deg);
  }
  .vue-treeselect__option-arrow-container:hover .vue-treeselect__option-arrow,
  .vue-treeselect--branch-nodes-disabled .vue-treeselect__option:hover .vue-treeselect__option-arrow {
    color: #616161;
  }
  .vue-treeselect__option-arrow--rotated {
    transform: rotateZ(0);
  }
  .vue-treeselect__option-arrow--rotated.vue-treeselect__option-arrow--prepare-enter {
    transform: rotateZ(-90deg) !important;
  }
  .vue-treeselect__label-container {
    display: table-cell;
    vertical-align: middle;
    cursor: pointer;
    display: table;
    width: 100%;
    table-layout: fixed;
    color: inherit;
  }
  .vue-treeselect__option--disabled .vue-treeselect__label-container {
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.25);
  }
  .vue-treeselect__checkbox-container {
    display: table-cell;
    width: 20px;
    min-width: 20px;
    height: 100%;
    text-align: center;
    vertical-align: middle;
  }
  .vue-treeselect__checkbox {
    display: block;
    margin: auto;
    width: 12px;
    height: 12px;
    border-width: 1px;
    border-style: solid;
    border-radius: 2px;
    position: relative;
    transition: 200ms all ease-out-circ;
  }
  .vue-treeselect__check-mark,
  .vue-treeselect__minus-mark {
    display: block;
    position: absolute;
    left: 1px;
    top: 1px;
    background-repeat: no-repeat;
    opacity: 0;
    transition: 200ms all ease;
  }

  .vue-treeselect__checkbox--unchecked {
    border-color: #e0e0e0;
    background: #fff;
  }
  .vue-treeselect__label-container:hover .vue-treeselect__checkbox--unchecked {
    border-color: #039be5;
    background: #fff;
  }
  .vue-treeselect__checkbox--indeterminate {
    border-color: #039be5;
    background: #039be5;
  }
  .vue-treeselect__label-container:hover .vue-treeselect__checkbox--indeterminate {
    border-color: #039be5;
    background: #039be5;
  }
  .vue-treeselect__checkbox--checked {
    border-color: #039be5;
    background: #039be5;
  }
  .vue-treeselect__label-container:hover .vue-treeselect__checkbox--checked {
    border-color: #039be5;
    background: #039be5;
  }
  .vue-treeselect__checkbox--disabled {
    border-color: #e0e0e0;
    background-color: #f7f7f7;
  }
  .vue-treeselect__label-container:hover .vue-treeselect__checkbox--disabled {
    border-color: #e0e0e0;
    background-color: #f7f7f7;
  }
  .vue-treeselect__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: table-cell;
    padding-left: 5px;
    max-width: 100%;
    vertical-align: middle;
    cursor: inherit;
  }
  .vue-treeselect__count {
    font-weight: 400;
    opacity: 0.6;
  }
  .vue-treeselect__tip {
    padding-left: 5px;
    padding-right: 5px;
    display: table;
    table-layout: fixed;
    width: 100%;
    color: #757575;
  }
  .vue-treeselect__tip-text {
    display: table-cell;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    padding-left: 5px;
    font-size: 12px;
  }
  .vue-treeselect__error-tip .vue-treeselect__retry {
    cursor: pointer;
    font-style: normal;
    font-weight: 600;
    text-decoration: none;
    color: #039be5;
  }
  .vue-treeselect__icon-container {
    display: table-cell;
    vertical-align: middle;
    width: 20px;
    text-align: center;
    line-height: 0;
  }
  .vue-treeselect--single .vue-treeselect__icon-container {
    padding-left: 5px;
  }
  .vue-treeselect__icon-warning {
    display: block;
    margin: auto;
    border-radius: 50%;
    position: relative;
    width: 12px;
    height: 12px;
    background: #fb8c00;
  }
  .vue-treeselect__icon-warning::after {
    display: block;
    position: absolute;
    content: '';
    left: 5px;
    top: 2.5px;
    width: 2px;
    height: 1px;
    border: 0 solid #fff;
    border-top-width: 5px;
    border-bottom-width: 1px;
  }
  .vue-treeselect__icon-error {
    display: block;
    margin: auto;
    border-radius: 50%;
    position: relative;
    width: 12px;
    height: 12px;
    background: #e53935;
  }
  .vue-treeselect__icon-error::before,
  .vue-treeselect__icon-error::after {
    display: block;
    position: absolute;
    content: '';
    background: #fff;
    transform: rotate(45deg);
  }
  .vue-treeselect__icon-error::before {
    width: 6px;
    height: 2px;
    left: 3px;
    top: 5px;
  }
  .vue-treeselect__icon-error::after {
    width: 2px;
    height: 6px;
    left: 5px;
    top: 3px;
  }
  .vue-treeselect__icon-loader {
    display: block;
    margin: auto;
    position: relative;
    width: 12px;
    height: 12px;
    text-align: center;
    animation: 1.6s vue-treeselect-animation-rotate linear infinite;
  }
  .vue-treeselect__icon-loader::before,
  .vue-treeselect__icon-loader::after {
    border-radius: 50%;
    position: absolute;
    content: '';
    left: 0;
    top: 0;
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0.6;
    animation: 1.6s vue-treeselect-animation-bounce ease-in-out infinite;
  }
  .vue-treeselect__icon-loader::before {
    background: #039be5;
  }
  .vue-treeselect__icon-loader::after {
    background: #b3e5fc;
    animation-delay: -0.8s;
  }

  .vue-treeselect {
    display: inline-block;
    vertical-align: top;
  }

  /*  .vue-treeselect /deep/ .vue-treeselect__single-value {
      color: #ff0000;
     }*/

  .inline-block {
    display: inline-block;
  }

  .goods-link-content {
    padding: 15px 0 20px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    .goods-link-list {
      font-size: 0;
      li:nth-child(3n + 3) {
        margin-right: 0;
      }
    }
  }
  .goods-link-item {
    display: inline-block;
    width: 227px;
    padding: 10px 10px;
    height: 110px;
    border: 1px solid #e7e7eb;
    margin-right: 7px;
    margin-bottom: 10px;
    cursor: pointer;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
  }
  .goods-link-item img {
    width: 80px;
    height: 80px;
    display: inline-block;
    /*margin-top: 10px;*/
  }

  .goods-message {
    width: 100px;
    /*margin-top: 10px;*/
    vertical-align: top;
    margin-left: 5px;
    white-space: normal;
    word-break: break-all;
    font-size: 14px;
  }

  .links-tools-row /deep/ {
    /*overflow: hidden;*/
    font-size: 0;
    .vue-treeselect + .vue-treeselect {
      margin-left: 10px;
    }
  }

  .links-tools-row {
    font-size: 0;
    .vue-treeselect + .vue-treeselect {
      margin-left: 10px;
    }
  }

  /* 分页 */
  .links-tools-page {
    text-align: right;
  }

  .goods-category {
    height: 300px;
    overflow: auto;
  }

  /* 自定义 */
  .definepage {
    height: 300px;
    overflow: auto;
    .definepage-ul {
      li {
        height: 50px;
        line-height: 50px;
        cursor: pointer;
        &:hover {
          background: #f5f5f8;
        }
      }
    }
  }

  .links-types {
    font-size: 0;

    .types-title {
      display: inline-block;
      width: 69px;
      text-align: right;
      font-size: 14px;
      padding-right: 10px;
      vertical-align: middle;
      color: #303133;
    }

    .el-select + .el-select {
      margin-left: 10px;
    }

    /* 三级 wrap */
    .three-level-wrap {
      display: inline-block;
      vertical-align: top;
      margin-left: 10px;
    }
  }

  /* 商品链接 */
  .goods-links-contian {
    margin-top: 30px;
    padding: 20px;
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    .links-tools-row {
      font-size: 0;
    }

    .goods-link-item {
      &:hover {
        border: 1px solid #1890ff;
      }

      &.goodSelect {
        border: 1px solid #1890ff;
      }

      .limit-2 {
        width: 100%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        white-space: pre-wrap;
        word-break: break-all;
        overflow: hidden;
        line-height: 18px;
        max-height: 36px;
      }

      .pro-name {
        color: #303133;
      }

      .pro-code {
        margin: 5px 0;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .gray-color {
        color: #909399;
        font-size: 14px;
        line-height: 18px;
      }

      .pro-price {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #303133;
      }
    }
  }

  /* h5链接 */
  .h5link-row {
    width: 100%;
    margin-top: 22px;

    label {
      display: inline-block;
      width: 71px;
      margin-right: 7px;
      text-align: right;
    }

    .el-input,
    .el-textarea {
      width: 450px;
    }

    .el-textarea {
      vertical-align: top;
    }

    .h5link-help {
      padding-left: 10px;
      font-size: 10px;
      color: #5073fd;
    }

    .dynamic-param-select {
      vertical-align: top;
    }
  }
  .el-tabs__content {
    overflow: auto;
  }

  .el-dialog__body {
    /*border-bottom: 1px solid #e7e7eb;*/
    padding: 0px 20px 0 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .el-dialog__footer {
    padding: 10px 20px;
  }

  .dialog-footer {
    display: inline-block;
    padding: 10px 20px;
    width: 100%;
    text-align: right;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .el-tree {
    .el-tree-node {
      padding: 8px 0;
    }
  }

  .el-dialog {
    /*min-width: 1051px;*/
    margin: 0;
    // border: 1px solid #e8e8e8;
    box-shadow: none;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    .el-dialog__header {
      border-bottom: 1px solid #e7e7eb;
    }
  }

  .min-780 {
    .el-dialog {
      min-width: 780px;
    }
  }

  .min-1028 {
    .el-dialog {
      min-width: 1028px;
    }
  }

  .links-tools-input {
    width: 217px;
    vertical-align: top;
    float: right;
    /*/deep/ .el-input__inner{
        height: 36px;
        line-height: 36px;
      }*/
  }

  .vue-treeselect__single-value {
    line-height: 40px;
  }

  /* 不显示每页显示几个 */
  .el-pagination__sizes {
    display: none;
  }

  .vue-treeselect {
    width: 217px;
    font-size: 14px;

    .vue-treeselect__control {
      height: 32px;
      line-height: 32px;
      cursor: pointer;
    }

    .vue-treeselect__placeholder {
      line-height: 32px;
      font-size: 13.3333px;
    }

    .vue-treeselect--searchable:not(.vue-treeselect--disabled) .vue-treeselect__value-container {
      cursor: pointer;
    }
  }

  .vue-treeselect div,
  .vue-treeselect span {
    line-height: 32px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .vue-treeselect__control {
    padding-left: 5px;
    padding-right: 5px;
    display: table;
    table-layout: fixed;
    width: 100%;
    height: 40px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #fff;
    -webkit-transition-duration: 200ms;
    transition-duration: 200ms;
    -webkit-transition-property: border-color, width, height, background-color, opacity, -webkit-box-shadow;
    transition-property: border-color, width, height, background-color, opacity, -webkit-box-shadow;
    transition-property: border-color, box-shadow, width, height, background-color, opacity;
    transition-property: border-color, box-shadow, width, height, background-color, opacity, -webkit-box-shadow;
    -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  .vue-treeselect__control-arrow {
    display: none;
  }

  .vue-treeselect__control-arrow-container {
    position: relative;
  }

  .vue-treeselect__control-arrow-container:after,
  .vue-treeselect__control-arrow-container:before {
    border: 6px solid transparent;
    border-left: 6px solid #fff;
    width: 0;
    height: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -6px;
    content: ' ';
    margin-top: -3px;
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transform: rotate(90deg);
    -webkit-transition: -webkit-transform 0.3s;
    transition: -webkit-transform 0.3s;
    transition: transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
  }

  .vue-treeselect__control-arrow-container:before {
    border-left-color: #c0c4cc;
    top: 52%;
  }

  .vue-treeselect--focused .vue-treeselect__control-arrow-container:after,
  .vue-treeselect--focused .vue-treeselect__control-arrow-container:before {
    margin-top: -6px;
    -webkit-transform: rotateZ(-90deg);
    -moz-transform: rotateZ(-90deg);
    -o-transform: rotateZ(-90deg);
    transform: rotateZ(-90deg);
    -webkit-transition: -webkit-transform 0.3s;
    transition: -webkit-transform 0.3s;
    transition: transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
  }

  .vue-treeselect--focused .vue-treeselect__control-arrow-container:before {
    border-left-color: #c0c4cc;
    top: 47%;
  }

  .vue-treeselect--has-value .vue-treeselect__multi-value {
    margin-bottom: 0;
  }
}
</style>

<template>
  <div class="people-content">
    <!-- 选择模板 -->
    <div class="people-temp-head">
      <!-- 模板内容 -->
      <div class="condition-detail-contain" v-if="conditionDetailShow">
        <div class="screening-condition">
          <div class="detail" id="detail-tempcondition">
            <filter-txt :templatetxt="templatetxt"></filter-txt>
          </div>
          <span class="el-icon-edit btn-edit-group" id="btn-edit-group-tempcondition" title="编辑用户群" @click="editTemp" style="display: inline-block;"></span>
          <span class="el-icon-delete btn-cancel-group" id="btn-cancel-group-tempcondition" title="重置条件" @click="resetTemp"></span>
        </div>
      </div>
      <!-- end -->
      <!-- 筛选条件 -->
      <div class="filter-condition-wrap">
        <div class="filter-content" v-if="conditionsShow">
          <p class="member-templates-condition-title">筛选条件</p>
          <div class="filter-group marginLeft134">
            <!-- 增加内容部分 -->
            <div id="app1" class="rations">
              <!-- 循环几行(并且)-->
              <div class="condition-cell" v-for="(item, index) in conditionsList" :key="index" v-if="item.children.length > 0">
                <div class="andlabels labelsbg_white" data-ration-id="index" v-if="index != 0">并且</div>
                <div class="filter-box inline-block ration" data-ration-id="index">
                  <!-- 循环几行(或者) -->
                  <div class="group_combo" data-group-id="1" v-for="(cellItem, key) in item.children" :key="key">
                    <div class="orlabels" v-if="key != 0">或者</div>
                    <!-- type="belong" -->
                    <div class="filter-message groupbox">
                      <span class="el-icon-close filter-close" @click="deleteCell(index, key)"></span>
                      <p class="fliter-message-title inline-block">{{ cellItem.chainNodeName }}</p>

                      <!-- 一行循环了几个 -->
                      <template v-for="(childCell, ind) in cellItem.children">
                        <div class="gic-select-wrap inline-block" :key="ind" v-if="childCell.templateCode == 'com020' && childCell.storeFlag">
                          <dm-store-new :options="childCell.storeOption" :key="ind" :uuid.sync="childCell.uuid" :isAdd="childCell.operateType" ref="storeNew"></dm-store-new>
                        </div>

                        <!-- 下拉单选 -->
                        <!-- && !childCell.widgetName -->
                        <div class="gic-select-wrap inline-block" :key="ind" v-if="childCell.templateCode == 'com001' && !childCell.widgetName">
                          <div class="gic-select">
                            <el-select v-model="childCell.levelModel" class="temp-select" placeholder="请选择" @focus="selectFocus(index, key, ind)" @change="tempChange(index, key, ind)">
                              <el-option v-for="item in childCell.levelOptions" :label="item.value" :key="item.key" :value="item.key"></el-option>
                            </el-select>
                          </div>
                        </div>

                        <!-- 下拉多选 最后控件-->
                        <div class="gic-select-wrap inline-block" :key="ind" v-if="childCell.templateCode == 'com002'">
                          <el-select v-model="childCell.levelModel" multiple class="temp-select" @focus="selectFocus(index, key, ind)" placeholder="请选择" @change="tempChangeMultip($event, index, key, ind)">
                            <el-option v-for="item in childCell.levelOptions" :label="item.value" :key="item.key" :value="item.key"></el-option>
                          </el-select>
                        </div>

                        <!-- 加输入框 最后控件-->
                        <div class="gic-select-wrap inline-block" :key="ind" v-if="childCell.templateCode == 'com003'">
                          <el-input v-model="childCell.levelModel" class="select-wrap-input" placeholder="请输入" @focus="selectFocus(index, key, ind)" @keyup.native="value => toInput(value, index, key, ind)"></el-input>
                          <label></label>
                        </div>

                        <!-- 加区间输入框 最后控件-->
                        <div class="gic-select-wrap inline-block" :key="ind" v-if="childCell.templateCode == 'com013'">
                          <el-input v-model="childCell.levelModel[0]" class="select-wrap-input" style="margin-right: 0;" :placeholder="childCell.widgetInstruction" @blur="blurFrom" @focus="selectFocus(index, key, ind)"></el-input>
                          <!-- @keyup.native="(value) => toInputFrom(value)" -->
                          <label>-</label>
                          <el-input v-model="childCell.levelModel[1]" class="select-wrap-input" style="margin-right: 0;" :placeholder="childCell.widgetInstruction" @blur="blurTo" @focus="selectFocus(index, key, ind)"></el-input>
                          <!-- @keyup.native="(value) => toInputTo(value)" -->
                        </div>
                        <!-- 搜索后出现下列  最后控件-->
                        <div class="gic-select-wrap inline-block input-search-select" :key="ind" v-if="childCell.templateCode == 'com005'">
                          <el-select v-model="childCell.levelModel" multiple filterable remote :placeholder="childCell.widgetInstruction" :reserve-keyword="false" :remote-method="remoteMethod" @focus="selectFocus(index, key, ind)" @change="changeRemote($event, index, key, ind)">
                            <el-option v-for="item in childCell.levelOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
                          </el-select>
                        </div>
                        <!-- 时间区间年月日-年月日  最后控件-->
                        <div class="gic-select-wrap inline-block" :key="ind" v-if="childCell.templateCode == 'com006'">
                          <el-date-picker v-model="childCell.levelModel" type="daterange" :editable="false" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyyMMdd" value-format="yyyyMMdd" :default-time="['000000', '235959']" :picker-options="pickerOptions" @focus="selectFocus(index, key, ind)" @change="changeDate($event, index, key, ind)"></el-date-picker>
                        </div>

                        <!-- 下拉多选异步() 最后控件-->
                        <div class="gic-select-wrap inline-block" :key="ind" v-if="childCell.templateCode == 'com007'" @click="selectFocus(index, key, ind)">
                          <el-select v-model="childCell.levelModel" multiple class="temp-select" @focus="selectFocus(index, key, ind)" placeholder="请选择" @change="tempChangeMultip($event, index, key, ind)">
                            <el-option v-for="item in childCell.levelOptions" :key="item.key" :label="item.value" :value="item.key"></el-option>
                          </el-select>
                        </div>

                        <!-- 时间区间 月日- 月日 最后控件-->
                        <div class="gic-select-wrap inline-block" :key="ind" v-if="childCell.templateCode == 'com008'">
                          <gic-select :dateval.sync="childCell.levelModel" @change="changeGicSelectValue(index, key, ind)"></gic-select>
                        </div>

                        <!-- 下拉单选异步 -->
                        <div class="gic-select-wrap inline-block" :key="ind" v-if="childCell.templateCode == 'com009'">
                          <div class="gic-select">
                            <el-select v-model="childCell.levelModel" class="temp-select" placeholder="请选择" @focus="selectFocus(index, key, ind)" @change="tempChange(index, key, ind)">
                              <el-option v-for="item in childCell.levelOptions" :key="item.key" :label="item.value" :value="item.key">
                                <!-- :key="item.key" -->
                              </el-option>
                            </el-select>
                          </div>
                        </div>

                        <!-- input tag 最后控件-->
                        <div class="gic-select-wrap inline-block input-tags" :key="ind" v-if="childCell.templateCode == 'com010'">
                          <tags :tags.sync="childCell.levelModel" @click="selectFocus(index, key, ind)" :placeholder="childCell.widgetInstruction" @tagsChange="changeCreate($event, index, key, ind)" />
                        </div>
                        <!-- 时间区间年月日时分秒-年月日时分秒  最后控件v-if="childCell.templateCode == 'com012'"-->
                        <div class="gic-select-wrap inline-block" :key="ind" v-if="childCell.templateCode == 'com012'">
                          <!-- default-time="235900" -->
                          <el-date-picker v-model="childCell.levelModel" type="daterange" :editable="false" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyyMMdd" value-format="yyyyMMddHHmmss" :default-time="['000000', '235959']" :picker-options="pickerOptionsRange" @focus="selectFocus(index, key, ind)" @change="changeDate($event, index, key, ind)"></el-date-picker>
                        </div>
                      </template>
                    </div>
                  </div>
                  <!-- 或者条件 -->
                  <div class="add-or-box" v-if="item.children.length < orConditionLength">
                    <span class="add-or-words">或者</span>
                    <span class="add-or-type" id>
                      <ul class="filter-button condition-type" id>
                        <li data-flag="or" v-for="(orItem, cindex) in conditionTypeList" :key="cindex" data-index="index" data-key="key" data-conditiontype="belong" @click="orConditionClick(index, 'or', orItem)">{{ orItem.chainNodeName }}</li>
                      </ul>
                    </span>
                  </div>
                </div>

                <!-- 第一个end -->
              </div>
            </div>
            <div class="filter-and add-and-box addAndConditions" v-if="conditionsList.length < andConditionLength">
              <span class="and-words" v-if="conditionsList.length > 0">并且</span>
              <span class="conditionTypes">
                <ul class="filter-button condition-type">
                  <li data-flag="and" data-conditiontype="belong" v-for="(andItem, index) in conditionTypeList" :key="index" @click="andConditionClick('and', andItem)">{{ andItem.chainNodeName }}</li>
                </ul>
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- end -->
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import { baseUrl } from '@/config/index.js';
import dmStoreNew from '../dm-store-new/index.vue';
import FilterTxt from './filter-txt';
import tags from './tags';
import GicSelect from './birth-select';

export default {
  name: 'vue-gic-people',
  props: {
    isAdd: {
      type: Boolean,
      default: true
    },
    // 是否是触发重置按钮
    triggerReset: {
      type: Boolean,
      default: false
    },
    searchBackTxt: [String, Object], // 缓存
    conditionList: Array,
    projectName: String, // 项目名
    sceneValue: String, // 场景值
    useId: String, // 模板id
    hasSearchData: String, // 当前页返回的数据
    tempData: String // 当前页临时返回的数据
  },
  data() {
    return {
      flagStore: false,
      OperateType: '',
      searchBackVal: '', //
      repProjectName: 'gic-web', // 项目名
      repSceneCode: 'member', //场景值
      repId: '', // 模板id
      tempDataTemp: '', // 临时数据
      // 查询 list
      selectDataList: [],
      // 显示缩略的文字
      templatetxt: '',
      responseData: '',
      // 获取 location origin
      baseUrl: baseUrl,
      // data
      pickerOptions: {},
      // 生日
      birthBegin: '',
      birthEnd: '',
      pickerBirthOptions: {
        onPick(date) {
          //  (0-9)年月数字的显示
          function formatDig(num) {
            return num > 9 ? '' + num : '0' + num;
          }
          this.birthBegin = formatDig(new Date(date.minDate).getMonth() + 1) + formatDig(new Date(date.minDate).getDate());
          this.birthEnd = formatDig(new Date(date.maxDate).getMonth() + 1) + formatDig(new Date(date.maxDate).getDate());
        }
      },
      pickerOptionsRange: {},
      // 区域 option
      areaOptions: {
        provinceName: '',
        provinceId: '',
        cityName: '',
        cityId: '',
        countryName: '',
        countyId: ''
      },
      // 头部模板
      tempValue: '',
      tempOptions: [
        {
          value: '选项1',
          label: '第一种人'
        },
        {
          value: '选项2',
          label: '第二种人'
        }
      ],
      // 获取的文字
      templateData: '',
      // 模板详细条件
      conditionDetailShow: false, // true: 显示详细; false: 隐藏详细
      // 模板所有条件
      conditionsShow: true, // true: 显示选择条件; false: 隐藏选择条件
      // 或者条件长度
      orConditionLength: 3,
      // 并且条件长度
      andConditionLength: 5,
      // 输入框多个
      optionsNone: [],
      // 条件数据
      conditionsList: [],
      // tree
      treeFlag: false,
      nodeId: '0', //获取门店分组参数
      storeData: [
        {
          storeGroupId: 0,
          parentGroupId: '0',
          enterpriseId: 'rrrr',
          storeGroupName: '所有门店',
          groupLevel: 'fff',
          storeGroupChain: '所有门店',
          children: [
            {
              storeGroupId: 1,
              parentGroupId: '0',
              enterpriseId: 'rrrr',
              storeGroupName: 'A区',
              groupLevel: 'fff',
              storeGroupChain: 'A区',
              children: [
                {
                  storeGroupId: 33,
                  parentGroupId: '1',
                  enterpriseId: 'rrrr',
                  storeGroupName: 'A1区',
                  groupLevel: 'fff',
                  storeGroupChain: 'A1区'
                }
              ]
            },
            {
              storeGroupId: 2,
              parentGroupId: '0',
              enterpriseId: 'rrrr',
              storeGroupName: 'B区',
              groupLevel: 'fff',
              storeGroupChain: 'B区'
            },
            {
              storeGroupId: 3,
              parentGroupId: '0',
              enterpriseId: 'rrrr',
              storeGroupName: 'C区',
              groupLevel: 'fff',
              storeGroupChain: 'C区'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'storeGroupName'
      },
      valueConsistsOf: 'BRANCH_PRIORITY', // tree节点
      normalizer(node) {
        if (node) {
          return {
            id: node.storeGroupId,
            label: node.storeGroupName,
            children: node.children
          };
        }
        return {};
      },
      // 条件类别列表数据
      conditionTypeList: [],
      // 当前选择的并条件索引,或条件索引, 第几个组件
      andIndex: '',
      orIndex: '',
      componentIndex: '',
      // 增加的字段
      addObjKey: {
        key: 'storeId',
        value: '所有关联门店'
      }
    };
  },
  methods: {
    // 接收生日时间范围值
    changeGicSelectValue(i, j, k) {
      this.conditionsList[i].children[j].columnValue = this.conditionsList[i].children[j].children[1].levelModel.toString();
    },
    // 过滤回显数据
    filterPassValue(data = []) {
      data = data.map((ele, index) => {
        // 处理并且的条件
        ele.children.map((el, i) => {
          // 处理或条件
          el.children.map((e, ix) => {
            let model = e.levelModel; // 用来对比
            // model 有基本类型和引用类型
            let filterArr = [];
            if (Array.isArray(model) && model.length) {
              model.forEach(mel => {
                if (e.levelOptions && e.levelOptions.length) {
                  let middle = e.levelOptions.find(val => {
                    if (val) {
                      return val.key == mel;
                    }
                  });
                  filterArr.push(middle);
                }
              });
            } else {
              if (e.levelOptions && e.levelOptions.length) {
                filterArr = e.levelOptions.filter(item => {
                  if (item) {
                    return item.key == model;
                  }
                });
              }
            }
            e.levelOptions.length = 0;
            e.levelOptions = filterArr;
            return e;
          });
          return el;
        });
        return ele;
      });
      return data;
    },
    // 选择方法后,获取下级数据,追加到当行数据
    tempChange(index, key, order) {
      if (this.conditionsList[index].children[key].children[1]) {
        this.conditionsList[index].children[key].children[1].storeFlag = false;
      }
      // 请求参数
      let parentChainId = this.conditionsList[index].children[key].children[order].esScreeningWidgetChainId;
      let widgetFieldKey = this.conditionsList[index].children[key].children[order].levelModel;
      this.getNextData(parentChainId, widgetFieldKey, {
        index: index,
        key: key,
        order: order
      });
    },
    // 下拉多选最后控件
    tempChangeMultip(e, index, key, order) {
      this.conditionsList[index].children[key].columnValue = e.join(' ');
    },
    // 获取列表
    getDataList() {
      let para = {
        sceneCode: this.repSceneCode,
        requestProject: this.repProjectName
      };
      this.axios
        .post(this.baseUrl + '/api-plug/get-screening-init-data', qs.stringify(para))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            this.conditionTypeList = resData.result;
            return;
          }
          this.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(error => {
          this.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },
    // 获取下级数据
    getNextData(parentChainId, widgetFieldKey, indexObj) {
      this.$forceUpdate();
      let param = {
        requestProject: this.repProjectName,
        parentChainId: parentChainId,
        widgetFieldKey: widgetFieldKey
      };

      this.axios
        .post(this.baseUrl + '/api-plug/get-screening-chain-detail', qs.stringify(param))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            let data = resData.result;
            if (!resData.result) {
              this.$message.warning('没有此模板!');
              return;
            }
            if (data.property != 16 && data.property != 4 && !!this.conditionsList[this.andIndex].children[this.orIndex].dealKey) {
              delete this.conditionsList[this.andIndex].children[this.orIndex].dealKey;
            }
            if (data.property == 1) {
              // "property" : "8", //属性:1、计算属性(>,=), 2、字段属性(搜索字段名称)，4、值属性，8、不是属性  可以两两组合(比如，有事计算属性又是值属性，就是5
              //this.conditionsList[this.andIndex].children[this.orIndex].children[0].levelModel;
              this.conditionsList[this.andIndex].children[this.orIndex].computeCharacter = data.computeCharacter;
              this.conditionsList[this.andIndex].children[this.orIndex].columnValue = '';
              if (this.conditionsList[this.andIndex].children[this.orIndex].dealKey) {
                delete this.conditionsList[this.andIndex].children[this.orIndex].dealKey;
              }
            }
            // 字段
            if (data.property == 2) {
              // "property" : "8", //属性:1、计算属性(>,=), 2、字段属性(搜索字段名称)，4、值属性，8、不是属性  可以两两组合(比如，有事计算属性又是值属性，就是5
              this.conditionsList[this.andIndex].children[this.orIndex].columnKey = data.columnKey;
              this.conditionsList[this.andIndex].children[this.orIndex].computeCharacter = '';
              this.conditionsList[this.andIndex].children[this.orIndex].columnValue = '';
              if (this.conditionsList[this.andIndex].children[this.orIndex].dealKey) {
                delete this.conditionsList[this.andIndex].children[this.orIndex].dealKey;
              }
            }
            // 计算属性+字段属性
            if (data.property == 3) {
              // "property" : "8", //属性:1、计算属性(>,=), 2、字段属性(搜索字段名称)，4、值属性，8、不是属性  可以两两组合(比如，有事计算属性又是值属性，就是5
              this.conditionsList[this.andIndex].children[this.orIndex].computeCharacter = data.computeCharacter;
              this.conditionsList[this.andIndex].children[this.orIndex].columnKey = data.columnKey;
              this.conditionsList[this.andIndex].children[this.orIndex].columnValue = '';
              if (this.conditionsList[this.andIndex].children[this.orIndex].dealKey) {
                delete this.conditionsList[this.andIndex].children[this.orIndex].dealKey;
              }
            }
            // 值属性
            if (data.property == 4) {
              // "property" : "8", //属性:1、计算属性(>,=), 2、字段属性(搜索字段名称)，4、值属性，8、不是属性  可以两两组合(比如，有事计算属性又是值属性，就是5
              this.conditionsList[this.andIndex].children[this.orIndex].columnValue = data.columnValue;
            }
            // 门店
            if (data.property === 19 && data.widget.templateCode === 'com020') {
              this.conditionsList[this.andIndex].children[this.orIndex].dealKey = 'storeWidget';
            }
            if ((data.property & 16) > 0) {
              this.conditionsList[this.andIndex].children[this.orIndex].dealKey = data.dealKey;
              this.conditionsList[this.andIndex].children[this.orIndex].columnKey = data.columnKey;
              this.conditionsList[this.andIndex].children[this.orIndex].computeCharacter = data.computeCharacter;
              this.conditionsList[this.andIndex].children[this.orIndex].columnValue = '';
            }
            // 判断是否把数据添加到下级组件中
            this.addNextData(resData.result, widgetFieldKey, indexObj);
            return;
          }
          this.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(error => {
          this.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },
    // 添加数据到下级组件,需要先清空当前组件以后所有数据
    addNextData(item, fieldKey, indexObj) {
      // 先清空当前组件以后所有数据
      let arrList = this.conditionsList[this.andIndex].children[this.orIndex].children;
      for (let i = 0; i < arrList.length; i++) {
        if (this.componentIndex < i) {
          arrList.splice(i, 1);
          --i;
        }
      }
      // sourceFlag  如果是 url
      if (!!item.widget && item.widget.sourceFlag == 1) {
        item.widget.widgetParam = JSON.parse(item.widget.widgetParam);
        // 如果是搜索下拉多选
        if (item.widget.templateCode == 'com005') {
          this.conditionsList[this.andIndex].children[this.orIndex].children[this.componentIndex].url = item.widget.widgetParam[0].value;
          // 追加数据,显示下拉搜索双选组件,因为是多选,追加数据时候levelModel 是数组,不然选择时候报错 TypeError: value.push is not a function
          this.pushData(item);
          return;
        }
        // 获取下级数据
        this.getUrlData(item.widget.widgetParam, item, fieldKey);
        return;
      }
      if (!item || !item.widget) {
        return;
      }
      // 添加数据到下级组件
      let conditionTag = item.widget.templateCode == 'com002' || item.widget.templateCode == 'com010' || item.widget.templateCode == 'com013';
      // 添加示范文本
      let widgetName;
      const storeOption = [0, 1, 2, 3, 4, 5];
      const levelOptions = JSON.parse(item.widget.widgetValues);

      // 0 全部 1 门店类型 2门店标签 3 门店区域 4 门店分组 5 部分门店
      if (item.property === 19 && item.widget.templateCode === 'com020') {
        widgetName = item.widget.widgetName;
      }
      const newObj = {
        esScreeningWidgetChainId: item.esScreeningWidgetChainId,
        property: item.property,
        levelModel: conditionTag ? [] : '',
        templateCode: item.widget.templateCode,
        levelOptions: levelOptions,
        widgetInstruction: item.widget.widgetInstruction ? item.widget.widgetInstruction : '请选择',
        widgetName: widgetName,
        storeOption: storeOption,
        storeFlag: true,
        operateType: true,
        uuid: ''
      };
      this.conditionsList[this.andIndex].children[this.orIndex].children.push(newObj);
    },
    // 追加数据
    pushData(item) {
      let newObj = {};
      newObj = {
        esScreeningWidgetChainId: item.esScreeningWidgetChainId,
        property: item.property,
        levelModel: [],
        templateCode: item.widget.templateCode,
        levelOptions: [], //JSON.parse(item.widget.widgetValues),
        widgetInstruction: item.widget.widgetInstruction ? item.widget.widgetInstruction : '请选择',
        widgetName: item.widget.widgetName
      };
      this.conditionsList[this.andIndex].children[this.orIndex].children.push(newObj);
    },
    // 追加组件+数据
    pushComData(item, options) {
      let newObj = {};
      newObj = {
        esScreeningWidgetChainId: item.esScreeningWidgetChainId,
        property: item.property,
        levelModel: [],
        templateCode: item.widget.templateCode,
        levelOptions: options //JSON.parse(item.widget.widgetValues),
      };
      this.conditionsList[this.andIndex].children[this.orIndex].children.push(newObj);
    },
    // 获取请求的url,请求数据到下级
    getUrlData(widgetParam, item, fieldKey) {
      let param = {
        requestProject: this.repProjectName,
        key: fieldKey
      };
      this.axios
        .post(this.baseUrl + widgetParam[0].value, qs.stringify(param))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            // 判断省市县控件
            if (item.widget.templateCode == 'com011') {
              resData.result.forEach(function(ele, index) {
                ele.storeGroupId = ele.provinceId;
                ele.storeGroupName = ele.provinceName;
                if (ele.children.length) {
                  ele.children.forEach(function(el, ind) {
                    el.storeGroupId = el.cityId;
                    el.storeGroupName = el.cityName;
                  });
                }
              });
            }
            this.pushComData(item, resData.result);
            return;
          }
          this.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(error => {
          this.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },
    // input tag
    changeCreate(e, index, key, ind) {
      if (!this.conditionsList[index].children[key].children[ind].holderFlag) {
        this.conditionsList[index].children[key].children[ind].holderFlag = false;
      }
      if (!this.conditionsList[index].children[key].children[ind].holderFlag) {
        this.conditionsList[index].children[key].children[ind].holderFlag = true;
        this.conditionsList[index].children[key].children[ind].middleHolder = this.conditionsList[index].children[key].children[ind].widgetInstruction;
      }
      this.conditionsList[index].children[key].children[ind].widgetInstruction = e.length ? '' : this.conditionsList[index].children[key].children[ind].middleHolder;
      this.conditionsList[index].children[key].columnValue = e.join(' ');
    },
    // 输入框输入的时候
    toInput(e, index, key, ind) {
      let value = e.target.value;
      const REG = /^[0-9][0-9]*/; // 正整数
      if (!REG.test(value)) {
        e.target.value = '';
        this.$message.warning('请输入正整数');
      }
      this.conditionsList[this.andIndex].children[this.orIndex].columnValue = String(value);
    },
    blurFrom(e) {
      let value = !Number(e.target.value.replace(/[^\.\d]/g, '')) ? Number(0) : Number(e.target.value.replace(/[^\.\d]/g, ''));
      // 判断输入
      let v1 = this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[0];
      let v2 = this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[1];
      if (!Number(v2) || Number(v1) >= Number(v2)) {
        this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[0] = value;
        this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[1] = Number((!!Number(v1) ? Number(v1) : 0) + 1);
        this.$forceUpdate();
        this.conditionsList[this.andIndex].children[this.orIndex].columnValue = this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel.join(',');
        return;
      }
      this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[0] = value;
      this.conditionsList[this.andIndex].children[this.orIndex].columnValue = this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel.join(',');
      this.$forceUpdate();
    },
    blurTo(e) {
      let value = !Number(e.target.value.replace(/[^\.\d]/g, '')) ? Number(0) : Number(e.target.value.replace(/[^\.\d]/g, ''));
      let t1 = this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[0];
      let t2 = this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[1];
      if ((!Number(t1) && Number(t1) != 0) || Number(t1) >= Number(t2)) {
        this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[0] = Number(t2) - 1 >= 0 ? Number(Number(t2) - 1) : !!Number(t1) ? Number(t1) : Number(0);
        let newValue = null;
        newValue = !!Number(t1) ? Number(t1) + 1 : 1;
        this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[1] = value || newValue;
        if (Number(t1) > Number(t2) && !Number(t2)) {
          this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[1] = Number(t1) + 1;
        }
        if (Number(t1) > Number(t2) && !!Number(t1) && !!Number(t2)) {
          this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[0] = Number(t2) - 1;
        }
        this.$forceUpdate();
        this.conditionsList[this.andIndex].children[this.orIndex].columnValue = this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel.join(',');
        return;
      }
      this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[1] = value;
      this.conditionsList[this.andIndex].children[this.orIndex].columnValue = this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel.join(',');
      this.$forceUpdate();
    },
    // 输入框区间输入的时候
    toInputFrom(e) {
      let value = !Number(e.target.value.replace(/[^\d]/g, '')) ? '0' : Number(e.target.value.replace(/[^\d]/g, ''));
      // 判断输入
      let v1 = this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[0];
      let v2 = this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[1];
      if (!Number(v2)) {
        this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[1] = Number(v1) + 1;
      }
      if (Number(v1) >= Number(v2)) {
        this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[1] = Number(v1) + 1;
        this.$forceUpdate();
        return;
      }
      this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[0] = value;
      this.conditionsList[this.andIndex].children[this.orIndex].columnValue = this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel.join(',');
      this.$forceUpdate();
    },
    toInputTo(e) {
      let value = !Number(e.target.value.replace(/[^\d]/g, '')) ? '0' : Number(e.target.value.replace(/[^\d]/g, ''));
      let t1 = this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[0];
      let t2 = this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[1];
      if (!Number(t1)) {
        this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[0] = Number(t2) - 1 >= 0 ? Number(t2) - 1 : 0;
      }
      if (Number(t1) >= Number(t2)) {
        this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[1] = Number(t1) + 1;
        this.$forceUpdate();
        return;
      }
      this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel[1] = value;
      this.conditionsList[this.andIndex].children[this.orIndex].columnValue = this.conditionsList[this.andIndex].children[this.orIndex].children[2].levelModel.join(',');
      this.$forceUpdate();
    },
    // date 选择的时候
    changeDate(e, index, key, ind) {
      this.conditionsList[index].children[key].columnValue = String(e) == 'null' ? '' : String(e);
    },
    // 添加并且条件 flag: and, conditiontype: belong/baseinfo/meminfo/interact/consume
    andConditionClick(flag, item) {
      // 显示确认取消按钮
      this.$emit('editShow');
      // 判断是不是通过 url 请求数据 sourceFlag 是 url请求
      let dataOption = JSON.parse(item.widget.widgetParam);
      if (item.widget.sourceFlag == 1) {
        this.getOpenList(item, dataOption[0].value, flag);
        return;
      }
      this.conditionsList.push(this.judgeConditionType(item, JSON.parse(item.widget.widgetValues)));
    },
    // 添加或者条件 index: 第几个并条件;
    orConditionClick(index, flag, item) {
      // 显示确认取消按钮
      this.$emit('editShow');
      let dataOption = JSON.parse(item.widget.widgetParam);
      if (item.widget.sourceFlag == 1) {
        this.getOpenList(item, dataOption[0].value, flag, index);
        return;
      }
      this.conditionsList[index].children.push(this.judgeOrConditionType(item, JSON.parse(item.widget.widgetValues)));
    },
    // 点击下拉事件
    selectFocus(index, key, order) {
      this.andIndex = index;
      this.orIndex = key;
      this.componentIndex = order;
      const idCollection = this.conditionsList[index].children[key].children[order];
      // sy 回显数据
      this.axios.get(`${this.baseUrl}/api-plug/get-screening-widget-chain-detail?requestProject=gic-web&widgetChainId=${idCollection.esScreeningWidgetChainId}`).then(res => {
        const result = res.data.result; // 返回的结果 从第一层开始
        if (result.chainNodeName === '开卡信息' || result.widget.templateCode === 'com009') {
          return;
        }
        const retArr = JSON.parse(result.widget.widgetValues);
        const widgetParam = JSON.parse(result.widget.widgetParam);
        // 根据order来判断
        if (order == 0) {
          this.spliceCollection(this.conditionsList[index].children[key].children[order].levelOptions, retArr);
        } else if (order == 1) {
          // 各种模板太多了
          if (result.widget.templateCode == 'com002' || result.widget.templateCode == 'com001') {
            this.spliceCollection(this.conditionsList[index].children[key].children[order].levelOptions, retArr);
          } else if (result.widget.templateCode == 'com007') {
            this.getSecondFilterData(widgetParam[0].value, result.widgetFieldKey, { index: index, key: key, order: order }, result);
          }
        } else if (order == 2) {
          // 输入框
          if (result.widget.templateCode == 'com003') {
            return;
          }
          // 单选下拉
          if (result.widget.templateCode == 'com001') {
            this.spliceCollection(this.conditionsList[index].children[key].children[order].levelOptions, retArr);
          }
        }
      });
    },
    // sy 第二个组件的数据
    /**
     * @param url 请求的url
     * @param fieldKey 传过去的key
     * @param itemList 被观察的数据
     * @param result 要传递给第二层要的参数
     */
    getSecondFilterData(url, fieldKey, itemList, result) {
      const templateCode = result.widget.templateCode;
      if (templateCode == 'com007' || templateCode == 'com002') {
        const param = {
          requestProject: this.repProjectName,
          key: fieldKey
        };
        this.axios.post(`${this.baseUrl}${url}`, qs.stringify(param)).then(res => {
          // 下拉集合
          const retList = res.data.result;
          this.spliceCollection(this.conditionsList[itemList.index].children[itemList.key].children[itemList.order].levelOptions, retList);
        });
      } else if (templateCode == 'com001') {
        // 单选模板
        const param = {
          requestProject: this.repProjectName,
          parentChainId: result.parentChainId,
          widgetFieldKey: result.widgetFieldKey
        };
        // 单选获取接口
        this.axios.post(`${this.baseUrl}/api-plug/get-screening-chain-detail`, qs.stringify(param)).then(res => {});
      }
    },
    // sy 删除
    spliceCollection(oldC, retArr) {
      for (let i = 0; i < oldC.length; i++) {
        if (oldC[i]) {
          oldC.splice(i, 1);
          i--;
        }
      }
      for (let k = 0; k < retArr.length; k++) {
        oldC.push(retArr[k]);
      }
    },
    // 选择搜索后的列表
    changeRemote(e, index, key, ind) {
      this.conditionsList[index].children[key].columnValue = e.join(' '); //String(e)
    },
    // 搜索后出现下拉列表
    // 搜索
    remoteMethod(query) {
      let selectValue = this.conditionsList[this.andIndex].children[this.orIndex].children[this.componentIndex].levelModel;
      let selectLevelOptions = this.conditionsList[this.andIndex].children[this.orIndex].children[this.componentIndex].levelOptions;
      if (query !== '') {
        let newOptions = [];
        if (!!selectLevelOptions && !!selectLevelOptions.length) {
          selectLevelOptions.forEach(function(ele, index) {
            if (selectValue.indexOf(ele.key) != -1) {
              newOptions.push(ele);
            }
          });
        }
        this.conditionsList[this.andIndex].children[this.orIndex].children[this.componentIndex].levelOptions = newOptions;
        let url = this.conditionsList[this.andIndex].children[this.orIndex].children[this.componentIndex - 1].url;
        this.getCurrentData(url, query);
      }
    },
    // 获取门店列表
    getStoreList(query, threeLevelValue) {
      let para = {
        searchParam: query,
        selectedIds: threeLevelValue ? String(threeLevelValue) : '',
        flag: null,
        requestProject: this.repProjectName
      };

      this.axios
        .post(this.baseUrl + '/api-plug/query-store-by-code-name', qs.stringify(para))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            resData.result.forEach(function(ele, index) {
              ele.id = ele.storeId;
              ele.value = ele.storeName;
              ele.key = ele.storeId;
            });
            this.conditionsList[this.andIndex].children[this.orIndex].children[this.componentIndex].levelOptions = resData.result;
            return;
          }

          this.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(error => {
          this.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },
    // 搜索获取数据到当前组件中
    getCurrentData(url, name) {
      let para = {
        requestProject: this.repProjectName,
        name: name
      };
      this.axios
        .post(this.baseUrl + url, qs.stringify(para))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            resData.result.forEach((ele, index) => {
              this.conditionsList[this.andIndex].children[this.orIndex].children[this.componentIndex].levelOptions.unshift(ele);
            });
            let obj = {};
            let person = this.conditionsList[this.andIndex].children[this.orIndex].children[this.componentIndex].levelOptions;
            person = person.reduce((cur, next) => {
              obj[next.key] ? '' : (obj[next.key] = true && cur.push(next));
              return cur;
            }, []); //设置cur默认类型为数组，并且初始值为空的数组
            this.conditionsList[this.andIndex].children[this.orIndex].children[this.componentIndex].levelOptions = person;
            return;
          }
          this.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(error => {
          this.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },
    // 省市县选择
    selected(val) {
      if (val.country) {
        this.conditionsList[val.index].children[val.indexKey].columnValue = val.areaId;
      }
    },
    // 删除 cell 条件
    deleteCell(index, key) {
      this.conditionsList[index].children.splice(key, 1);

      // 重新 再渲染一次
      if (this.conditionsList[index].children.length == 0) {
        this.conditionsList.splice(index, 1);
      }
      //判断隐藏/显示按钮
      if (this.conditionsList.length === 0) {
        this.$emit('hideBtn', 0);
      }
    },
    // warning tips
    showWarn(msg, type) {
      this.$message({
        message: msg,
        type: type
      });
    },
    returnFlag(data) {
      let tag = true;
      data.forEach(function(ele, index) {
        ele.children.forEach(function(el, ind) {
          if (!el.columnValue) {
            el.children.forEach(item => {
              el.columnValue = item.uuid ? item.uuid : '';
            });
          }
        });
      });
      return tag;
    },
    // sy 点击编辑模板
    editTemp() {
      if (this.repId && !this.confirm) {
        this.getTempDetail();
      } else {
        this.conditionsList.map(v => {
          if (v.children instanceof Array) {
            v.children.map(w => {
              w.children[1].storeFlag = false;
              if (w.children[1] && w.children[1].uuid) {
                w.children[1].operateType = false;
              } else {
                w.children[1].operateType = true;
              }
              this.$nextTick(_ => {
                w.children[1].storeFlag = true;
              });
            });
          }
        });
        this.$nextTick(_ => {
          this.conditionDetailShow = false;
          this.conditionsShow = true;
          if (this.conditionsList.length) {
            this.$emit('editShow');
          } else {
            this.$emit('hideBtn');
          }
        });
      }
    },
    // 点击重置
    resetTemp() {
      this.conditionDetailShow = false;
      this.conditionsShow = true;
      // 清空数据
      // this.cancelSet()
      // 清空所有的条件值
      this.conditionsList = [];
      this.templateData = [];
      // 隐藏按钮
      this.$emit('hideBtn');
      // 传递查询数据空的
      this.$emit('findFilter', '');
      // 传递列表数据空的

      // 是否 是重置按钮触发
      if (this.triggerReset) {
        this.$emit('getBackData', 'remove');
      } else {
        this.$emit('getBackData', '');
      }
    },
    // sy 外层确认提交人群筛选器的信息
    confirmSet() {
      this.confirm = true;
      return new Promise((resolve, reject) => {
        (async () => {
          // 是否有空的
          let emptyFlag = this.conditionListHasEmpty();
          let storeNewFlag = await this.StoreHasEmpty();
          if (!emptyFlag) {
            this.$message.warning('请先完善筛选信息！');
            return false;
          }
          if (!storeNewFlag) {
            this.$message.warning('请先完善门店筛选信息！');
            return false;
          }
          let setData = JSON.parse(JSON.stringify(this.conditionsList));
          this.newCardList = JSON.parse(JSON.stringify(this.conditionsList));
          // 发送数据 拼接
          let sendData = {
            list: [],
            type: 'and'
          };
          if (!setData.length) {
            this.showWarn('请完善筛选条件', 'warning');
            return false;
          }
          if (!this.returnFlag(setData)) {
            this.showWarn('请完善筛选条件', 'warning');
            return false;
          }
          let birthFlag = true;
          setData.forEach(function(ele, index) {
            //外层 and
            let obj = {
              type: 'or',
              list: []
            };
            ele.children.forEach(function(el, ind) {
              let innerObj = {
                type: 'data',
                data: {}
              };
              innerObj.data.key = el.columnKey;
              innerObj.data.compute = el.computeCharacter;
              // 主要的门店的uuid
              if (el.dealKey === 'storeWidget') {
                innerObj.data.value = el.children && el.children[1] && el.children[1].uuid;
              } else {
                innerObj.data.value = el.columnValue;
              }
              if (el.dealKey) {
                innerObj.data.dealKey = el.dealKey;
              }
              // 生日
              if (el.columnKey == 'birthday' || el.columnKey == 'birthdayMD') {
                if (parseInt(el.columnValue.split(',')[0]) > parseInt(el.columnValue.split(',')[1])) {
                  birthFlag = false;
                }
              }
              // 去除 com005 中没有选择数据
              el.children.forEach((child, key) => {
                let emptyArr = [];
                if (child.templateCode == 'com005') {
                  if (child.levelOptions && child.levelOptions.length) {
                    child.levelOptions.forEach((obj, k) => {
                      if (child.levelModel.indexOf(obj.key) !== -1) {
                        emptyArr.push(obj);
                      }
                    });
                  }
                  child.levelOptions = emptyArr;
                }
              });
              obj.list.push(innerObj);
            });
            sendData.list.push(obj);
          });
          // 过滤之后的数据
          const filterData = this.filterPassValue(setData);
          // 保存过滤的json
          this.filterToEcho = JSON.parse(JSON.stringify(filterData));
          this.selectDataList = sendData;
          if (!birthFlag) {
            this.showWarn('生日不能跨年', 'warning');
            return false;
          }
          await this.getAbInfo(sendData, filterData);
          resolve();
        })();
      });
    },
    // 主动把之前选的条件保存起来
    saveSelectData() {
      this.$emit('update:searchBackTxt', this.selectDataList);
      this.$emit('update:conditionList', this.conditionsList);
    },
    // 计算选择多少项数据的
    calculateNum(selectData) {
      let len = 0;
      if (!!this.selectDataList.list.length) {
        this.selectDataList.list.forEach(function(ele, index) {
          if (!!ele.list.length) {
            len += ele.list.length;
          }
        });
      }
      return len;
    },
    // 获取缩略信息
    getAbInfo(sendData, setData) {
      return new Promise((resolve, reject) => {
        let para = {
          params: JSON.stringify(sendData),
          requestProject: this.repProjectName,
          sceneCode: this.repSceneCode
        };

        this.axios
          .post(this.baseUrl + '/api-plug/screening-show-back', qs.stringify(para))
          .then(res => {
            let resData = res.data;
            if (resData.errorCode == 0) {
              this.templateData = resData.result.replace(/或/g, ' 或 ').replace(/且/g, ' 且 ');
              this.templatetxt = resData.result;

              // 隐藏筛选条件
              this.conditionsShow = false;
              // 显示缩略信息
              this.conditionDetailShow = true;

              // 传递查询数据
              this.$emit('findFilter', JSON.stringify(sendData));
              // 传递列表数据
              if (JSON.stringify(setData)) {
                this.$emit('getBackData', JSON.stringify(setData));
              }
              // 按钮隐藏
              this.$emit('editHide');
              resolve();
            }
          })
          .catch(error => {
            this.$message.error({
              duration: 1000,
              message: error.message
            });
          });
      });
    },
    // 取消设置
    cancelSet() {
      // sy 老的替换新的uuid 解决编辑 取消但是不保存
      if (this.editList && this.editList.length) {
        this.conditionsList.forEach((ele, i) => {
          if (ele.children && ele.children.length) {
            ele.children.forEach((e, index) => {
              if (e.children[1] && this.editList[i].children[index] && this.editList[i].children[index].children.length) {
                e.children[1].uuid = this.editList[i].children[index].children[1].uuid;
              }
            });
          }
        });
      }

      this.OperateType = false;
      if (!!this.templateData && !!this.templateData.length) {
        this.conditionsShow = false;
        this.conditionDetailShow = true;
        this.$emit('editHide');
      } else {
        // 清空所有的条件值
        this.conditionsList = [];
        this.$emit('hideBtn');
      }
    },
    // 获取模板详细数据(回显)
    getTempDetail() {
      let para = {
        requestProject: this.repProjectName,
        id: this.repId
      };
      this.axios
        .post(this.baseUrl + '/api-plug/get-screening-detail', qs.stringify(para))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            if (resData.result && resData.result.detail) {
              const result = JSON.parse(resData.result.detail);
              // 保存之后的第一次掉回显 防止取消的时候没有传上次的回显数据
              this.filterToEcho = resData.result.detail;
              if (result && result.length) {
                result.forEach((ele, index) => {
                  ele.children.forEach((el, key) => {
                    if (el.esScreeningWidgetChainId == '8b0f770c72c24158bda1105b40d7336c') {
                      let maps = el.children[0] && el.children[0].levelOptions.map(item => item.key);
                      // addObjKey 所有关联门店门店
                      if (maps.indexOf(this.addObjKey.key) == -1) {
                        el.children[0].levelOptions.push(this.addObjKey);
                      }
                      // 判断是不是门店类型
                      if (el.dealKey === 'storeWidget') {
                        const param = {
                          requestProject: this.repProjectName,
                          parentChainId: el.esScreeningWidgetChainId,
                          widgetFieldKey: el.children[0].levelModel
                        };

                        this.axios.post(this.baseUrl + '/api-plug/get-screening-chain-detail', qs.stringify(param)).then(res => {
                          const storeRes = res.data.result.widget;
                          const newObj = {
                            esScreeningWidgetChainId: storeRes.esScreeningWidgetChainId,
                            property: storeRes.property,
                            levelModel: [],
                            templateCode: storeRes.templateCode,
                            levelOptions: [],
                            widgetInstruction: storeRes.widgetInstruction,
                            widgetName: storeRes.widgetName,
                            storeOption: el.children[1].storeOption,
                            uuid: el.children[1].uuid,
                            storeFlag: false,
                            operateType: true
                          };
                          el.children[1].levelOptions.push(newObj);
                        });
                      }
                    }
                  });
                });
                // this.storeFlag = true
                // sy 这里把过滤的数据 请求之后 返回回来 再赋值给conditionsList
                this.conditionsList = result;
                this.conditionsList.map(v => {
                  if (v.children instanceof Array) {
                    v.children.map(w => {
                      w.children[1].storeFlag = false;
                      if (w.children[1] && w.children[1].uuid) {
                        w.children[1].operateType = false;
                      } else {
                        w.children[1].operateType = true;
                      }
                      this.$nextTick(_ => {
                        w.children[1].storeFlag = true;
                      });
                    });
                  }
                });
                this.$nextTick(_ => {
                  this.conditionDetailShow = false;
                  this.conditionsShow = true;
                  if (!!this.conditionsList.length) {
                    this.$emit('editShow');
                  } else {
                    this.$emit('hideBtn');
                  }
                });
              }
            }
            return;
          }
          this.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(error => {
          // this.$message.error({
          //   duration: 1000,
          //   message: error.message
          // });
        });
    },
    // 判断并条件类型,添加数据
    judgeConditionType(item, levelOptions) {
      let addObj = {};
      let widgetName;
      if (item.property === 19 && item.widget.templateCode === 'com020') {
        widgetName = item.widget.widgetName;
      }

      addObj = {
        esScreeningWidgetChainId: item.esScreeningWidgetChainId,
        chainNodeName: item.chainNodeName,
        children: [
          {
            esScreeningWidgetChainId: item.esScreeningWidgetChainId,
            property: item.property,
            chainNodeName: item.chainNodeName,
            columnKey: '',
            computeCharacter: '',
            columnValue: '',
            children: [
              {
                esScreeningWidgetChainId: item.esScreeningWidgetChainId,
                property: item.property,
                levelModel: '',
                templateCode: item.widget.templateCode,
                widgetName: widgetName,
                levelOptions: levelOptions
              }
            ]
          }
        ]
      };
      return addObj;
    },
    // 获取开卡信息字段 flag 是并且条件 and or
    getOpenList(item, url, flag, index) {
      let para = {
        requestProject: this.repProjectName
      };
      this.axios
        .post(this.baseUrl + url, qs.stringify(para))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            resData.result.forEach(function(ele, index) {
              ele.value = ele.name;
              ele.key = ele.id;
            });
            if (flag == 'or') {
              this.conditionsList[index].children.push(this.judgeOrConditionType(item, resData.result));
              return;
            }
            this.conditionsList.push(this.judgeConditionType(item, resData.result));
            return;
          }
          this.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(error => {
          this.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },
    // 判断或者条件类型,添加数据
    judgeOrConditionType(item, levelOptions) {
      let addObj = {};
      let widgetName;
      if (item.widget.widgetName.indexOf('门店') > -1) {
        widgetName = item.widget.widgetName;
      }
      addObj = {
        esScreeningWidgetChainId: item.esScreeningWidgetChainId,
        property: item.property,
        chainNodeName: item.chainNodeName,
        columnKey: '',
        computeCharacter: '',
        columnValue: '',
        children: [
          {
            esScreeningWidgetChainId: item.esScreeningWidgetChainId,
            levelModel: '',
            templateCode: item.widget.templateCode,
            widgetName: widgetName,
            levelOptions: levelOptions
          }
        ]
      };
      return addObj;
    },
    async StoreHasEmpty() {
      let storeNewFlag = true;
      const storeList = this.$refs.storeNew;
      if (storeList && storeList.length) {
        for (let v of storeList) {
          storeNewFlag = await v.isStoreSave();
          if (!storeNewFlag) {
            return storeNewFlag;
          }
        }
      }
      return storeNewFlag;
    },
    conditionListHasEmpty() {
      const List = this.conditionsList;
      for (let i = 0; i < List.length; i++) {
        for (let j = 0; j < List[i].children.length; j++) {
          for (let k = 0; k < List[i].children[j].children.length; k++) {
            let list = List[i].children[j].children[k];
            // 如果不是 200就判断levelmodel
            if (list.templateCode != 'com020') {
              // 如果是数组判断长度
              if (Array.isArray(list.levelModel) && !list.levelModel.length) {
                return false;
              } else if (list.levelModel == '') {
                return false;
              }
            }
          }
        }
      }
      return true;
    }
  },
  watch: {
    flag: {
      immediate: true,
      handler(newval) {
        this.flagStore = newval;
      }
    },
    isAdd: {
      immediate: true,
      handler(newval) {
        this.OperateType = newval;
      }
    },
    conditionList: {
      immediate: true,
      handler(newval) {
        if (newval && newval.length) {
          this.conditionsList = newval;
        }
      }
    },
    useId(newval) {
      this.repId = newval;
    },
    projectName(newData, oldData) {
      this.repProjectName = newData || 'gic-web';
    },
    sceneValue(newData, oldData) {
      this.repSceneCode = newData || 'member';
    },
    // sy 回显的数据 当接口返回的时候 newData就是一开始保存选中的数据
    hasSearchData(newData, oldData) {
      if (!!newData) {
        this.responseData = JSON.parse(newData);
        this.getAbInfo(this.responseData);
        // 显示缩略 隐藏保存按钮
        this.$emit('editHide');
      }
    },
    tempData(newData, oldData) {
      this.tempDataTemp = newData;
    }
  },
  mounted() {
    this.getDataList();
    // 项目名
    this.repProjectName = this.projectName || 'gic-web';
    this.repSceneCode = this.sceneValue || 'member'; // 获取场景值
    // 默认隐藏保存按钮,确认按钮
    this.$emit('hideBtn');
    this.repId = this.useId;
    // 数据回显
    if (!!this.repId) {
      this.getTempDetail();
    }
    if (!!this.hasSearchData) {
      this.responseData = JSON.parse(this.hasSearchData);
      this.getAbInfo(this.responseData);
      // 显示缩略 显示保存按钮
      this.$emit('editHide');
    }
    // 临时数据显示
    if (!!this.tempData) {
      this.tempDataTem = this.tempData;
    }
  },
  components: {
    tags,
    FilterTxt,
    GicSelect,
    'dm-store-new': dmStoreNew
  }
};
</script>

<style src="./index.scss" lang="scss" scoped></style>

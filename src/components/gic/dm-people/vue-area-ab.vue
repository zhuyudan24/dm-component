<template>
  <div class="pay-box">
    <!-- -->
    <div class="pay-wrapper">
      <div class="pay-container">
        <!-- <el-cascader
        :options="options"
        v-model="selectedOptions"
        @change="handleChange">
      </el-cascader> -->
        <div class="area-wrap">
          <el-select class="w-160" no-data-text=" " v-model="ruleForm.provience" placeholder="请选择省份" @focus="getPro" @change="selectPro">
            <el-option v-for="item in optionsPro" :key="item.provinceId" :label="item.provinceName" :value="item.provinceId"> </el-option>
          </el-select>
          <el-select class="w-160" no-data-text=" " v-model="ruleForm.city" placeholder="请选择城市" @focus="getCity" @change="selectCity">
            <el-option v-for="item in optionsCity" :key="item.cityId" :label="item.cityName" :value="item.cityId"> </el-option>
          </el-select>
          <el-select class="w-160" no-data-text=" " v-model="ruleForm.country" placeholder="请选择区县" @focus="getCountry" @change="selectCountry">
            <el-option v-for="item in optionsRegion" :key="item.countyId" :label="item.countyName" :value="item.countyId"> </el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { getRequest } from './api';
import { log } from '@/utils/index.js';
import qs from 'qs';
export default {
  name: 'vue-area-ab',
  props: ['areaOptions', 'projectName', 'index', 'indexKey', 'ind'],
  data() {
    return {
      repProjectName: 'gic-web', // 项目名
      // 省市区
      ruleForm: {
        provience: '',
        provinceName: '',
        city: '',
        cityName: '',
        countryName: '',
        country: '',
        areaId: '' // 选择的区 id
      },

      // 省
      optionsPro: [],
      // 市
      optionsCity: [],

      // 区/县
      optionsRegion: [],

      provinceId: '',
      cityId: '',
      countyId: '',

      // 区域
      typeId: 1, // 1:省 2:市 3:区(县)
      getProId: '', // 选择的省 id
      getCityId: '', // 选择的城市 id

      // 登录信息
      loginInnfo: {
        loginName: 'damogic',
        password: 1
      },

      // 获取 location origin
      baseUrl: ''
    };
  },
  beforeMount() {
    var that = this;
    var host = window.location.origin;
    if (host.indexOf('localhost') != '-1') {
      that.baseUrl = 'http://gicdev.demogic.com';
    } else {
      that.baseUrl = host;
    }
  },
  methods: {
    handleChange(value) {
      //选择完毕后将值传递给父组件
      this.$emit('selected', value);
    },

    // 点击省
    getPro: function() {
      var that = this;
      if (that.optionsPro.length) {
        return;
      }
      that.typeId = 1;
      // that.getAreaId = 0 // 选择的省份id
      // that.areaFlag = true;

      that.getArea(0);
    },

    // 点击市
    getCity: function(e) {
      var that = this;
      that.typeId = 2;
      if (!that.getProId) {
        that.$message.error({
          duration: 1000,
          message: '请先选择省'
        });
        return;
      }

      that.getArea(that.getProId);
    },

    // 点击县区
    getCountry: function() {
      var that = this;
      that.typeId = 3;
      if (that.getCityId == '') {
        // showMsg.showmsg('请先选择省市','warning')
        that.$message.error({
          duration: 1000,
          message: '请先选择省市'
        });
        return;
      }
      log('that.getCityId前:', that.getCityId);

      that.getArea(that.getCityId);
    },

    // 选择省
    selectPro: function(e) {
      var that = this;
      log(e);
      log(that.ruleForm.provience);
      that.getProId = e;
      that.getCityId = '';
      // that.getArea()
      that.ruleForm.city = '';
      that.ruleForm.country = '';
      // 打印
      log(that.optionsPro);
      that.optionsPro.forEach(function(item, index) {
        if (e == item.provinceId) {
          that.ruleForm.provinceName = item.provinceName;
        }
      });
      // log("省名字:",that.ruleForm.provinceName)
      that.$emit('selected', that.ruleForm);
    },

    // 选择市
    selectCity: function(e) {
      var that = this;
      log(e);
      that.getCityId = e;
      that.ruleForm.country = '';
      log(that.optionsCity);
      that.optionsCity.forEach(function(item, index) {
        if (e == item.cityId) {
          that.ruleForm.cityName = item.cityName;
        }
      });
      // log(that.ruleForm.cityName)
      that.$emit('selected', that.ruleForm);
    },

    // 选择县区
    selectCountry: function(e) {
      var that = this;
      log(e);
      that.areaId = e;
      that.ruleForm.areaId = e;
      log(that.optionsRegion);
      that.optionsRegion.forEach(function(item, index) {
        if (e == item.countyId) {
          that.ruleForm.countryName = item.countyName;
        }
      });
      that.ruleForm.index = that.index;
      that.ruleForm.indexKey = that.indexKey;
      that.ruleForm.ind = that.ind;

      log(that.ruleForm);

      that.$emit('selected', that.ruleForm);
    },

    // 获取区域
    getArea: function(areaId) {
      var that = this;
      log(areaId);
      var para = {
        requestProject: that.repProjectName
      };

      if (areaId == 0) {
        para.type = that.typeId;
      }
      if (areaId != 0) {
        para.type = that.typeId;
        para.id = areaId;
      }

      that.optionsCity = [];
      that.optionsRegion = [];

      that.axios
        .post(that.baseUrl + '/api-admin/dict-district-list', qs.stringify(para))
        .then(res => {
          log(res, res.data, res.data.errorCode);
          var resList = '';
          resList = res.data;
          if (resList.errorCode == 0) {
            // 如果是省
            if (that.typeId == 1) {
              that.optionsPro = [];
              for (var i in resList.result) {
                if (i == '710000' || i == '810000' || i == '820000') {
                  return;
                }
                that.optionsPro.push(resList.result[i]);
              }
              log('省:', that.optionsPro);
            }

            // 如果是市
            if (that.typeId == 2) {
              for (var i in resList.result) {
                delete resList.result[i].provinceId;
                that.optionsCity.push(resList.result[i]);
              }
              log('市:', that.optionsCity);
            }

            // 如果是区
            if (that.typeId == 3) {
              for (var i in resList.result) {
                delete resList.result[i].provinceId;
                delete resList.result[i].cityId;
                that.optionsRegion.push(resList.result[i]);
              }
              log('区:', that.optionsRegion);
            }

            return false;
          }

          // 如果出错
          // errMsg.errorMsg(res.data.response)
          // 去登陆
          // that.toLogin();
          that.$message.error({
            duration: 1000,
            message: res.data.errorMessage
          });
        })
        .catch(function(error) {
          log(error);

          // if (error.success == false) {
          // that.getArea();
          // 如果出错需要登录
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: res.data.errorMessage
          });
          // }
        });
    },

    toLogin() {
      var that = this;
      that.axios
        .post(that.baseUrl + '/api-auth/doLogin', qs.stringify(that.loginInnfo))
        .then(res => {
          log(res);
          var resLogin = res.data;
          if (resLogin.errorCode == 0) {
            that.getArea();
          }
        })
        .catch(function(error) {
          log(error);
          that.$message.error({
            duration: 1000,
            message: error.errorMessage
          });
        });
    },
    setNewData(optionData) {
      var that = this;
      that.ruleForm.provience = optionData.provinceName;
      that.ruleForm.city = optionData.cityName;
      that.ruleForm.country = optionData.countryName;

      that.ruleForm.provinceName = optionData.provinceName;
      that.ruleForm.cityName = optionData.cityName;
      that.ruleForm.countryName = optionData.countryName;

      that.ruleForm.areaId = optionData.countyId;
      that.getProId = optionData.provinceId;
      that.getCityId = optionData.cityId;
      log('that.ruleForm:', that.ruleForm);
    }
  },
  watch: {
    areaOptions: function(newData, oldData) {
      var that = this;
      log('areaOptions:', newData, oldData);
      that.setNewData(newData);
    },
    projectName: function(newData, oldData) {
      var that = this;
      // log("新数据:",newData,oldData)
      that.repProjectName = newData || 'gic-web';
    }
  },

  /* 接收数据 */
  mounted() {
    log('传递的参数对象:', this.areaOptions, this.index, this.indexKey, this.ind);
    var that = this;
    // 项目名
    that.repProjectName = that.projectName || 'gic-web';

    that.setNewData(that.areaOptions);
  }
};
</script>

<style>
.gray-wrapper {
  position: relative;
}

.pay-wrapper {
  position: relative;
  bottom: 0px;
  height: 40px;
}

.w-160 {
  width: 160px;
}

.w-160 + .w-160 {
  margin-left: 3px;
}
</style>

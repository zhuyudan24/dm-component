<template>
  <div class="navheader">
    <!-- logo -->
    <div class="navheader-logo fl" :class="isCollapse ? 'moveleft' : 'moveright'"></div>
    <div class="navheader-item fl">
      <a class="itemlink" @click="handleCollapse"> <i class="iconfont" :class="isCollapse ? 'icon-zhankai' : 'icon-shouqi'"></i></a>
      <a :class="['itemlink', 'bottom', 'menu-all', summaryName == '/memberSummary' ? 'current-module' : '']" :href="origin + '/report/#/memberSummary'">总览</a>
      <!-- gic 商户后台 -->
      <div :class="['itemlink-gic', 'bottom', pathName == 'gic-web' ? 'current-module' : '']" @mouseover="showChild" @mouseout="hideChild">
        GIC商户后台
        <i class="el-icon-arrow-down arrow-icon-down"></i>
        <div class="itempanel" id="itempanel" :style="{ display: showItem }">
          <div class="gicnavlink">
            <div class="containers">
              <div class="containers-item" v-for="(routerItem, index) in menuHeadRouter" :key="index">
                <ul class="containers-ul">
                  <h1 class="containers-title">{{ routerItem.menuName }}</h1>
                  <template v-for="(childItem, key) in routerItem.children">
                    <li :key="key" :class="['containers-listlik', activeCode == childItem.menuCode ? 'current-rout' : '']" @click="toRouter(childItem.menuUrl, childItem.menuName, childItem.menuCode)" v-if="childItem.isRouter">{{ childItem.menuName }}</li>
                    <a :key="key" class="containers-listlik containers-listlik-a" :href="childItem.menuUrl" v-if="!childItem.isRouter" :target="childItem.target == 1 ? '_blank' : ''">{{ childItem.menuName }}</a>
                  </template>
                </ul>
              </div>
            </div>
          </div>
          <div class="gicnavarrow">
            <span class="arrow"></span>
          </div>
        </div>
      </div>

      <!-- <a :class="['itemlink', 'bottom','menu-mall',pathName=='mall'? 'current-module':'']" :href="origin+'/mall/#/goodsList'">微信商城</a>
    <a :class="['itemlink', 'bottom','cloud-platform']" :href="origin">观云台</a> -->
      <template v-for="(menuitem, index) in menuHead">
        <a :key="index" :class="['itemlink', 'bottom', 'menu-mall', pathName == menuitem.project ? 'current-module' : '']" :href="origin + menuitem.menuUrl" :target="menuitem.target == 1 ? '_blank' : ''">{{ menuitem.menuName }}</a>
      </template>
      <!-- 最右侧用户信息 -->
      <div class="navuserinfo fr">
        <el-popover placement="bottom" title="" width="95" trigger="hover" popper-class="user-header-pop" style="min-width: 95px;">
          <ul class="navsuerwrap">
            <li class="useritem" @click="toUserInfo"><a class="usertext">账户信息</a></li>
            <li class="useritem" @click="toModifyInfo"><a class="usertext">修改密码</a></li>
            <li class="useritem loginout" @click="toLoginOut"><a class="usertext">退出登录</a></li>
            <!-- href="javascript:void(0)" -->
          </ul>
          <a class="navusername" slot="reference"
            >{{ userInfo.realName }}
            <i class="el-icon-arrow-down arrowico"></i>
          </a>
        </el-popover>
      </div>
      <!-- 状态 集团不需要 -->
      <div class="navheader__status fr" v-if="(accountStatus === 2 || accountStatus === 3) && projectName !== 'gic-clique'">
        <el-tooltip effect="dark" placement="bottom-start" popper-class="navheader__status--tooltip">
          <div slot="content" class="w200">
            {{ accountStatus === 2 ? '当前账户已欠费，授信欠费额度5000，如不及时充值将无法使用营销管理-短信营销、营销管理-智能营销、双向呼叫、短信语音验证码等模块，为了保障您的权益，请尽快充值。' : '账户余额超出欠费额度，当前无法使用营销管理-短信营销、营销管理-智能营销、双向呼叫、短信语音验证码等模块，为了保障您的权益，请尽快充值。' }}
          </div>
          <el-button size="medium" :type="accountStatus === 2 ? 'warning' : 'danger'" plain round @click="toRecharge">{{ accountStatus === 2 ? '账户已欠费' : '账户异常' }}</el-button>
        </el-tooltip>
      </div>
      <!-- 模式 集团不需要 -->
      <div class="data-type-wrap fr" v-if="projectName !== 'gic-clique'">
        <span class="safe-type" @click="changeDataType('0')">
          <span class="el-radio__input" :class="dataType == '0' ? 'is-checked' : ''"> <span class="el-radio__inner"></span> </span><span class="el-radio__label">安全模式</span>
        </span>
        <span class="danger-type" @click="changeDataType('1')">
          <!-- :class="[{ 'is-disabled': !deveStatusBool }, dataType == '1' ? 'is-checked' : '']" -->
          <span class="el-radio__input" :class="dataType == '1' ? 'is-checked' : ''"> <span class="el-radio__inner"></span> </span
          ><span class="el-radio__label"
            >风险模式<span v-show="total > 0" style="margin-left:4px">{{ timeValue }}</span></span
          >
        </span>
      </div>
    </div>
    <!-- 申请模式弹框 -->
    <dataType ref="dataTypeWrap" :dataType="dataType" @sendDataType="getDataType"></dataType>

    <!-- 修改用户信息 -->
    <el-dialog title="账户信息" class="user-form-dialog" :visible="userFormVisible" width="425px" :modal-append-to-body="false" :before-close="userFormClose">
      <el-form :model="userInfoForm" :before-close="userFormClose" :rules="userFormRules" ref="userForm">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="realName">
          <el-input v-model="userInfoForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="gender">
          <el-radio-group v-model="userInfoForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="员工代码" :label-width="formLabelWidth" prop="clerkCode">
          <el-input v-model="userInfoForm.clerkCode"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phoneNumber">
          <el-input v-model="userInfoForm.phoneNumber" type="text" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="职位" :label-width="formLabelWidth" prop="positionName">
          <el-input v-model="userInfoForm.positionName"></el-input>
        </el-form-item>
        <!-- <el-form-item class="dialog-footer">
        <el-button @click="cancelModUserInfo">取 消</el-button>
        <el-button type="primary" @click="confirmModUserInfo('userForm')">确 定</el-button>
      </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelModUserInfo">取 消</el-button>
        <el-button type="primary" @click="confirmModUserInfo('userForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改密码 -->
    <el-dialog title="修改密码" class="pass-form-dialog" :visible="passFormVisible" width="425px" :modal-append-to-body="false" :before-close="passFormClose">
      <el-form :model="passwordForm" :before-close="passFormClose" :rules="passFormRules" ref="passForm">
        <el-form-item label="旧密码" :label-width="formLabelWidth" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
          <el-input v-model="passwordForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmNewPassword">
          <el-input v-model="passwordForm.confirmNewPassword"></el-input>
        </el-form-item>
        <!-- <el-form-item class="dialog-footer">
        <el-button @click="cancelModPass">取 消</el-button>
        <el-button type="primary" @click="confirmModPass('passForm')">确 定</el-button>
      </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelModPass">取 消</el-button>
        <el-button type="primary" @click="confirmModPass('passForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- <a v-if="udesk.showFd" class="udesk-link" target="_blank" :href="udesk.href"><img :src="udesk.src" /><span>反馈建议</span></a> -->
  </div>
</template>

<script>
import { baseUrl } from '@/config/index.js';
import qs from 'qs';
import dataType from './dataType';
import { udesk } from './udesk/index.js';
import udeskSrc from '../../../assets/img/feedback.png';
export default {
  name: 'vue-gic-header',
  props: ['menuRouter', 'collapseFlag', 'projectName', 'hideUdesk'],
  data() {
    return {
      repProjectName: 'gic-web', // 项目名
      activeCode: '',
      // pathname
      pathName: '',

      showItem: 'none', // 显示 itempanel
      summaryName: '', // 当前路由

      // origin
      origin: '',
      // 集团标志
      cliqueFlag: '',
      isCollapse: false, // 是否收起左侧
      menuHeadRouter: [],
      menuHead: [], // 返回的菜单

      // udesk需要的信息
      udesk: {
        showFd: false,
        src: udeskSrc,
        href: 'javascript:;'
      },

      userInfo: {
        realName: '',
        gender: '', // 1男2女
        clerkCode: '',
        phoneNumber: '',
        positionName: ''
      },

      // 用户信息 form
      userFormVisible: false,
      formLabelWidth: '100px',
      userInfoForm: {
        realName: '',
        gender: '', // 1男2女
        clerkCode: '',
        phoneNumber: '',
        positionName: ''
      },
      userFormRules: {
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        clerkCode: [{ required: true, message: '请输入员工代码', trigger: 'blur' }],
        phoneNumber: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { pattern: /^1[34578]\d{9}$/, message: '手机号码格式不正确' }],
        positionName: [{ required: true, message: '请输入职位', trigger: 'blur' }]
      },

      // 用户密码 form
      passFormVisible: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      passFormRules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmNewPassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }]
      },

      routePathName: '', // 当前路由值
      accountStatus: 1, // 账户状态

      // 模式  安全 or 风险
      dataType: '0',
      timeValue: '',
      total: 0,
      deveStatusBool: true // 开发模式下风险模式可用，生产不可用
    };
  },
  methods: {
    // 获取当前二级 code
    getLeftMenu() {
      let params = {
        project: this.repProjectName,
        path: this.routePathName,
        requestProject: this.repProjectName
      };
      this.axios
        .post(baseUrl + '/api-auth/get-current-memu-data', qs.stringify(params))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            this.activeCode = resData.result && resData.result.level2.menuCode;
            return;
          }
          this.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(err => {
          // console.log(err);
        });
    },

    // 显示菜单
    showChild() {
      this.showItem = 'block';
    },
    // 隐藏菜单
    hideChild() {
      this.showItem = 'none';
    },

    // 设置新数据
    setNewData(dataObj) {
      // 处理成需要的路由
      let list = [];
      let lists = [];
      // 把父级和子级分离
      dataObj.forEach(ele => {
        ele.parentCode ? lists.push(ele) : list.push(ele);
      });
      // 把子级添加到父级中
      list.forEach(ele => {
        ele.children = [];
        lists.forEach(el => {
          if (el.parentCode == ele.menuCode) {
            ele.children.push(el);
          }
        });
      });
      this.menuHeadRouter = list;
    },

    // 处理折叠
    handleCollapse() {
      this.isCollapse = !this.isCollapse;
      this.$emit('collapseTag', this.isCollapse);
    },

    // 修改账户信息,弹窗显示
    toUserInfo() {
      let userInfo = JSON.parse(JSON.stringify(this.userInfo));
      this.userInfoForm.realName = userInfo.realName;
      this.userInfoForm.gender = parseInt(userInfo.gender);
      this.userInfoForm.clerkCode = userInfo.clerkCode;
      this.userInfoForm.phoneNumber = userInfo.phoneNumber;
      this.userInfoForm.positionName = userInfo.positionName;
      this.userFormVisible = true;
    },

    // 点击确定 修改用户信息
    modifyUserInfo() {
      let params = {
        realName: this.userInfoForm.realName,
        gender: this.userInfoForm.gender,
        clerkCode: this.userInfoForm.clerkCode,
        phoneNumber: this.userInfoForm.phoneNumber,
        positionName: this.userInfoForm.positionName,
        requestProject: this.repProjectName
      };
      this.axios
        .post(baseUrl + '/api-auth/modify-user-info', qs.stringify(params))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            this.userFormVisible = false;
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          } else {
            this.$message.error({
              duration: 1000,
              message: resData.message
            });
          }
        })
        .catch(error => {
          this.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // 确认修改
    confirmModUserInfo(userForm) {
      this.$refs[userForm].validate(valid => {
        if (valid) {
          this.modifyUserInfo();
        }
      });
    },
    // 取消修改
    cancelModUserInfo() {
      this.userFormVisible = false;
    },
    //修改密码
    toModifyInfo() {
      this.passFormVisible = true;
      this.passwordForm.newPassword = '';
      this.passwordForm.oldPassword = '';
      this.passwordForm.confirmNewPassword = '';
    },
    // 修改密码方法
    modifyUserPassword() {
      let params = {
        oldPassword: this.passwordForm.oldPassword,
        newPassword: this.passwordForm.newPassword,
        requestProject: this.repProjectName
      };

      if (!this.passwordForm.oldPassword.trim() || !this.passwordForm.newPassword.trim() || !this.passwordForm.confirmNewPassword.trim()) {
        this.$message.error({
          duration: 1000,
          message: '请输入密码'
        });
        return false;
      }

      if (this.passwordForm.newPassword.trim() != this.passwordForm.confirmNewPassword.trim()) {
        this.$message.error({
          duration: 1000,
          message: '两次密码输入不一致!'
        });
        return false;
      }

      this.axios
        .post(baseUrl + '/api-auth/modify-password', qs.stringify(params))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            this.passFormVisible = false;
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.postLoginOut();
          } else {
            this.$message.error({
              duration: 1000,
              message: resData.message
            });
          }
        })
        .catch(error => {
          this.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // 确认
    confirmModPass(passForm) {
      this.$refs[passForm].validate(valid => {
        if (valid) {
          this.modifyUserPassword();
        }
      });
    },
    // 取消
    cancelModPass() {
      this.passFormVisible = false;
    },

    // 关闭
    userFormClose() {
      this.userFormVisible = false;
    },
    passFormClose() {
      this.passFormVisible = false;
    },

    //退出登录
    toLoginOut() {
      this.$confirm('确认退出吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.postLoginOut();
        })
        .catch(err => {
          this.$message.error({
            duration: 1000,
            message: err.message
          });
        });
    },
    // 退出请求
    postLoginOut() {
      this.axios
        .post(baseUrl + '/api-auth/do-logout', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            this.$message({
              message: '退出成功',
              type: 'success'
            });
            // 跳转登录页,商户.集团判断.// 暂时不判断登录入口,20180629
            // if (this.cliqueFlag == true) {
            window.location.href = window.location.origin + '/gic-web/#/';
            // }
            // if (this.cliqueFlag == false) {
            //    window.location.href = window.location.origin + '/gic-clique';
            // }
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

    // 判断当前商户是否是集团关联商户
    isClique() {
      let params = {
        requestProject: this.repProjectName
      };
      this.axios
        .post(baseUrl + '/api-auth/is-relevance-clique', qs.stringify(params))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            this.cliqueFlag = resData.result;
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

    // 触发父组件路由
    toRouter(path, name, code) {
      this.showItem = 'none'; // 隐藏菜单
      this.activeCode = code; //高亮显示
      let obj = {
        path: '/' + path,
        name: name
      };
      this.$emit('toRouterView', obj);
    },

    //获取用户信息
    getUserInfo() {
      let params = {
        requestProject: this.repProjectName
      };

      this.axios
        .post(baseUrl + '/api-auth/get-login-user-info', qs.stringify(params))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            this.userInfo.realName = resData.result.realName;
            this.userInfo.gender = resData.result.clerkGender;
            this.userInfo.clerkCode = resData.result.clerkCode;
            this.userInfo.phoneNumber = resData.result.loginName; // 目前手机号是 loginName
            this.userInfo.positionName = resData.result.positionName;
            document.title = resData.result.enterpriseDTO.brandName || resData.result.enterpriseDTO.enterpriseName;
            if (this.hideUdesk !== true) {
              this.udesk.href = udesk(resData); // 反馈信息href加入用户信息
              this.udesk.showFd = !this.hideUdesk; // href加入用户信息后显示
            }
            return;
          }
          this.$message.error({
            duration: 1000,
            message: resData.message
          });
        })
        .catch(function(error) {
          this.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // 获取菜单
    getHeaderMenu() {
      let params = {
        project: this.repProjectName,
        requestProject: this.repProjectName
      };

      this.axios
        .post(baseUrl + '/api-auth/login-clerk-menu', qs.stringify(params))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            this.menuHeadRouter = resData.result;
            // 获取左侧菜单
            this.getLeftMenu();
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

    // 获取头部一行菜单
    getMenu() {
      let params = {
        requestProject: this.repProjectName
      };

      this.axios
        .post(baseUrl + '/api-auth/login-clerk-top-project', qs.stringify(params))
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 0) {
            this.menuHead = resData.result;
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
    // 获取账户状态 是否欠费
    getAccountStateInfo() {
      this.axios.post(baseUrl + '/api-marketing/account-state-info', qs.stringify({ requestProject: 'gic-web' })).then(res => {
        if (res.data.errorCode === 0) {
          this.accountStatus = res.data.result.status || 1;
          // 状态存到localStorage中取
          localStorage.setItem('accountStatus', this.accountStatus);
        }
      });
    },
    toRecharge() {
      window.location.href = '/marketing/#/recharge/do';
    },

    // 刚进页面时判断是什么模式
    initDataType() {
      let that = this;
      that.axios
        .post(
          baseUrl + '/api-admin/time-risk-mode',
          qs.stringify({
            requestProject: that.repProjectName
          })
        )
        .then(res => {
          let data = res.data;
          if (data.errorCode == 0) {
            that.dataType = data.result ? '1' : '0';
            if (data.result) {
              that.total = data.result;
              let timer = window.setInterval(() => {
                that.total--;
                let h = Math.floor(that.total / 3600) < 10 ? '0' + Math.floor(that.total / 3600) : Math.floor(that.total / 3600);
                let d = h > 23 ? parseInt(h % 24) : 0;
                let m = Math.floor((that.total / 60) % 60) < 10 ? '0' + Math.floor((that.total / 60) % 60) : Math.floor((that.total / 60) % 60);
                let s = Math.floor(that.total % 60) < 10 ? '0' + Math.floor(that.total % 60) : Math.floor(that.total % 60);
                if (d > 0) {
                  h = h > 23 ? h % 24 : h;
                  that.timeValue = '剩余' + d + '天' + h + '小时' + m + '分' + s + '秒';
                } else {
                  that.timeValue = h < 1 ? '剩余' + m + '分' + s + '秒' : '剩余' + h + '小时' + m + '分' + s + '秒';
                }
                if (that.total <= 0) {
                  window.clearInterval(timer);
                  let html = '<p style="font-size:14px;color:#606266;">风险模式已到时</p>';
                  that
                    .$confirm(html, '提示', {
                      confirmButtonText: '刷新页面',
                      cancelButtonText: '取消',
                      showCancelButton: false,
                      closeOnClickModal: false,
                      showClose: false,
                      dangerouslyUseHTMLString: true,
                      type: 'warning'
                    })
                    .then(() => {
                      location.reload(); // 强制刷新页面
                    })
                    .catch(() => {});
                }
              }, 1000);
            }
          } else {
            that.$message.error(data.message);
          }
        });
    },
    // 切换数据模式
    changeDataType(type) {
      if (this.deveStatusBool) {
        // 不是生产环境
        this.dataType = type;
        this.$nextTick(_ => {
          if (this.dataType == '1') {
            this.$refs.dataTypeWrap.init();
          }
        });
      }
    },
    // 获取子组件的数据模式
    getDataType(val) {
      this.dataType = val;
    },
    // 判断环境  开发还是生产
    getDeveStatus() {
      let host = window.location.host;
      if (host == 'hope.demogic.com') {
        this.deveStatusBool = false;
      } else {
        this.deveStatusBool = true;
      }
    }
  },
  watch: {
    $route: {
      handler(val, oldVal) {
        this.summaryName = val.path;
        // 总览时,其他菜单选中状态去掉
        if (this.summaryName.indexOf('memberSummary') != '-1') {
          this.activeCode = '';
        }
      },
      // 深度观察监听
      deep: true
    },
    collapseFlag(newData, oldData) {
      this.isCollapse = newData;
    },
    userInfo(newData, oldData) {
      this.userInfo = newData;
    },
    projectName(newData, oldData) {
      this.repProjectName = newData || 'gic-web';
    }
  },

  /* 接收数据 */
  mounted() {
    this.summaryName = this.$route.path;
    // 获取模块code
    // this.activeCode = sessionStorage.getItem('activeHead')
    //获取项目名 pathname (路由的hash)
    this.routePathName = window.location.hash.split('/')[1];
    if (this.routePathName.indexOf('?') != -1) {
      this.routePathName = this.routePathName.split('?')[0];
    }
    if (this.routePathName.indexOf('/') != -1) {
      this.routePathName = this.routePathName.split('/')[0];
    }
    // 项目名
    this.repProjectName = this.projectName || 'gic-web';

    // 判断项目参数
    this.pathName = this.repProjectName;
    this.isCollapse = this.collapseFlag;
    // 获取用户信息
    this.getUserInfo();

    // 获取菜单
    this.getHeaderMenu();
    // 判断集团
    // this.isClique();

    // this.setNewData(this.menuRouter)

    this.origin = window.location.origin;
    //获取项目名 pathname
    // this.pathName = window.location.pathname;
    // 获取头部菜单
    this.getMenu();
    this.getAccountStateInfo();

    // 获取初始数据模式
    this.initDataType();
    // 判断环境  开发or生产
    // this.getDeveStatus();
  },
  components: {
    dataType
  }
};
</script>

<style lang="scss" scoped>
.navheader {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  line-height: 64px;
  font-size: 14px;
  background-color: #fff;
  padding: 0;
  z-index: 99;
  color: #fff;

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  &-logo {
    flex: 0 0 200px;
    width: 200px;
    height: 64px;
    float: left;
    text-align: center;
    background: url('./logo1.png') no-repeat center center #04143a;
  }

  &-pic {
    vertical-align: middle;
  }

  &-item {
    flex: 1;
    box-shadow: 5px -1px 10px #ddd;
  }
  .itemlink {
    float: left;
    padding: 0 20px;
    display: inline-block;
    height: 62px;
    cursor: pointer;
    color: #606266;

    &:hover {
      color: #1890ff;
    }
  }

  .bottom:hover {
    border-bottom: 2px solid #1890ff;
  }

  /* 总览*/
  .current-module.bottom {
    color: #1890ff;
    border-bottom: 2px solid #1890ff;
    font-weight: 500;
  }

  /* gic 后台*/

  .moveleft {
    margin-left: -136px;
    transition: all 0.3s ease;
    background-position: 151px 10px;
  }

  .moveright {
    margin-left: 0px;
    transition: all 0.2s ease;
  }

  .arrowico {
    position: absolute;
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    right: 0px;
    top: 25px;
  }

  .arrow-icon-down {
    position: relative;
    -webkit-transition: all 0.5s;
    -moz-transition: all 0.5s;
    transition: all 0.5s;
  }

  .el-dialog__wrapper /deep/ {
    .el-dialog {
      min-width: 425px;
      width: 425px;
    }
  }

  .el-dialog__body {
    padding: 0 20px;
  }

  &__status {
    color: #999;
    cursor: pointer;
    a {
      color: #f5222d;
    }
    & /deep/ .el-button--danger {
      background: #fff;
      &:hover,
      &:active,
      &:focus {
        color: #f5222d;
      }
    }
    & /deep/ .el-button--warning {
      background: #fff;
      &:hover,
      &:active,
      &:focus {
        color: #faad14;
      }
    }
  }
}

/*gic 商户后台*/
.itemlink-gic {
  float: left;
  display: inline-block;
  height: 62px;
  padding: 0 20px;
  position: relative;
  color: #606266;
  cursor: pointer;

  &:hover {
    color: #1890ff;
  }

  &:hover .arrow-icon-down {
    transform: rotate(180deg);
  }

  &:hover .itempanel {
    display: block;
  }

  .curitemlink {
    border-bottom: 2px solid #1890ff;
  }

  .itempanel {
    display: none;
  }

  .containers-listlik.current-rout {
    color: #1890ff;
  }

  .containers-listlik-a {
    display: block;
  }

  .gicnavlink {
    position: absolute;
    left: -100px;
    top: 60px;
    width: 966px;
    min-height: 550px;
    background: #fff;
    min-width: 150px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    padding: 12px 0px 25px 30px;
    z-index: 9999;
    color: #606266;
    line-height: 1.4;
    text-align: justify;
    font-size: 14px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -o-box-sizing: border-box;
    box-sizing: border-box;
  }
  .gicnavarrow {
    position: absolute;
    left: 50%;
    top: 50px;
    transform: translate(-50%);
    z-index: 3;
    .arrow {
      position: relative;
      display: block;
      background-color: #fff;
      width: 6px;
      height: 6px;
      border: 0;
      border-top: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      transform: translate(0px, 7px) rotate(-45deg);
      filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
      &:after {
        position: absolute;
        left: 0;
        top: -2px;
        width: 10px;
        height: 1px;
        content: '';
        border-radius: 2px;
        background-color: #fff;
        transform-origin: left top;
        transform: rotate(45deg);
      }
    }
  }
  .containers {
    display: flex;
    flex-wrap: wrap;
    flex-flow: row wrap;
    padding: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -o-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    &-ul {
      line-height: 40px;
    }
    &-title {
      color: #303133;
      font-size: 14px;
      font-weight: bold;
      padding: 0;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      -o-box-sizing: border-box;
      box-sizing: border-box;
    }
    &-listlik {
      font-size: 12px;
      color: #606266;
      line-height: 30px;
      &:hover {
        color: #1890ff;
      }
    }
    &-item {
      flex: 0 0 185px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      -o-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
  .curactive {
    color: #fede29;
  }
}

li {
  list-style: none;
}

/*用户信息*/
.navuserinfo /deep/ {
  width: 140px;
  text-align: center;
  a {
    color: #606266;
  }
  .navusername {
    position: relative;
    display: inline-block;
    padding: 0 20px;
    height: 48px;
    &:hover {
      color: #1890ff;
    }
    &:hover .arrowico {
      transform: rotate(180deg);
    }
  }
}

.navsuerwrap /deep/ {
  .useritem {
    position: relative;
    line-height: 35px;
    height: 35px;
    margin-bottom: 10px;
    text-align: center;
    color: #606266;
    a {
      color: #606266;
    }
    &:hover .usertext {
      display: block;
      width: 119px;
      margin-left: -12px;
      color: #1890ff;
      background-color: #ecf5ff;
      cursor: pointer;
    }
  }
  .loginout {
    border-top: 1px solid #eee;
    box-sizing: border-box;
    padding: 15px 0;
    margin-bottom: 20px;
  }
}

.el-popover {
  min-width: 95px;
}

.user-header-pop {
  min-width: 95px;
}

.el-popover.user-header-pop {
  min-width: 95px;
}
// 数据模式
.data-type-wrap {
  margin-right: 30px;
  color: #606266;
  .safe-type {
    margin-right: 15px;
  }
}
.safe-type,
.danger-type {
  cursor: pointer;
}
.safe-type /deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: #52c41a;
  background: #52c41a;
}
.safe-type /deep/ .el-radio__input.is-checked + .el-radio__label {
  color: #52c41a;
}
.danger-type /deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: #faad14;
  background: #faad14;
}
.danger-type /deep/ .el-radio__input.is-checked + .el-radio__label {
  color: #faad14;
}
/*弹窗*/
/*.user-dialog-wrap /deep/ {
    position: relative;*/

.el-dialog__wrapper {
  /deep/ .el-dialog {
    min-width: 425px;
    width: 425px;

    /deep/ .el-dialog__body {
      padding: 0 20px;
    }
  }
}

.user-form-dialog {
  /deep/ .el-dialog {
    min-width: 425px;
  }

  /deep/ .el-dialog__body {
    padding: 0 20px;
  }

  /deep/ .el-input {
    width: 260px;
  }
}
.pass-form-dialog {
  /deep/ .el-dialog {
    min-width: 425px;
  }

  /deep/ .el-dialog__body {
    padding: 0 20px;
  }
}

.el-input {
  width: 260px;
}
/*}*/

/* 当浏览器的可视区域小于1280px */
@media screen and (max-width: 1280px) {
  .navheader {
    min-width: 1280px;
  }
}
@media screen and (min-width: 1280px) and (max-width: 1366px) {
  .navheader {
    min-width: 1280px;
  }
}
@media screen and (min-width: 1366px) and (max-width: 1440px) {
  .navheader {
    min-width: 1366px;
  }
}
@media screen and (min-width: 1440px) and (max-width: 1920px) {
  .navheader {
    min-width: 1440px;
  }
}
.dialog-footer {
  line-height: 1;
}
.udesk-link {
  background: #1890ff;
  text-align: center;
  line-height: 100px;
  width: 32px;
  height: auto;
  position: fixed;
  right: 0;
  bottom: 102px;
  color: white;
  border-radius: 5px 0 0 5px;
  line-height: 1.2;
  height: 100px;
  &:hover {
    color: #fff !important;
  }
  img {
    padding: 9px 0 4px;
  }
  span {
    display: inline-block;
    width: 20px;
    line-height: 15px;
    font-size: 14px;
  }
}
</style>

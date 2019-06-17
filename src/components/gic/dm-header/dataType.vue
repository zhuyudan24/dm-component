<template>
  <el-dialog title="申请风险模式" class="apply-danger-wrap" :visible.sync="dialogVisible" :modal-append-to-body="false" @close="sendTypeToFar" width="800px">
    <div class="apply-danger-content">
      <div class="lt-content">
        <div class="question-wrap">
          <p class="question">Q：什么是风险模式？</p>
          <p class="answer">风险模式即可查看完整的会员卡号和会员手机号码，GIC不会在页面中对数据做加密处理。</p>
        </div>
        <div class="use-time-wrap">
          <p>选择风险模式的使用时间：</p>
          <el-radio-group v-model="useTime">
            <el-radio :label="1">5分钟</el-radio>
            <el-radio :label="2">15分钟</el-radio>
            <el-radio :label="3">1小时</el-radio>
            <el-radio :label="4">6小时</el-radio>
            <el-radio :label="5">24小时</el-radio>
            <el-radio :label="6">7天</el-radio>
            <el-radio :label="7">30天</el-radio>
          </el-radio-group>
        </div>
        <div class="use-time-wrap">
          <p>申请理由：</p>
          <el-input type="textarea" placeholder="请输入申请理由" resize="none" v-model="textarea"> </el-input>
        </div>
        <div class="btn">
          <el-button @click="sureApplyBtn" type="primary" :disabled="textarea == '' ? true : false">确认申请</el-button>
        </div>
      </div>
      <div class="rt-content">
        <ul>
          <li v-for="item in tableData" :key="item.auditorId">
            <p class="checker-name">{{ item.auditorName }}</p>
            <p>{{ item.mobilePhone }}</p>
          </li>
        </ul>
        <div v-if="tableData && tableData.length < 1" class="no-data-wrap">
          <div class="no_checker_icon">
            <img src="./no_checker_icon.png" alt="" />
          </div>
          <p>暂无审核人员</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import qs from 'qs';
export default {
  name: 'dataType',
  props: {
    dataType: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      repProjectName: 'gic-web', // 项目名
      dialogVisible: false,
      useTime: 1,
      textarea: '',
      btnBool: true,
      baseUrl: '',
      tableData: []
    };
  },
  beforeMount() {
    let host = window.location.origin;
    if (host.indexOf('localhost') != '-1') {
      this.baseUrl = 'http://gicdev.demogic.com';
    } else {
      this.baseUrl = host;
    }
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      if (this.dataType == '1') {
        let res = await this.axios.post(
          this.baseUrl + '/api-admin/check-risk-mode',
          qs.stringify({
            requestProject: this.repProjectName
          })
        );
        let data = res.data;
        if (data.errorCode == 0) {
          this.tableData = await this.getCheckerList();
          this.dialogVisible = true;
          this.textarea = '';
          this.useTime = 1;
        } else if (data.errorCode == 1) {
          // 缺少审核员
          let phone = data.result;
          let html = '<p style="font-size:14px;color:#606266;line-height:20px;margin-bottom:4px;">该商户还没有审核员，请联系超级管理员新增审核员！</p>';
          html += '<p style="font-size:13px;color:#606266;line-height:18px;">超级管理员：<span style="color:#1890ff;">' + phone + '</span></p>';
          this.$confirm(html, '提示', {
            confirmButtonText: '知道了',
            cancelButtonText: '取消',
            showCancelButton: false,
            type: 'warning',
            dangerouslyUseHTMLString: true
          })
            .then(() => {
              this.sendTypeToFar();
            })
            .catch(() => {
              this.sendTypeToFar();
            });
        } else if (data.errorCode == 2) {
          // 已提交，不能重复提交
          let total = data.result;
          let second = total % 60 < 10 ? '0' + (total % 60) : total % 60;
          this.timeValue = Math.floor(total / 60) + ':' + second;
          this.$message.warning('请勿重复申请，请在' + this.timeValue + '分钟后重试');
          this.sendTypeToFar();
        } else if (data.errorCode == 3) {
          //  当前已是风险模式
          let html = '<p style="font-size:14px;color:#606266;">当前已经是风险模式</p>';
          this.$confirm(html, '提示', {
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
            .catch(() => {
              // this.sendTypeToFar();
            });
        } else if (data.errorCode == 4) {
          // 商户审核员没有绑定openid
          this.$message.warning('审核员未绑定达摩网络公众号');
          this.sendTypeToFar();
        } else {
          this.$message.error(data.message);
        }
      }
    },
    getCheckerList() {
      // 获取审核员列表
      return new Promise((resolve, reject) => {
        this.axios
          .post(
            this.baseUrl + '/api-admin/list-auditor',
            qs.stringify({
              requestProject: this.repProjectName
            })
          )
          .then(res => {
            let resData = res.data;
            if (resData.errorCode == 0) {
              let dataArr = resData.result ? resData.result : [];
              resolve(dataArr);
            } else {
              reject([]);
              this.$message.error({
                duration: 1000,
                message: resData.message
              });
            }
          });
      });
    },
    sendTypeToFar() {
      // 给父组件传值 0 安全模式
      this.$emit('sendDataType', '0');
    },
    sureApplyBtn() {
      // 弹框按钮 确认申请
      if (this.btnBool) {
        this.btnBool = false;
        this.sendTypeToFar(); // 刚申请时  转回安全模式
        this.axios
          .post(
            this.baseUrl + '/api-admin/apply-risk-mode',
            qs.stringify({
              requestProject: this.repProjectName,
              duration: this.useTime,
              applyReason: this.textarea
            })
          )
          .then(res => {
            let data = res.data;
            this.btnBool = true;
            if (data.errorCode == 0) {
              this.$message.success('风险模式申请提交成功');
              this.dialogVisible = false;
            } else {
              this.$message.error(data.message);
            }
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.apply-danger-content {
  display: flex;
  .lt-content {
    padding: 20px 20px 0 20px;
    flex: 0 0 540px;
    width: 540px;
    border-right: 1px solid #dcdfe6;
    .question-wrap {
      padding: 13px 20px;
      background: #f4f4f5;
      border-radius: 6px;
      color: #606266;
      margin-bottom: 50px;
      .question {
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 10px;
      }
      .answer {
        font-size: 13px;
        line-height: 18px;
      }
    }
    .use-time-wrap {
      line-height: 1;
      margin-bottom: 24px;
      position: relative;
      p {
        color: #303133;
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 17px;
      }
    }
    .btn {
      text-align: center;
      margin: 45px 0 30px 0;
    }
  }
  .rt-content {
    flex: 1;
    overflow-y: auto;
    height: 470px;
    li {
      padding: 13px 0 13px 20px;
      border-bottom: 1px solid #dcdfe6;
      font-size: 14px;
      color: #606266;
      line-height: 20px;
      &:last-child {
        margin-top: 4px;
      }
      .checker-name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}
.no-data-wrap {
  text-align: center;
  padding: 40px 0 0 0;
  line-height: 1;
  .no_checker_icon {
    width: 80px;
    height: 56px;
    margin: 0 auto;
    margin-bottom: 22px;
    img {
      width: 100%;
    }
  }
  p {
    color: #909399;
  }
}
.apply-danger-wrap /deep/ .el-dialog__header,
.apply-danger-wrap .el-dialog__header {
  padding: 0 20px;
  height: 54px;
  border-bottom: 1px solid #dcdfe6;
}
.apply-danger-wrap /deep/ .el-dialog__body,
.apply-danger-wrap .el-dialog__body {
  padding: 0;
}
</style>

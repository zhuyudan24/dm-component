<template>
  <el-dialog title="选择图片" :visible.sync="show" width="800px" :before-close="close">
    <div class="dm-ilib clearfix">
      <nav class="fl">
        <h4 class="text-left pl10"><el-button style="font-weight: 500;" size="small" type="text" icon="el-icon-plus" @click.stop="addGroup">新建分组</el-button></h4>
        <ul class="dm-ilib-category">
          <li v-for="(v, i) in groupsList" :key="i" @click="changeGroup(v)" :class="{ active: listParams.wechatImageGroupId === v.wechatImageGroupId }">
            <span class="ellipsis-80">{{ v.groupName }}</span
            ><span class="fz10 gray"> ({{ v.imageCount }})</span>
          </li>
        </ul>
      </nav>
      <article class="fr">
        <div class="dm-ilib-header">
          <h4>
            {{ listParams.wechatImageGroupId ? currentGroup.groupName : '所有图片' }}
            <i v-if="listParams.wechatImageGroupId" class="el-icon-edit" @click="editGroup"></i>
            <i v-if="listParams.wechatImageGroupId" class="el-icon-delete" @click="delGroup"></i>
          </h4>
          <div class="dm-ilib-opt_right">
            <span class="fz12 gray pr10">大小不超过2M</span>
            <label class="el-button el-button--primary el-button--small" :class="{ 'is-disabled': upLoadDisabled }"
              >{{ upLoadDisabled ? '上传中...' : '上传图片' }}
              <input type="file" style="display:none;" :disabled="upLoadDisabled" accept="image/gif, image/jpeg,image/png" ref="uploader" v-imglibupload="this" />
            </label>
          </div>
        </div>
        <div class="clearfix img-item__wrap">
          <label :name="v.imageId" class="dm-img-item" v-for="(v, i) in imgList" :key="i" :item="v" @click.stop.prevent="rowClick(v)">
            <div v-show="v.imageId === selectedId[0]" class="dm-img-item--mask">
              <i class="el-icon-check"></i>
            </div>
            <div class="dm-img-item_top">
              <img :src="v.qcloudImageUrl" alt="" srcset="" />
            </div>
            <div class="dm-img-item_center">
              <p>{{ v.imageTitle }}</p>
            </div>
          </label>
        </div>
        <el-pagination v-show="imgList.length" class="dm-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listParams.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="listParams.pageSize" layout="prev, pager, next" :total="total"></el-pagination>
      </article>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">关 闭</el-button>
      <el-button type="primary" @click="addItem">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { log } from '@/utils/index.js';
import { loadImgList, addGroupService, updateGroupName, deleteGroupService } from '../assets/api.js';
export default {
  name: 'lib-img',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.loadImgList();
  },
  data() {
    return {
      upLoadDisabled: false,
      imgList: [],
      listParams: {
        currentPage: 1,
        pageSize: 12,
        wechatImageGroupId: ''
      },
      total: 0,
      selectedData: {},
      selectedId: [],
      groupsList: [],
      groupsMoveList: [],
      loading: true,
      currentGroup: { groupName: '' },
      moveImgVal: '',
      fileList: []
    };
  },
  methods: {
    handleSizeChange(val) {
      this.listParams.pageSize = val;
      this.loadImgList();
    },
    handleCurrentChange(val) {
      this.listParams.currentPage = val;
      this.loadImgList();
    },
    loadImgList() {
      this.loading = true;
      loadImgList(this.listParams)
        .then(res => {
          if (res.errorCode === 0) {
            this.total = res.result.page.totalCount;
            this.currentGroup = res.result.currentGroup;
            this.groupsMoveList = Object.assign([], res.result.groups);
            this.groupsList = res.result.groups;
            this.groupsList.unshift({ wechatImageGroupId: '', groupName: '所有图片', imageCount: res.result.totalPicsCount });
            this.imgList = [];
            if (res.result.page.result) {
              const resList = res.result.page.result;
              this.$nextTick(_ => {
                resList.map(v => {
                  this.imgList.push(v);
                });
              });
            } else {
              this.imgList = [];
            }
          }
          this.loading = false;
        })
        .catch(err => {
          this.$message({ type: 'warning', message: '获取图片列表错误' });
        });
    },
    changeGroup(v) {
      this.listParams.wechatImageGroupId = v.wechatImageGroupId;
      this.loadImgList();
    },
    addGroup() {
      this.$prompt('', '新增分组', {
        confirmButtonText: '确定',
        cancelBUttonText: '取消',
        inputPattern: /\S/,
        inputPlaceholder: '请输入分组名称',
        inputErrorMessage: '名称不能为空',
        inputValue: '新分组'
      })
        .then(({ value }) => {
          this.addGroupService(value);
        })
        .catch(err => {
          log(err);
        });
    },
    addGroupService(val) {
      addGroupService({ groupName: val })
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({ type: 'success', message: '新增成功' });
            this.loadImgList();
          } else {
            this.$message({ type: 'error', message: '新增失败' });
          }
        })
        .catch(err => {
          this.$message({ type: 'error', message: '新增失败' });
        });
    },
    close() {
      this.$emit('update:show', false);
    },
    rowClick(row) {
      // 可以取消
      if (row.imageId === this.selectedId[0]) {
        row.comName = '';
        row.title = '';
        this.selectedId = [];
        this.selectedData = {};
        return;
      }
      row.comName = 'image';
      row.title = row.imageTitle;
      this.selectedId = [row.imageId];
      this.selectedData = row;
    },
    addItem() {
      if (!this.selectedData.comName) {
        this.$message({ type: 'warning', message: '未选择图片' });
        return;
      }
      this.$emit('sendItem', this.selectedData);
      this.close();
    },
    //删除分组
    delGroup() {
      this.$confirm('是否删除该分组?', '提示', {
        confirmButtonText: '确定',
        cancelBUttonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteGroupService();
        })
        .catch(() => {
          this.$tips({ type: 'info', message: '已取消删除' });
        });
    },
    async deleteGroupService() {
      try {
        await deleteGroupService({ wechatImageGroupId: this.listParams.wechatImageGroupId });
        this.$tips({ type: 'success', message: '删除分组成功!' });
        this.listParams.wechatImageGroupId = '';
        this.loadImgList();
      } catch (err) {
        this.$tips({ type: 'error', message: '删除分组失败!' });
      }
    },
    //编辑分组
    editGroup() {
      this.$prompt('', '修改分组名称', {
        confirmButtonText: '确定',
        cancelBUttonText: '取消',
        inputPattern: /\S/,
        inputPlaceholder: '请输入新名称',
        inputErrorMessage: '名称不能为空',
        inputValue: this.currentGroup.groupName
      })
        .then(({ value }) => {
          this.updateGroupName(value);
        })
        .catch(() => {
          this.$tips({
            type: 'info',
            message: '取消修改'
          });
        });
    },
    async updateGroupName(val) {
      await updateGroupName({ wechatImageGroupId: this.listParams.wechatImageGroupId, groupName: val });
      this.$tips({ type: 'success', message: '修改成功' });
      this.loadImgList();
    }
  }
};
</script>

<style lang="scss" scoped>
.dm-ilib {
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  & > article {
    position: relative;
    width: calc(80% - 1px);
    border-left: 1px solid #dcdfe6;
    border-radius: 0 2px 2px 0;
    height: 400px;
    .dm-ilib-header {
      display: flex;
      justify-content: space-between;
      padding: 0 16px;
      align-items: center;
      border-bottom: 1px solid #dcdfe6;
    }
    h4 {
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      i {
        font-size: 16px;
        padding-left: 10px;
        cursor: pointer;
        color: #909399;
        &.el-icon-edit:hover {
          color: #1890ff;
        }
        &.el-icon-delete:hover {
          color: #f5222d;
        }
      }
    }
  }
  .img-item__wrap {
    height: 290px;
    margin-left: 6px;
    overflow-y: auto;
  }
  & > nav {
    width: 20%;
    h4 {
      height: 50px;
      line-height: 50px;
      padding-right: 20px;
      font-size: 16px;
      border-bottom: 1px solid #dcdfe6;
      cursor: pointer;
    }
    .dm-ilib-category {
      height: 348px;
      overflow-y: scroll;
      cursor: pointer;
      li {
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
        span {
          vertical-align: middle;
        }
        &.active,
        &:hover {
          span {
            color: #199aff;
          }
        }
      }
    }
  }
  &-opt {
    background: #f4f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 20px;
  }
}
.ellipsis-80 {
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 80px;
  white-space: nowrap;
  word-wrap: normal;
  width: auto;
  display: inline-block;
  vertical-align: middle;
}
.dm-img-item {
  position: relative;
  width: 168px;
  margin: 20px 10px 0 10px;
  float: left;
  border: 1px solid #e4e7ed;
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    border: 1px solid #1890ff;
  }
  &_top {
    width: 168px;
    height: 168px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &_center {
    border-top: 1px solid #e4e7ed;
    height: 32px;
    display: flex;
    justify-content: left;
    align-items: center;
    padding-left: 10px;
    p {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  &_bottom {
    border-top: 1px solid #e4e7ed;
    height: 32px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #f4f5f9;
  }
  &--mask {
    position: absolute;
    background: rgba(0, 0, 0, 0.6);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
    text-align: center;
    i {
      font-size: 60px;
      line-height: 201px;
      color: #fff;
    }
  }
}
</style>

<template>
  <layout>
    <template slot="component">
      <div class="table">
        <el-table ref="dragTable" :data="list" row-key="id" border style="width: 100%">
          <el-table-column label="title">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>

          <el-table-column label="name">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="status">
            <template slot-scope="scope">
              <span>{{ scope.row.status }}</span>
            </template>
          </el-table-column>

          <el-table-column label="status">
            <template slot-scope="scope">
              <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template slot="data">
      {{ data }}
    </template>
    <template slot="markdown">
      <MyMarkdown></MyMarkdown>
    </template>
  </layout>
</template>
<script>
/* eslint-disable */
import Sortable from 'sortablejs';
import layout from '../layout.vue';
import Wave from '../../components/expansion/dm-wave/_util';
import MyMarkdown from '../../components/expansion/dm-wave/readme.md';

export default {
  name: 'dm-wave',

  components: {
    Wave,
    layout,
    MyMarkdown
  },

  data() {
    return {
      data: [],
      list: [{ id: '123sadas', name: '张三', status: '完成', title: 'A股' },
        { id: '1ewrsar34das', name: '李四', status: '未完成', title: 'B股' },
        { id: '1rwer23sadas', name: '赵六', status: '失败', title: 'C股' },
        { id: 'f12sadas', name: '王五', status: '未完成', title: 'D股' }],
      oldList: [], // 保存id
      newList: []
    };
  },

  created() {
    this._getList();
  },

  methods: {
    handleDelete(index, row) {
      //
    },
    _getList() {
      // 请求数据之后
      // getList().then(res => {
      this.oldList = this.list.map(v => v.id);
      this.newList = this.oldList.slice();
      this.$nextTick(() => {
        this.setSort();
      });
      // })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
      // 创建一个sortable对象
      // 下面都是配置项 可以看文档 https://github.com/SortableJS/Sortable
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData(dataTransfer) {
          dataTransfer.setData('Text', '');
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0];
          this.list.splice(evt.newIndex, 0, targetRow);

          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
          this.newList.splice(evt.newIndex, 0, tempIndex);
        }
      });
    }
  }
};
</script>

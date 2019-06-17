
```
<vue-gic-people :projectName="projectName" :useId="useId" :hasSearchData="hasSearchData"
:sceneValue="sceneValue" ref="peopleFilter" :isAdd="operateType" @findFilter="findFilter" @getBackData="getBackData" @editHide= "editHide" @editShow="editShow" @hideBtn="hideBtn"&</vue-gic-people&

// 按钮根据当前使用场景设置,有的无保存
<div v-if="toggleTag"&
  <button @click="getData"&确定</button&
  <button @click="cancelFilter"&取消</button&
</div&
<div v-if="saveTag"&
  <button @click="saveTempData"&保存</button&
</div&

data() {
  return {
    // 可传参数
    projectName: '', // 当前项目名
    sceneValue: 'member', // 场景值
    useId: '', // 模板id
    hasSearchData: '' , // 当前页回显的数据(接口返回)
	operateType: true, // 编辑的时候是false 新增是true 例如列表筛选是开始true 编辑改成false
    toggleTag: false, // 控制(确认取消)按钮显示的参数,仅供参考,可自行修改
    saveTag: false,  // 控制(保存)按钮显示的参数,仅供参考,可自行修改
  }
},

beforeMount() {
  // (如果需要传递数据)请求的数据最好在这里写
},

methods: {
  // 父组件调用子组件方法,触发父组件事件
  getData() {
    var that = this
    that.$refs.peopleFilter.confirmSet()
  },

  // 子组件触发父组件事件,返回过滤条件数据
  findFilter(value){
    var that = this
    console.log(value)
  },

  // 取消
  cancelFilter(){
    var that = this
    that.$refs.peopleFilter.cancelSet()
  },

  // 获取需要回显的数据, 供保存时候使用
  getBackData(val) {
    var that = this
    console.log(val)
    that.getSaveData = val;
  },

  // 显示编辑,保存按钮隐藏,确认按钮显示 (子组件会调用)
  editShow() {
    var that = this
    console.log('editShow')
    that.toggleTag= true
    that.saveTag = false
  },

  // 显示保存按钮,隐藏确认按钮显示  (子组件会调用)
  editHide() {
    var that = this
    console.log('editHide')
    that.toggleTag = false
    that.saveTag = true
  },

  // 隐藏保存按钮和确认按钮  (子组件会调用)
  // 传个参数给父组件 来查数据
  hideBtn(refresh) {
    if (refresh === 0) {
      this.memberSearchStr = -1;
      this.toggleTag = false;
      // 查数据的方法
	  this.getList();
	}
  },

  // 保存当前模板,对接保存接口
  saveTempData() {
    var that = this
    console.log('save')
  },

}

```
&公共样式中需要增加的样式


```

.input-search-select .el-select__tags-text {
  max-width: 262px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: top;
}

```




## log

- **20180919**
  - 1.修改了一些测试提到优化的问题
  - 2.增加 input-tags
  - 3.增加一个样式需要添加到公共样式中

- **20180904**
  - 1.增加区间必填判断

- **20180903**
  - 1.增加生日判断
  - 2.增加搜索下拉多选数据
  - 3.增加区间选择控件和值判断

- **20180830**
  - 1.增加生日日期限制
  - 2.增加取消操作逻辑

- **20180829**
  - 1.修改选择门店分组方法


- **20180828**
  - 1.增加隐藏按钮方法
  - 2.增加 无筛选条件默认隐藏按钮,
  - 3.增加重置
  - 4.修改人群筛选器确认取消按钮/保存按钮切换显示
  - 5.修改重置图标

- **20180821**
  - 1.增加缩略信息和回显条件功能
  - 2.增加子组件内部切换按钮方法
  - 3.增加子组件提供父组件保存条件用的数据
  - 4.增加子组件中获取缩略信息用到的 useId 参数和父组件传递 hasSearchData 的参数

- **20181011**
   1.修复当选择一条筛选条件的时候 再去删除条件不会查列表数据

- **20181105**
   1 嵌入新的门店组件
   2 嵌入生日的选择组件

- **20181107**
   1 生日日期组件显示错误修复 且 生日选择跨年

- **20181112**
   1 人群筛选器筛选条件高亮显示修改 每个条件都高亮
   
- **20190228**
  1 人群筛选器修改门店组件除所有门店外必须选择门店

- **20190306**
  1 主动去查缩略信息 saveSelectData 主动调用这个方法
  
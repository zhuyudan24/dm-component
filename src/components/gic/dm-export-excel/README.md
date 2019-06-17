
```
import vueGicExportExcel from '@gic-test/vue-gic-export-excel'
Vue.use(vueGicExportExcel)
// 使用页面
<vue-gic-export-excel :dataArr="tableData" :dialogVisible.sync="dialogVisible" :type="1" :excelUrl="excelUrl" :params="params" :projectName="projectName"></vue-gic-export-excel>
data() {
  return {
        projectName: '', // 当前项目名
        dialogVisible:false,
        excelUrl:'', // 下载数据的地址
        params:{}, // 传递的参数
        tableData:[], // 是否有导出数据
  }
},

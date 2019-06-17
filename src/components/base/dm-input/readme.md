### 使用
#### dm-input

`<dm-input :byteType="0" type="text" v-model="value" :maxlength="20"></dm-input>`

说明：
1主要拓展maxlength的样式 type传text或者textarea，其他使用和el-input相同
2   byteType类型有三种  默认不传为0
```
0 一个汉字算1个字，字母数字1个字
1 一个汉字算1个字，字母数字0.5个字
2 一个汉字算2个字，字母数字1个字
```

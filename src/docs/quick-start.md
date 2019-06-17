## 监听并格式化代码
```
npm run format
```
prettier自动格式化代码
## 创建组件
比如 创建一个dm-input组件
1. 每个组件对应创建一个view，比如components/dm-input组件，创建views/input.vue
2. 新增api/modules/input.js（非必要）

## 打包组件
```
npm run component
```
修改components.json 带上版本号，每次修改更新版本号

## 发布组件到cdn
打包自动发布到cdn上

## 发布文档
 通过jenkins发布dm-component
 文档预览地址：http://gicdev.demogic.com/component


## 修改index.html为cdn引入
cdn地址
https://web-1251519181.file.myqcloud.com/components/文件名.js
字体图标，公共style样式，公共组件全部通过cdn

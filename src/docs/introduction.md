# 达摩网络前端组件库
## 文档地址
http://gicdev.demogic.com/component
## 仓库地址
http://115.159.76.241/frontEnd/dm-component
## 目录结构
此项目结构为vue-cli脚手架修改webpack
```
dm-component
├── /build  // 新增了component的打包配置
├── /components // 构建组件库npm run component 发布cdn
├── components.json // 组件列表
├── dist // 组件文档 用jenkins发布到测试环境
├── src
	├── /assets          // 资源目录 图片，样式，iconfont
	├── /components      // 组件目录
	├── /config          // 项目配置 baseUrl配置
	├── /routes          // 路由配置
		├── index.js
	├── /api         // 接口
		├── /modules // 按照组件分模块整理组件接口
		├── index.js // 配置接口请求
	├── /utils           // 工具方法
	└── /views           // 视图层 每个组件对应一个视图页面
.editorconfig // 编辑器配置
.eslintrc  // eslit 配置
.prettierrc // prettier 配置
```

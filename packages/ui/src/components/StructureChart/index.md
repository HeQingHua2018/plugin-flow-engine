---
category: Components
title: StructureChart # 组件的标题，会在菜单侧边栏展示
toc: content # 在页面右侧展示锚点链接
group: # 分组
  title: 图表 # 所在分组的名称
  order: 4 # 分组排序，值越小越靠前
---

# StructureChart 架构图

## 代码演示

### 基础使用(TB)

<code src="./demo/testTb.tsx"></code>

### 左右结构(LR)

<code src="./demo/testLr.tsx"></code>

### DOM 节点(H)

<code src="./demo/testDomH.tsx"></code>

### DOM 节点(LR)

<code src="./demo/testDomLr.tsx"></code>

### 可编辑节点

<code src="./demo/edit.tsx"></code>

## API

| 属性           | 说明                                                   | 类型                                                                          | 默认值    |
| -------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------- | --------- |
| dataSource     | 默认数据                                               | [NodeType](#nodetype)                                                         |           |
| type           | 布局类型                                               | `TB \| LR \| H`                                                               |           |
| mode           | 渲染模式                                               | `default \| html`                                                             | `default` |
| edit           | 编辑模式                                               | `boolean`                                                                     | `false`   |
| endArrow       | 边线箭头展示                                           | `hide \| show`                                                                | `hide`    |
| hideParentIcon | 隐藏根节点折叠 Icon                                    | `boolean`                                                                     | `false`   |
| width          | 节点宽度                                               | `number`                                                                      | `245`     |
| height         | 节点高度                                               | `number`                                                                      | `48`      |
| toolbar        | 工具栏                                                 | `boolean \| {downloadFileName?: string;onDownload?: (url:string) => void;}`   |           |
| tooltip        | 节点 hover 提示内容                                    | `(data: NodeType) => string \| HTMLElement;`                                  |           |
| params         | 数据请求参数                                           | `Record<string,any>`                                                          |           |
| request        | 异步获取数据                                           | `(params: Record<string,any>) => Promise<RequestResult<any>>`                 |           |
| onNodeClick    | 节点点击事件                                           | `(node: NodeType, updateNode: (node) => TreeNodeType \| DomNodeType) => void` |           |
| onNodeAdd      | 节点新增事件                                           | `(node: NodeType) => NodeType`                                                |           |
| onBeforeLoad   | 异步加载数据前回调函数，返回 false，则阻止异步加载数据 | `(params?: RequestParam) => boolean`                                          |           |
| onLoadSuccess  | 异步加载数据成功回调函数                               | `(data: NodeType) => void`                                                    |           |
| onLoadFail     | 异步加载数据失败回调函数                               | `() => void;`                                                                 |           |
| onLoadError    | 异步加载数据异常回调函数                               | `(error:Error)=>void`                                                         |           |

### NodeType

| 属性        | 说明                                                  | 类型                                    | 默认值  |
| ----------- | ----------------------------------------------------- | --------------------------------------- | ------- |
| id          | ID                                                    | `string`                                |         |
| skin        | 节点颜色                                              | `string`                                |         |
| hideIcon    | 不显示节点 icon(仅 edit: true 生效)                   | `boolean`                               | `false` |
| title       | 标题 (仅 mode: 'default'生效)                         | `string`                                |         |
| label       | 节点边展示内容 (仅 mode: 'default'生效)               | `string`                                |         |
| width       | 节点宽度 (仅 mode: 'html'生效且优先级高于 props 配置) | `number`                                |         |
| height      | 节点高度 (仅 mode: 'html'生效且优先级高于 props 配置) | `number`                                |         |
| html        | 节点 dom 内容 (仅 mode: 'html'生效)                   | `string \| HTMLElement \| ReactElement` |         |
| description | 节点 hover 时展示数据，配合 tooltip 使用              | `Record<string, any>`                   |         |
| children    | 子节点数据                                            | [NodeType[]](#nodetype)                 |         |

---
category: Components
title: MeshChart # 组件的标题，会在菜单侧边栏展示
toc: content # 在页面右侧展示锚点链接
group: # 分组
  title: 图表 # 所在分组的名称
  order: 3 # 分组排序，值越小越靠前
---

# MeshChart 网状图

## 代码演示

### 基础使用

<code src="./demo/basic.tsx"></code>

### 节点提示(tooltip)

<code src="./demo/toolTip.tsx"></code>

## API

| 属性          | 说明                                                   | 类型                                                                        | 默认值 | 版本  |
| ------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- | ------ | ----- |
| dataSource    | 默认数据                                               | [NodeType[]](#nodetype)                                                     |        |       |
| legend        | 图表图例                                               | [LegendType](#legendtype)                                                   |        |       |
| toolbar       | 工具栏                                                 | `boolean \| {downloadFileName?: string;onDownload?: (url:string) => void;}` |        | 3.2.7 |
| tooltip       | 节点 hover 提示内容                                    | `(e) => string \| HTMLElement;`                                             |        | 3.2.7 |
| params        | 数据请求参数                                           | `Record<string,any>`                                                        |        |       |
| request       | 异步获取数据                                           | `(params: Record<string,any>) => Promise<RequestResult<any>>`               |        |       |
| onNodeClick   | 节点点击事件                                           | `(node:NodeType) => void`                                                   |        |       |
| onBeforeLoad  | 异步加载数据前回调函数，返回 false，则阻止异步加载数据 | `(params?: RequestParam) => boolean`                                        |        |       |
| onLoadSuccess | 异步加载数据成功回调函数                               | `(data: NodeType[]) => void`                                                |        |       |
| onLoadFail    | 异步加载数据失败回调函数                               | `() => void;`                                                               |        | 3.2.7 |
| onLoadError   | 异步加载数据异常回调函数                               | `(error:Error)=>void`                                                       |        | 3.2.7 |

### NodeType

| 属性        | 说明                                     | 类型                                  | 默认值 | 版本  |
| ----------- | ---------------------------------------- | ------------------------------------- | ------ | ----- |
| id          | ID                                       | `string`                              |        |       |
| title       | 标题                                     | `string`                              |        |       |
| skin        | 节点颜色                                 | `string`                              | `blue` |       |
| category    | 节点类别                                 | `string`                              |        |       |
| description | 节点 hover 时展示数据，配合 tooltip 使用 | `Record<string, any>`                 |        | 3.2.7 |
| targetNode  | 节点指向目标源                           | `{target: string; label?: string;}[]` |        |       |

### LegendType

| 属性 | 说明     | 类型                                 | 默认值 | 版本 |
| ---- | -------- | ------------------------------------ | ------ | ---- |
| node | 节点内容 | `{ label: string, color: string }[]` |        |      |
| edge | 边内容   | `{ label: string, color: string }[]` |        |      |

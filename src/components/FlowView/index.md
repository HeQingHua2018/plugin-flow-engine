---
category: Components
title: FlowView 组件 # 组件的标题，会在菜单侧边栏展示
toc: content # 在页面右侧展示锚点链接
group: # 分组
  title: 工具类演示 # 所在分组的名称
  order: 1 # 分组排序，值越小越靠前
---

# FlowView 组件

#API

## FlowViewProps

| 参数名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `FlowData` | - | 流程数据，包含节点、边、全局配置等。 |
| `initialValue` | `Record<string, any>` | `{}` | 初始节点配置值，用于表单渲染。 |
| `onNodeConfigChange` | `(nodeId: string, config: Record<string, any>) => void` | - | 节点配置变更回调，用于更新流程数据。 |
| `isValidate` | `boolean` | `false` | 是否在抽屉关闭时校验节点配置表单。 |


# 基础示例
<code src="./demo/basic.tsx"></code>


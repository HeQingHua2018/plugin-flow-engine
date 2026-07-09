---
category: Components
title: FlowView 组件 # 组件的标题，会在菜单侧边栏展示
toc: content # 在页面右侧展示锚点链接
group: # 分组
  title: 基础组件 # 所在分组的名称
  order: 1 # 分组排序，值越小越靠前
---

# FlowView 组件

## 组件概述

FlowView是一个基于React Flow构建的流程可视化组件，用于展示、编辑和配置流程数据。它提供了完整的流程编辑功能，支持节点拖拽、连线、配置编辑等操作，适用于需要流程可视化和配置的场景。

## 基础示例
<code src="./demo/basic.tsx"></code>

## API

### FlowViewProps

| 参数名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `FlowData` | - | 完整流程数据结构，包含flow元信息、context上下文、nodes节点数组和edges边数组等。 |
| `nodeConfigs` | `Record<PluginNodeType, NodeConfig>` | `undefined` | 插件节点类型的UI配置映射，用于注册节点的表单配置和渲染组件。 |
| `customPluginManager` | `PluginManager` | `undefined` | 自定义插件管理器（会与全局插件合并，用于隔离场景）。 |
| `initialValue` | `Record<Node['id'], Record<string, any>>` | `undefined` | 按节点 `id` 提供初始配置。初始值合并顺序：`props.initialValue[nodeId]` > 表单 `schema.defaultValue` > `{}`。 |
| `onNodeConfigChange` | `(nodeId: Node['id'], nodeData: Record<string, any>) => void` | `undefined` | 节点配置变更时的回调（在“保存”或“校验并保存”时触发；实时修改不外抛）。 |
| `isValidate` | `boolean` | `true` | 抽屉关闭或“校验并保存”时是否校验表单。`true` 时使用 `validateFields` 校验；`false` 时直接保存当前值。 |
| `onExecute` | `(data: FlowData) => void` | `undefined` | 执行流程回调（参数为最新的完整流程数据）。 |
| `executionHistory` | `ExecutionHistory[]` | `[]` | 执行历史记录，用于在控制台展示节点执行状态和上下文信息。 |
| `executionResult` | `{ status: boolean; message: string; variables?: Record<string, any>; errorInfo?: any; retries?: number; stoppedAt?: string } \| null` | `undefined` | 执行结果（来自 engine.executeFlow 返回值）。 |
| `showPerformance` | `boolean` | `false` | 是否显示性能监控面板。 |
| `onSaveFlowData` | `(flowData: FlowData) => void` | `undefined` | 保存完整流程数据 |
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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `data` | 完整流程数据结构，包含flow元信息、context上下文、nodes节点数组和edges边数组等 | [FlowData](#flowdata) | - |
| `nodeConfigs` | 插件节点类型的UI配置映射，用于注册节点的表单配置和渲染组件 | `Record<[PluginNodeType](#pluginnodetype), [NodeConfig](#nodeconfig)>` | `undefined` |
| `customPluginManager` | 自定义插件管理器（会与全局插件合并，用于隔离场景） | `PluginManager` | `undefined` |
| `initialValue` | 按节点 `id` 提供初始配置。初始值合并顺序：`props.initialValue[nodeId]` > 表单 `schema.defaultValue` > `{}` | `Record<Node['id'], Record<string, any>>` | `undefined` |
| `onNodeConfigChange` | 节点配置变更时的回调（在“保存”或“校验并保存”时触发；实时修改不外抛） | `(nodeId: Node['id'], nodeData: Record<string, any>) => void` | `undefined` |
| `isValidate` | 抽屉关闭或“校验并保存”时是否校验表单。`true` 时使用 `validateFields` 校验；`false` 时直接保存当前值 | `boolean` | `true` |
| `onExecute` | 执行流程回调（参数为最新的完整流程数据） | (data: [FlowData](#flowdata)) => void | `undefined` |
| `executionHistory` | 执行历史记录，用于在控制台展示节点执行状态和上下文信息 | `[ExecutionHistory](#executionhistory)[]` | `[]` |
| `executionResult` | 执行结果（来自 engine.executeFlow 返回值） | `{ status: boolean; message: string; variables?: Record<string, any>; errorInfo?: any; retries?: number; stoppedAt?: string } \| null` | `undefined` |
| `showPerformance` | 是否显示性能监控面板 | `boolean` | `false` |
| `onSaveFlowData` | 保存完整流程数据 | (flowData: [FlowData](#flowdata)) => void | `undefined` |

### FlowData

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| flow | 流程元信息 | [FlowMeta](#flowmeta) | |
| context | 上下文配置 | [ContextConfig](#contextconfig) | |
| nodes | 节点数组 | [Node[]](#node) | |
| edges | 边数组 | [Edge[]](#edge) | |
| global_config | 全局配置 | [GlobalConfig](#globalconfig) | |

### FlowMeta

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 流程ID | `string` | |
| name | 流程名称 | `string` | |
| version | 流程版本 | `string` | |
| description | 流程描述 | `string` | |
| category | 流程分类 | `string` | |
| enable | 是否启用 | `boolean` | |
| create_date | 创建日期 | `string` | |
| update_date | 更新日期 | `string` | |
| auto | 是否自动执行 | `boolean` | |

### ContextConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| variables | 变量定义 | Record<string, [Variable](#variable)> | |

### Variable

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 变量类型 | `string` | |
| source | 变量来源 | `string` | |
| description | 变量描述 | `string` | |
| default | 默认值 | `any` | |

### Node

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 节点ID | `string` | |
| type | 节点类型 | `string` | |
| position | 节点位置 | `{ x: number; y: number }` | |
| data | 节点数据 | [NodeData](#nodedata) | |
| - | 其他属性 | `参考react flow node props` | |


### NodeData

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 节点标签 | `string` | |
| pluginNodeType | 插件节点类型 | `PluginNodeType` | |
| config | 节点配置 | `Record<string, any>` | |


### Edge

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| id | 边ID | `string` | |
| source | 源节点ID | `string` | |
| target | 目标节点ID | `string` | |
| sourceHandle | 源节点连接点 | `string` | |
| targetHandle | 目标节点连接点 | `string` | |
| data | 边数据 | [EdgeData](#edgedata) | |
| - | 其他属性 | `参考react flow edge props` | |



### EdgeData

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| conditions | 条件表达式 | `TopLevelCondition(参考json-rules-engine)` | |
| isDefault | 是否默认边 | `boolean` | |
| priority | 优先级 | `number` | |

### GlobalConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| timeout | 超时时间 | `number` | |
| max_depth | 最大递归深度 | `number` | |

### PluginNodeType

插件节点类型，支持内置类型和自定义字符串扩展：

```ts
type PluginNodeType = 'Trigger' | 'Action' | 'Branch' | 'Parallel' | 'Iteration' | 'Merge' | 'End' | string;
```

| 类型 | 说明 |
| --- | --- |
| Trigger | 触发节点 |
| Action | 动作节点 |
| Branch | 分支节点 |
| Parallel | 并行节点 |
| Iteration | 迭代节点 |
| Merge | 合并节点 |
| End | 结束节点 |

### NodeConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| schema | 表单配置 | [Schema](#schema) | |
| widgets | 自定义组件映射 | [WidgetMap](#widgetmap) | |

### Schema

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 表单类型 | `string` | |
| label | 表单标签 | `string` | |
| config | 字段配置数组 | [FieldBase](#fieldbase)[] | |

### FieldBase

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 字段类型 | `string` | |
| widget | 组件类型 | `string` | |
| field | 字段名称 | `string` | |
| label | 显示标签 | `string` | |
| formItemProps | 表单项属性 | `Omit<FormItemProps, 'initialValue'>` | |
| widgetProps | 组件属性 | `Omit<Record<string,any>, 'value'\|'onChange'>` | |
| defaultValue | 默认值 | `any` | |
| description | 描述 | `string` | |
| dependsOn | 依赖字段 | `{ field: string; value: any \| ((value: any) => boolean) }` | |
| toStorage | 值转换为存储格式 | `(value: any, field?: FieldBase) => any` | |
| fromStorage | 存储值转换为表单格式 | `(value: any, field?: FieldBase) => any` | |

### WidgetMap

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| [key] | 组件映射 | `ElementType<any>` | |

### ExecutionHistory

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| nodeId | 节点ID | `string` | |
| nodeName | 节点名称 | `string` | |
| nodeType | 节点类型 | `string` | |
| pluginNodeType | 插件节点类型 | [PluginNodeType](#pluginnodetype) | |
| status | 节点状态 | [NodeStatus](#nodestatus) | |
| startTime | 开始时间 | `Date` | |
| endTime | 结束时间 | `Date` | |
| duration | 执行时长(毫秒) | `number` | |
| contextBefore | 执行前上下文 | `Record<string, any>` | |
| contextAfter | 执行后上下文 | `Record<string, any>` | |
| event | 事件信息 | [FlowEvent](#floweve) | |
| conditions | 规则条件 | `TopLevelCondition` | |
| eventResult | 事件结果 | `any` | |
| timestamp | 记录时间戳 | `Date` | |
| engineResult | 引擎结果 | `any` | |
| decision | 分支决策信息 | [Decision](#decision) | |
| is_end_node | 是否结束节点 | `boolean` | |
| iteration_mode | 迭代模式 | [IterationMode](#iterationmode) | |
| iteration_count | 迭代次数 | `number` | |
| parallel_strategy | 并行策略 | [ParallelStrategy](#parallelstrategy) | |
| parallel_edges | 并行路径 | `Array<{ target: string; conditions: TopLevelCondition; isDefault: boolean }>` | |

### NodeStatus

| 类型 | 说明 |
| --- | --- |
| pending | 待执行 |
| waiting | 等待中 |
| running | 运行中 |
| success | 成功 |
| failed | 失败 |

### ParallelStrategy

| 类型 | 说明 |
| --- | --- |
| all | 所有子节点都成功才算成功 |
| any | 任意子节点成功就算成功 |

### IterationMode

| 类型 | 说明 |
| --- | --- |
| 1 | 所有子节点成功才算成功 |
| 2 | 任意子节点成功就算成功 |
| 3 | 任意子节点失败就算失败 |

### FlowEvent

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 事件类型 | `string` | |
| params | 事件参数 | `any` | |

### Decision

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| selectPath | 选中的路径 | `string` | |
| conditions | 决策条件 | `TopLevelCondition` | |
| isDefault | 是否默认路径 | `boolean` | |
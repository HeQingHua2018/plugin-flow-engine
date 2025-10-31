---
title: Type 模块
toc: menu
order: 3
---

# Type 模块

## 模块概述
集中维护 Core 与 UI 包共享的 TypeScript 类型，降低跨包耦合，鼓励按需子路径引入，保持各包边界清晰。

- 子路径引入：
  - `@plugin-flow-engine/type/common`
  - `@plugin-flow-engine/type/core`
  - `@plugin-flow-engine/type/ui`
- 完整引入：`@plugin-flow-engine/type`

## 安装

```bash
pnpm add @plugin-flow-engine/type
```

## common.ts 类型

### FieldBase
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `type` | `string` | 是 | - | 控件标识（优先级低于widget） |
| `widget` | `string` | 否 | - | 控件标识（如 Antd 或自定义） |
| `field` | `string` | 是 | - | 字段唯一键 |
| `label` | `string` | 是 | - | 字段显示名称 |
| `formItemProps` | `Omit<FormItemProps, 'initialValue'>` | 否 | - | 传递给表单项的属性（依赖 antd 的 `FormItemProps` 类型） |
| `widgetProps` | `Omit<Record<string, any>, 'value' \| 'onChange'>` | 否 | - | 传递给控件组件的属性（禁止传递 `value`/`onChange` 组件内部已内置、防止冲突） |
| `defaultValue` | `any` | 否 | - | 默认值 |
| `description` | `string` | 否 | - | 字段描述 |
| `dependsOn` | `{ field: string; value: any \| ((value: any) => boolean) }` | 否 | - | 依赖条件：当指定字段满足值或断言时生效 |
| `[key: string]` | `any` | 否 | - | 扩展字段 |

### Schema
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `type` | `string` | 是 | - | 表单/配置的类型标识 |
| `label` | `string` | 是 | - | 表单/配置显示名称 |
| `config` | `Array<`[`FieldBase`](#fieldbase)`>` | 是 | - | 字段配置列表 |

### WidgetMap
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `[key: string]` | `ElementType<any>` | 否 | - | 组件映射表（键到组件的映射） |

### NodeConfig
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `schema` | [`Schema`](#schema) | 是 | - | 节点配置的 Schema |
| `widgets` | [`WidgetMap`](#widgetmap) | 否 | - | 自定义控件映射 |
| `[key: string]` | `any` | 否 | - | 其他扩展配置 |

## core.ts 类型

### BuiltInPluginNodeType
- 类型：`keyof typeof BuiltInPluginNodeTypes`
- 取值：`Trigger` | `Action` | `Branch` | `Parallel` | `Iteration` | `Merge` | `End`

### PluginNodeType
- 类型：`LiteralUnion<`[`BuiltInPluginNodeType`](#builtinpluginnodetype)`, string>`
- 描述：既支持内置节点类型的智能提示，也保持字符串开放以兼容扩展。

### NodeStatus (enum)
- 取值：`pending` | `running` | `success` | `failed`

### EdgeType (enum) 
- 取值：`in` | `out` | `all`
- 主要用于core插件根据节点id获取下一节点时使用，`in` 表示当前节点输入边，`out` 表示当前节点输出边，`all` 表示所有边包括输入边和输出边。<br/>不是@xyflow/react中边的类型

### ParallelStrategy (enum)
- 取值：`all` | `any`
- 描述：并行节点策略，`all` 表示所有并行分支成功、则当前节点成功，`any` 表示任一并行分支成功、则当前节点成功。

### IterationMode (enum)
- 取值：`1`（全部成功） | `2`（任一成功） | `3`（任一失败）
- 描述：迭代节点迭代策略，`1` 表示所有迭代成功、则当前节点成功，`2` 表示任意一个迭代成功、则当前节点成功，`3` 表示任意一个迭代失败、则当前节点失败。

### DefaultNodeConfig
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `conditions` | `TopLevelCondition` | 否 | - | 运行条件（规则引擎） |
| `event` | `Event` | 否 | - | 触发事件（规则引擎） |
| `iteration_count` | `number` | 否 | - | 迭代次数 |
| `iteration_mode` | `IterationMode | string` | 否 | - | 迭代策略 |
| `parallel_strategy` | `ParallelStrategy | string` | 否 | - | 并行策略 |
| `[key: string]` | `any` | 否 | - | 其他扩展配置 |

### NodeData
- 泛型：`NodeData<TConfig = DefaultNodeConfig>`

| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `name` | `string` | 是 | - | 节点显示名称 |
| `pluginNodeType` | [`PluginNodeType`](#pluginnodetype) | 是 | - | 节点类型（含内置与扩展） |
| `config` | `TConfig` | 否 | - | 节点业务配置 |
| `[key: string]` | `any` | 否 | - | 其他扩展字段 |

### EdgeData
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `conditions` | `TopLevelCondition` | 否 | - | 边选择条件 |
| `isDefault` | `boolean` | 否 | - | 是否为默认边 |
| `priority` | `number` | 否 | - | 边优先级 |
| `[key: string]` | `any` | 否 | - | 其他扩展字段 |

- 分支节点出来的边配置，`conditions` 表示边选择条件，`isDefault` 表示是否为默认边，`priority` 表示边优先级。

### Variable
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `type` | `string` | 是 | - | 变量类型标识 |
| `source` | `string` | 是 | - | 变量来源（如 input/context） |
| `description` | `string` | 否 | - | 变量描述 |
| `default` | `any` | 否 | - | 默认值 |

### ContextConfig
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `variables` | `Record<string, `[`Variable`](#variable)`>` | 是 | - | 上下文变量定义 |

### ExecutionContext
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `variables` | `Record<string, any>` | 是 | - | 运行时上下文变量 |

### GlobalConfig
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `timeout` | `number` | 否 | - | 全局超时（毫秒） |
| `max_depth` | `number` | 否 | - | 最大执行深度 |
| `[key: string]` | `any` | 否 | - | 其他扩展配置 |

### ExecutionHistory
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `nodeId` | `string` | 是 | - | 节点 ID |
| `nodeName` | `string` | 是 | - | 节点名称 |
| `nodeType` | `string` | 是 | - | 节点分类（如内核/插件） |
| `pluginNodeType` | [`PluginNodeType`](#pluginnodetype) | 是 | - | 插件节点类型 |
| `status` | `NodeStatus | string` | 是 | - | 运行状态 |
| `startTime` | `Date` | 否 | - | 开始时间 |
| `endTime` | `Date` | 否 | - | 结束时间 |
| `duration` | `number` | 否 | - | 耗时（毫秒） |
| `contextBefore` | `Record<string, any>` | 否 | - | 执行前上下文快照 |
| `contextAfter` | `Record<string, any>` | 否 | - | 执行后上下文快照 |
| `event` | `Event` | 否 | - | 触发事件 |
| `conditions` | `TopLevelCondition` | 否 | - | 判断条件 |
| `eventResult` | `any` | 否 | - | 事件执行结果 |
| `timestamp` | `Date` | 是 | - | 记录时间戳 |
| `engineResult` | `any` | 否 | - | 引擎返回结果 |
| `decision` | `{ selectPath?: string; conditions?: TopLevelCondition; isDefault?: boolean }` | 否 | - | 决策信息（分支节点特有） |
| `is_end_node` | `boolean` | 否 | - | 是否结束节点 |
| `parallel_strategy` | `ParallelStrategy | string` | 否 | - | 并行策略（并行节点特有） |
| `parallel_edges` | `Array<{ target: string; conditions: TopLevelCondition; isDefault: boolean }>` | 否 | - | 并行分支信息 |

### FlowData
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `flow` | `object` | 是 | - | 流程基本信息（见下表） |
| `context` | [`ContextConfig`](#contextconfig) | 是 | - | 上下文配置 |
| `nodes` | `Array<`[`Node`](#nodedata)`>` | 是 | - | 节点列表 |
| `edges` | `Array<`[`Edge`](#edgedata)`>` | 是 | - | 边列表 |
| `global_config` | [`GlobalConfig`](#globalconfig) | 是 | - | 全局配置 |

#### FlowData.flow 详情
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `id` | `string` | 是 | - | 流程 ID |
| `name` | `string` | 是 | - | 名称 |
| `version` | `string` | 是 | - | 版本 |
| `description` | `string` | 是 | - | 描述 |
| `category` | `string` | 是 | - | 分类 |
| `enable` | `boolean` | 是 | - | 是否启用 |
| `create_date` | `string` | 是 | - | 创建时间 |
| `update_date` | `string` | 是 | - | 更新时间 |
| `auto` | `boolean` | 否 | - | 是否自动触发 |

## ui.ts 类型

### AntdWidgetKey
- 类型：`LiteralUnion<`[`AntdWidgetKeys`](#antdwidgetkeys)` 的值, string>`

### AntdWidgetKeys（常量）
- 取值列表：
  - `ant_Input`, `ant_Input.Password`, `ant_Input.TextArea`, `ant_Input.Search`
  - `ant_InputNumber`, `ant_Select`, `ant_Checkbox`, `ant_Checkbox.Group`
  - `ant_Radio.Group`, `ant_Switch`, `ant_DatePicker`, `ant_DatePicker.RangePicker`
  - `ant_TimePicker`, `ant_Slider`, `ant_Cascader`, `ant_TreeSelect`
  - `ant_Rate`, `ant_AutoComplete`, `ant_Mentions`, `ant_Upload`
  - `ant_Transfer`, `ant_ColorPicker`

### BaseWidgetProps
- 泛型：`BaseWidgetProps<T>`

| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `value` | `T` | 是 | - | 当前值 |
| `onChange` | `(value: T) => void` | 是 | - | 变更回调 |
| `[key: string]` | `any` | 否 | - | 扩展属性 |

### WidgetProps
- 泛型：`WidgetProps<T, U = object>`
- 组合类型：[`BaseWidgetProps`](#basewidgetprops) 与 `U` 的交叉类型

### Option
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `value` | `string` | 是 | - | 选项值 |
| `label` | `string` | 是 | - | 选项标签 |

### DynamicConfigFormRef
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `form` | `any` | 是 | - | 表单实例（避免直接耦合 antd 类型） |

### DynamicFormProps
| 字段名 | 字段类型 | 是否必填 | 默认值 | 描述 |
|---|---|---|---|---|
| `schema` | [`Schema`](#schema) | 是 | - | 表单配置 Schema（来自 common） |
| `value` | `Record<string, any>` | 是 | - | 当前值对象 |
| `isValidate` | `boolean` | 否 | - | 变更时是否校验 |
| `onChange` | `(value: Record<string, any>) => void` | 否 | - | 值变更回调 |
| `onSave` | `(value: Record<string, any>) => void` | 否 | - | 保存回调 |
| `onValidateSave` | `(value: Record<string, any>) => void` | 否 | - | 校验后保存回调 |
| `showButtons` | `boolean` | 否 | - | 是否显示底部按钮 |
| `renderButton` | `() => any` | 否 | - | 自定义按钮渲染（ReactNode） |
| `[key: string]` | `any` | 否 | - | 其他扩展属性 |

## 示例

```ts | pure
import type { FlowData } from '@plugin-flow-engine/type/core';

const flowData: FlowData = {
  flow: {
    id: 'demo',
    name: 'Demo',
    version: '1.0.0',
    description: '',
    category: 'demo',
    enable: true,
    create_date: '',
    update_date: '',
  },
  context: { variables: {} },
  nodes: [],
  edges: [],
  global_config: {},
};
```

```ts | pure
import type { WidgetProps } from '@plugin-flow-engine/type/ui';

// 使用 WidgetProps 约束一个自定义控件的 props 类型
type JsonEditorProps = WidgetProps<any>;

const sampleProps: JsonEditorProps = {
  value: { a: 1 },
  onChange: (v) => console.log(v),
};
```

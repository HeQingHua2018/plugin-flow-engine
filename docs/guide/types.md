---
title: 类型速查表
order: 4
toc: menu
---

# 类型速查表

- 统一查看并交叉链接流程、插件、控件相关类型。
- 所有类型名沿用源码的英文标识，中文为释义说明。

## 索引
- [类型速查表](#类型速查表)
  - [索引](#索引)
  - [FlowDefinition](#flowdefinition)
  - [GlobalConfig](#globalconfig)
  - [Node](#node)
  - [Edge](#edge)
  - [ExecutionContext](#executioncontext)
  - [ContextConfig](#contextconfig)
  - [Variable](#variable)
  - [ExecutionHistory](#executionhistory)
  - [NodeStatus](#nodestatus)
  - [EdgeType](#edgetype)
  - [ParallelStrategy](#parallelstrategy)
  - [IterationMode](#iterationmode)
  - [Schema](#schema)
  - [Field](#field)
  - [NodeConfig](#nodeconfig)
  - [BaseWidgetProps](#basewidgetprops)
  - [WidgetProps](#widgetprops)
  - [DynamicConfigForm](#dynamicconfigform)
    - [DynamicConfigFormRef](#dynamicconfigformref)
  - [NodePlugin](#nodeplugin)
  - [PluginExecutionEngine](#pluginexecutionengine)
  - [OperatorFn](#operatorfn)
  - [TopLevelCondition](#toplevelcondition)
  - [Condition](#condition)
  - [Event](#event)
## FlowDefinition
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `flow.id` | `string` | 是 | 流程唯一标识 |
| `flow.name` | `string` | 是 | 流程名称 |
| `flow.version` | `string` | 是 | 版本号 |
| `flow.description` | `string` | 是 | 描述信息 |
| `flow.category` | `string` | 是 | 分类 |
| `flow.enable` | `boolean` | 是 | 是否启用 |
| `flow.create_date` | `string` | 是 | 创建日期 |
| `flow.update_date` | `string` | 是 | 更新日期 |
| `flow.auto` | `boolean` | 否 | 是否自动执行 |
| `context` | [ContextConfig](#contextconfig) | 是 | 上下文配置 |
| `nodes` | [Node[]](#node) | 是 | 节点列表 |
| `edges` | [Edge[]](#edge) | 是 | 边列表 |
| `global_config` | [GlobalConfig](#globalconfig) | 是 | 全局配置 |

## GlobalConfig
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `timeout` | `number` | 否 | 单次流程执行超时（毫秒） |
| `max_depth` | `number` | 否 | 最大执行深度（防递归/死循环） |
| `[key:string]` | `any` | 是 | 其他扩展配置 |

## Node
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 是 | 节点唯一标识 |
| `name` | `string` | 是 | 节点显示名称 |
| `type` | `string` | 是 | 节点类型标识（与插件 `nodeType` 对齐） |
| `config.conditions` | [TopLevelCondition](#toplevelcondition)| 否 | 执行条件（json-rules-engine） |
| `config.event` | [Event](#event)| 否 | 事件执行（动作） |
| `config.iteration_count` | `number` | 否 | 迭代次数（迭代节点） |
| `config.iteration_mode` | [IterationMode](#iterationmode)| 否 | 迭代模式 |
| `config.parallel_strategy` | [ParallelStrategy](#parallelstrategy)| 否 | 并行成功策略 |
| `config[key:string]` | `any` | 是 | 其他自定义配置 |

## Edge
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 是 | 边唯一标识 |
| `source` | `string` | 是 | 源节点 ID |
| `target` | `string` | 是 | 目标节点 ID |
| `label` | `string` | 否 | 显示标签 |
| `conditions` | [TopLevelCondition](#toplevelcondition)| 否 | 分支选择条件 |
| `isDefault` | `boolean` | 否 | 默认分支（其他条件不满足时） |
| `priority` | `number` | 否 | 优先级（越小越高） |

## ExecutionContext
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `variables` | `Record<string, any>` | 是 | 运行时上下文变量字典 |

## ContextConfig
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `variables` | `Record<string, Variable>` | 是 | 流程用到的变量定义字典 |

## Variable
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `type` | `string` | 是 | 变量类型：string/number/boolean/object 等 |
| `source` | `string` | 是 | 变量来源：context/input/output 等 |
| `description` | `string` | 否 | 描述 |
| `default` | `any` | 否 | 默认值 |

## ExecutionHistory
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `nodeId` | `string` | 是 | 节点 ID |
| `nodeName` | `string` | 是 | 节点名称 |
| `nodeType` | `string` | 是 | 节点类型 |
| `status` | [NodeStatus](#nodestatus) | 是 | 节点状态 |
| `startTime` | `Date` | 否 | 开始时间 |
| `endTime` | `Date` | 否 | 结束时间 |
| `duration` | `number` | 否 | 持续时间（毫秒） |
| `contextBefore` | `Record<string, any>` | 否 | 执行前上下文快照 |
| `contextAfter` | `Record<string, any>` | 否 | 执行后上下文快照 |
| `event` | [Event](#event)| 否 | 触发事件 |
| `conditions` | [TopLevelCondition](#toplevelcondition)| 否 | 执行条件 |
| `eventResult` | `any` | 否 | 事件执行结果 |
| `timestamp` | `Date` | 是 | 记录时间 |
| `engineResult` | `any` | 否 | 引擎执行结果 |
| `decision.selectPath` | `string` | 否 | 分支决策路径 |
| `decision.conditions` | [TopLevelCondition](#toplevelcondition)| 否 | 分支条件 |
| `decision.isDefault` | `boolean` | 否 | 是否默认分支 |
| `is_end_node` | `boolean` | 否 | 是否结束节点 |
| `parallel_strategy` | [ParallelStrategy](#parallelstrategy)| 否 | 并行成功策略 |
| `parallel_edges` | `Array<{ target: string; conditions: TopLevelCondition; isDefault: boolean }>` | 否 | 并行节点出边配置 |

## NodeStatus
| 枚举值 | 说明 |
| --- | --- |
| `pending` | 待处理 |
| `running` | 运行中 |
| `success` | 成功 |
| `failed` | 失败 |

## EdgeType
| 枚举值 | 说明 |
| --- | --- |
| `in` | 入边（指向当前节点） |
| `out` | 出边（从当前节点发出） |
| `all` | 所有边 |

## ParallelStrategy
| 枚举值 | 说明 |
| --- | --- |
| `all` | 所有子节点都成功视为成功 |
| `any` | 任一子节点成功视为成功 |

## IterationMode
| 枚举值 | 说明 |
| --- | --- |
| `ALL_SUCCESS` | 所有子节点成功后继续迭代 |
| `ANY_SUCCESS` | 任一子节点成功后继续迭代 |
| `ANY_FAILURE` | 任一子节点失败后继续迭代 |

## Schema
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `type` | `string` | 是 | 节点 key（保持唯一，和插件 `nodeType` 一致） |
| `label` | `string` | 是 | 节点名 |
| `config` | [Field[]](#field) | 是 | 配置项列表 |

## Field
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `type` | `string` | 是 | 控件类型键（如 `ant_Input`、`ant_DatePicker.RangePicker`） |
| `widget` | `string` | 否 | 自定义控件映射键（优先级高于 `type`） |
| `field` | `string` | 是 | 字段名称 |
| `label` | `string` | 是 | 字段标签 |
| `formItemProps` | `Omit<FormItemProps, 'initialValue'>` | 否 | 表单项属性（Antd FormItemProps，不含 `initialValue`） |
| `widgetProps` | `Record<string, any>` | 否 | 控件属性（如 `options`、`placeholder`） |
| `defaultValue` | `any` | 否 | 默认值 |
| `description` | `string` | 否 | 字段描述 |
| `dependsOn.field` | `string` | 否 | 依赖字段名 |
| `dependsOn.value` | `any \| (v: any) => boolean` | 是 | 显隐条件 |
| `[key: string]` | `any` | 是 | 扩展属性 |

## NodeConfig
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `schema` | [Schema](#schema) | 是 | 表单 Schema |
| `widgets` | `Record<string, React.ElementType>` | 否 | 节点级控件映射（可覆盖/补充全局） |
| `[key]` | `any` | 是 | 其他扩展字段 |

## BaseWidgetProps
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `value` | `T` | 是 | 当前值（受控） |
| `onChange` | `(value: T) => void` | 是 | 值变化回调（受控） |
| `[key]` | `any` | 是 | 其他额外属性 |

## WidgetProps
| 定义 | 说明 |
| --- | --- |
| `WidgetProps<T, U = object> = BaseWidgetProps<T> & U` | 在基础受控属性上扩展具体控件所需的额外 props |

## DynamicConfigForm
| 属性 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `schema` | [Schema](#schema) | 是 | 节点表单 Schema（字段配置） |
| `value` | `Record<string, any>` | 是 | 当前表单值（受控） |
| `isValidate` | `boolean` | 否 | 是否校验表单值（点击保存时触发校验） |
| `onChange` | `(value: Record<string, any>) => void`| 否 | 值变化回调（受控） |
| `onSave` | `(value: Record<string, any>) => void`| 否 | 点击保存按钮触发（未校验） |
| `onValidateSave` | `(value: Record<string, any>) => void`| 否 | 点击校验并保存按钮触发（已校验） |
| `showButtons` | `boolean` | 否 | 是否显示内置保存/校验按钮 |
| `renderButton` | `() => ReactNode`| 否 | 自定义按钮渲染（提供则优先生效） |
| `[key: string]` | `any` | 是 | 其他额外 props |

> 说明：以上为组件 `DynamicConfigForm` 的 Props，对应类型定义 `DynamicFormProps`，具体字段含义与 `Schema`/`Field` 联动。

### DynamicConfigFormRef
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `form` | `FormInstance<any>` | 是 | 暴露内部 Form 实例，便于外部自定义按钮与交互 |

## NodePlugin
| 核心字段/方法 | 类型 | 说明 |
| --- | --- | --- |
| `nodeType` | `string` | 节点类型标识（唯一） |
| `nodeTypeName` | `string` | 节点类型名称 |
| `getNodeFormConfig()` | `() => NodeConfig \| null` | 返回节点的表单配置与可选控件映射 |
| `executeNode(...)` | `(...) => Promise<boolean>` | 执行节点核心逻辑，返回是否成功 |
| `getExecuteNodeStatus(...)` | `(...) => Promise<string \| null>` | 可选：自定义执行状态推断 |
| `shouldExecuteNode(...)` | `(...) => Promise<boolean>` | 可选：决定是否执行当前节点 |
| `invokeEvent(...)` | `(...) => Promise<boolean>` | 可选：自定义事件执行逻辑 |
| `getNextNodeId(...)` | `(...) => Promise<string \| null>` | 可选：获取下一节点 ID |
| `onNodeComplete(...)` | `(...) => Promise<void>` | 可选：节点执行完成后的回调 |

## PluginExecutionEngine
| 常用方法 | 类型 | 说明 |
| --- | --- | --- |
| `initialize(flow, context)` | `(FlowDefinition, ExecutionContext) => void` | 初始化引擎并验证流程定义 |
| `executeFlow(startNodeId)` | `(startNodeId: string) => Promise<{ status: boolean; message: string; variables: Record<string, any>; errorInfo: any; executionReport: any }>` | 执行流程（默认从 `trigger` 节点开始），返回执行报告 |
| `getExecutionHistory()` | `() => ExecutionHistory[]` | 获取执行历史 |
| `getPluginManager()` | `() => PluginManager` | 获取插件管理器 |
| `updateContext(context)` | `(ExecutionContext) => void` | 更新执行上下文（替代 `updateVariables`） |
| `dispose()` | `() => void` | 释放资源 |

<!-- > 说明：引擎的具体公开 API 以源码为准，以上为常见方法的语义说明，便于约束与测试。 -->

## OperatorFn
| 签名 | 类型 | 说明 |
| --- | --- | --- |
| `OperatorFn` | `(factValue: any, jsonValue: any, almanac: any) => boolean` | 规则操作符函数签名，用于 `json-rules-engine` 的扩展操作符 |


## TopLevelCondition
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `all` | [Condition[]](#condition)| 否 | 全部条件满足时触发 |
| `any` | [Condition[]](#condition)| 否 | 任意条件满足时触发 |


## Condition
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `fact` | `string` | 是 | 变量名（来自 `ExecutionContext.variables`） |
| `operator` | `string` | 是 | 操作符名称（含内置/自定义，见 operators 文档） |
| `value` | `any` | 否 | 比较值（支持对象结构） |
| `path` | `string` | 否 | 可选：从对象中取子路径，如 `user.age` |

## Event
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `type` | `string` | 是 | 事件类型，用于命中规则时的标识 |
| `params` | `any` | 否 | 事件参数（可选）
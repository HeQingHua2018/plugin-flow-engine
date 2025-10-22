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
  - [NodePlugin](#nodeplugin)
  - [PluginExecutionEngine](#pluginexecutionengine)
  - [OperatorFn](#operatorfn)
  - [TopLevelCondition](#toplevelcondition)
  - [Condition](#condition)
  - [Event](#event)

## FlowDefinition
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `flow.id` | `string` | 流程唯一标识 |
| `flow.name` | `string` | 流程名称 |
| `flow.version` | `string` | 版本号 |
| `flow.description` | `string` | 描述信息 |
| `flow.category` | `string` | 分类 |
| `flow.enable` | `boolean` | 是否启用 |
| `flow.create_date` | `string` | 创建日期 |
| `flow.update_date` | `string` | 更新日期 |
| `flow.auto` | `boolean?` | 是否自动执行 |
| `context` | [ContextConfig](#contextconfig) | 上下文配置 |
| `nodes` | [Node[]](#node) | 节点列表 |
| `edges` | [Edge[]](#edge) | 边列表 |
| `global_config` | [GlobalConfig](#globalconfig) | 全局配置 |

## GlobalConfig
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `timeout` | `number?` | 单次流程执行超时（毫秒） |
| `max_depth` | `number?` | 最大执行深度（防递归/死循环） |
| `[key]` | `any` | 其他扩展配置 |

## Node
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 节点唯一标识 |
| `name` | `string` | 节点显示名称 |
| `type` | `string` | 节点类型标识（与插件 `nodeType` 对齐） |
| `config.conditions` | [TopLevelCondition](#toplevelcondition)? | 执行条件（json-rules-engine） |
| `config.event` | [Event](#event)? | 事件执行（动作） |
| `config.iteration_count` | `number?` | 迭代次数（迭代节点） |
| `config.iteration_mode` | [IterationMode](#iterationmode)? | 迭代模式 |
| `config.parallel_strategy` | [ParallelStrategy](#parallelstrategy)? | 并行成功策略 |
| `config[...]` | `any` | 其他自定义配置 |

## Edge
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `string` | 边唯一标识 |
| `source` | `string` | 源节点 ID |
| `target` | `string` | 目标节点 ID |
| `label` | `string?` | 显示标签 |
| `conditions` | [TopLevelCondition](#toplevelcondition)? | 分支选择条件 |
| `isDefault` | `boolean?` | 默认分支（其他条件不满足时） |
| `priority` | `number?` | 优先级（越小越高） |

## ExecutionContext
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `variables` | `Record<string, any>` | 运行时上下文变量字典 |

## ContextConfig
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `variables` | `Record<string, Variable>` | 流程用到的变量定义字典 |

## Variable
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `string` | 变量类型：string/number/boolean/object 等 |
| `source` | `string` | 变量来源：context/input/output 等 |
| `description` | `string?` | 描述 |
| `default` | `any?` | 默认值 |

## ExecutionHistory
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `nodeId` | `string` | 节点 ID |
| `nodeName` | `string` | 节点名称 |
| `nodeType` | `string` | 节点类型 |
| `status` | [NodeStatus](#nodestatus) | 节点状态 |
| `startTime` | `Date?` | 开始时间 |
| `endTime` | `Date?` | 结束时间 |
| `duration` | `number?` | 持续时间（毫秒） |
| `contextBefore` | `Record<string, any>?` | 执行前上下文快照 |
| `contextAfter` | `Record<string, any>?` | 执行后上下文快照 |
| `event` | [Event](#event)? | 触发事件 |
| `conditions` | [TopLevelCondition](#toplevelcondition)? | 执行条件 |
| `eventResult` | `any?` | 事件执行结果 |
| `timestamp` | `Date` | 记录时间 |
| `engineResult` | `any?` | 引擎执行结果 |
| `decision.selectPath` | `string?` | 分支决策路径 |
| `decision.conditions` | [TopLevelCondition](#toplevelcondition)? | 分支条件 |
| `decision.isDefault` | `boolean?` | 是否默认分支 |
| `is_end_node` | `boolean?` | 是否结束节点 |
| `parallel_strategy` | [ParallelStrategy](#parallelstrategy)? | 并行成功策略 |
| `parallel_edges` | `Array<{ target: string; conditions?: TopLevelCondition; isDefault?: boolean }>?` | 并行节点出边配置 |

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
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `string` | 节点 key（保持唯一，和插件 `nodeType` 一致） |
| `label` | `string` | 节点名 |
| `config` | [Field[]](#field) | 配置项列表 |

## Field
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `string` | 控件类型键（如 `ant_Input`、`ant_DatePicker.RangePicker`） |
| `widget` | `string?` | 自定义控件映射键（优先级高于 `type`） |
| `field` | `string` | 字段名称 |
| `label` | `string` | 字段标签 |
| `formItemProps` | `Record<string, any>?` | 表单项属性（除 `initialValue`） |
| `widgetProps` | `Record<string, any>?` | 控件属性（如 `options`、`placeholder`） |
| `defaultValue` | `any?` | 默认值 |
| `description` | `string?` | 字段描述 |
| `dependsOn.field` | `string?` | 依赖字段名 |
| `dependsOn.value` | `any | (v: any) => boolean` | 显隐条件 |

## NodeConfig
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `schema` | [Schema](#schema) | 表单 Schema |
| `widgets` | `Record<string, React.ElementType>?` | 节点级控件映射（可覆盖/补充全局） |
| `[key]` | `any` | 其他扩展字段 |

## BaseWidgetProps
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `T` | 当前值（受控） |
| `onChange` | `(value: T) => void` | 值变化回调（受控） |
| `[key]` | `any` | 其他额外属性 |

## WidgetProps
| 定义 | 说明 |
| --- | --- |
| `WidgetProps<T, U = object> = BaseWidgetProps<T> & U` | 在基础受控属性上扩展具体控件所需的额外 props |

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
| `initialize(flow, context)` | `(FlowDefinition, ExecutionContext) => void` | 初始化引擎 |
| `execute()` | `() => Promise<boolean>` | 执行流程（实际实现可能以具体方法名暴露） |
| `getExecutionHistory()` | `() => ExecutionHistory[]` | 获取执行历史 |
| `getPluginManager()` | `() => PluginManager` | 获取插件管理器 |
| `updateVariables(vars)` | `(Record<string, any>) => void` | 更新上下文变量 |
| `dispose()` | `() => void` | 释放资源 |

<!-- > 说明：引擎的具体公开 API 以源码为准，以上为常见方法的语义说明，便于约束与测试。 -->

## OperatorFn
| 签名 | 类型 | 说明 |
| --- | --- | --- |
| `OperatorFn` | `(factValue: any, jsonValue: any, almanac?: any) => boolean` | 规则操作符函数签名，用于 `json-rules-engine` 的扩展操作符 |


## TopLevelCondition
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `all` | [Condition[]](#condition)? | 全部条件满足时触发 |
| `any` | [Condition[]](#condition)? | 任意条件满足时触发 |


## Condition
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `fact` | `string` | 变量名（来自 `ExecutionContext.variables`） |
| `operator` | `string` | 操作符名称（含内置/自定义，见 operators 文档） |
| `value` | `any?` | 比较值（支持对象结构） |
| `path` | `string?` | 可选：从对象中取子路径，如 `user.age` |

## Event
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `string` | 事件类型，用于命中规则时的标识 |
| `params` | `any?` | 事件参数（可选）
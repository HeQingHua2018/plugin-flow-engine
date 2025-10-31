---
title: Core 模块
toc: menu
order: 1
---
# Core 模块

## 模块概述
Core 核心包提供插件化的流程执行能力，内置插件管理、流程执行引擎、流程历史记录、事件调用、中立的上下文管理、自定义规则操作符扩展，以及在 React 中即插即用的 Hook。该模块不依赖 UI，仅聚焦于与流程执行相关的核心逻辑。

## 安装

```bash
pnpm add @plugin-flow-engine/core @plugin-flow-engine/type
```
如需在 React 中使用，可同时安装：
```bash
pnpm add react react-dom @xyflow/react
```

## 快速上手

```ts
import { PluginManagerInstance, BaseNodePlugin, useFlowEngine } from '@plugin-flow-engine/core';
import type { FlowData } from '@plugin-flow-engine/type/core';

class MyActionPlugin extends BaseNodePlugin {
  pluginNodeType = 'MyAction' as any; // 自定义节点类型标识
  pluginNodeTypeName = '我的动作';
  async executeNode(node, engine, historyItem) {
    // 可选：按节点条件、事件调用默认行为执行（继承基类）
    return await super.executeNode(node, engine, historyItem);
  }
}

PluginManagerInstance().registerPlugin(new MyActionPlugin());

const flowData: FlowData = {
  flow: { id: 'demo', name: 'Demo', version: '1.0.0', enable: true, description: '', category: 'demo', create_date: '', update_date: '' },
  context: { variables: {} },
  nodes: [
    { id: 'trigger', type: 'Trigger', position: { x: 0, y: 0 }, data: { name: '触发', pluginNodeType: 'Trigger' } },
    { id: 'action', type: 'Action', position: { x: 200, y: 0 }, data: { name: '动作', pluginNodeType: 'MyAction', config: {} } },
    { id: 'end', type: 'End', position: { x: 400, y: 0 }, data: { name: '结束', pluginNodeType: 'End' } },
  ],
  edges: [
    { id: 'e1', source: 'trigger', target: 'action', type: 'basic_edge', data: {} },
    { id: 'e2', source: 'action', target: 'end', type: 'basic_edge', data: {} },
  ],
  global_config: {},
};

const { executeFlow, executionHistory } = useFlowEngine({ flowData, initialVariables: {} });
await executeFlow();
console.log(executionHistory);
```

```ts | pure
// 类型引入示例：按需使用子路径
import type { FlowData, Node, Edge, NodeStatus } from '@plugin-flow-engine/type/core';
const status: NodeStatus = NodeStatus.RUNNING;
```

## 核心能力
- 插件管理：注册/获取节点插件，统一管理生命周期与节点配置。
- 流程执行引擎：按节点与边推进，评估条件与事件，维护上下文与监控报告。
- 流程历史记录：标准化的历史项结构，支持历史更新事件。
- 事件管理：统一调用“组件实例/全局方法（global）/window 方法”，并推动上下文更新。
- 流程上下文管理：安全、可监听的上下文变量读写。
- 自定义规则操作符：在 `json-rules-engine` 上注入增强操作符。
- React Hook：`useFlowEngine` 快速集成，提供执行与状态管理。

## 子系统说明

### 1. 插件管理（PluginManager）
- 入口与单例：`PluginManagerInstance()` 获取全局插件管理器。
- 注册插件：`registerPlugin(plugin)` 或 `registerAllPlugin([...])`。
- 获取插件：`getPlugin(pluginNodeType)`，不存在会抛错。
- 节点配置：`getNodeFormConfig(pluginNodeType)` 返回插件的表单配置（schema）。
- 内置插件：默认注册 `Trigger/Action/Branch/Parallel/Iteration/Merge/End` 等节点插件。
- 类型清单：`getAllPluginNodeTypes()` 返回 `{ value, label }` 列表。

#### 如何自定义插件
- 扩展基类：继承 `BaseNodePlugin` 并设置 `pluginNodeType` 与 `pluginNodeTypeName`（两者需与表单 `schema.type` 和实际节点用途保持一致）。
- 表单配置（可选）：实现 `getNodeFormConfig()` 返回 `NodeConfig`，UI 模块会据此渲染配置表单。
- 节点执行：实现 `executeNode(node, engine)`，可使用 `engine.evaluateRule(...)` 评估条件与 `engine.evaluateMethod(...)` 调用事件；返回对象可包含 `success`、`message`、`eventResult` 等。
- 注册：在应用启动处调用 `PluginManagerInstance().registerPlugin(...)` 或 `registerAllPlugin([...])` 完成注入。
- 绑定节点：在流程定义的节点 `data.pluginNodeType` 设置为你的插件类型（例如 `'MyNode'`）。

BaseNodePlugin 基类
```ts

import {
  type Edge,
  type Node,
  type ExecutionHistory,
  type PluginNodeType,
  NodeStatus,
} from "@plugin-flow-engine/type/core";
import { type NodeConfig } from "@plugin-flow-engine/type/common";
import type { PluginExecutionEngine } from "@plugin-flow-engine/core";
import { NodePlugin } from "./NodePlugin";

/**
 * 节点插件基类
 * 实现了NodePlugin接口的通用逻辑，为各种具体节点类型提供统一的基础实现
 * 具体节点插件通过继承此类并重写特定方法来实现差异化的节点行为
 */
export abstract class BaseNodePlugin implements NodePlugin {
  /**
   * 插件节点类型标识符
   * 由具体子类实现
   */
  abstract pluginNodeType: PluginNodeType;
  /**
   * 插件节点类型名称
   */
  abstract pluginNodeTypeName: string;

  /**
   * 获取节点表单配置项
   * 用于动态生成节点配置表单，支持自定义字段和验证规则
   * @returns 节点表单配置项schema对象或null（如果节点不支持配置）
   */
  getNodeFormConfig(): NodeConfig | null {
    return null;
  }

  /**
   * 执行节点的核心业务逻辑（默认行为）
   * - 先评估节点上的条件（如有）
   * - 再执行事件（如有）
   * - 记录执行历史的状态与时间
   * 子类可覆写以实现差异化逻辑（如并行/迭代）
   */
  async executeNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<boolean> {
    // 评估节点条件（若未配置条件则视为通过）
    const conditions = node.data?.config?.conditions;
    let shouldRun = true;
    try {
      if (conditions && Object.keys(conditions).length > 0) {
        shouldRun = await pluginExecutionEngine.evaluateRule(conditions, node.id);
      }
    } catch (error) {
      shouldRun = false;
    }

    if (!shouldRun) {
      if (historyItem) {
        historyItem.status = NodeStatus.PENDING;
        historyItem.endTime = new Date();
        historyItem.duration = historyItem.startTime
          ? historyItem.endTime.getTime() - historyItem.startTime.getTime()
          : 0;
        historyItem.contextAfter = {
          ...pluginExecutionEngine.getContextManager().getVariables(),
        };
      }
      return false;
    }

    // 执行事件（若有）
    let result: any = true;
    try {
      if (node.data?.config?.event) {
        result = await pluginExecutionEngine.evaluateMethod(
          node.data.config.event,
          node.id
        );
      }
    } catch (error) {
      // evaluateMethod 内部已处理历史项与错误状态，这里仅返回失败
      result = false;
    }

    // 记录执行成功状态与时间
    if (historyItem) {
      historyItem.status = result ? NodeStatus.SUCCESS : NodeStatus.FAILED;
      historyItem.endTime = new Date();
      historyItem.duration = historyItem.startTime
        ? historyItem.endTime.getTime() - historyItem.startTime.getTime()
        : 0;
      historyItem.contextAfter = {
        ...pluginExecutionEngine.getContextManager().getVariables(),
      };
      historyItem.engineResult = result;
    }

    return !!result;
  }

  /**
   * 获取节点当前的执行状态
   * @param node 要查询状态的节点对象
   * @param pluginExecutionEngine 插件执行引擎实例
   * @returns 节点状态或null
   */
  async getExecuteNodeStatus(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<NodeStatus | null> {
    return NodeStatus.SUCCESS;
  }

  /**
   * 获取流程中下一个要执行的节点ID（默认路由策略）
   * - 遍历出边，优先匹配条件成立的边
   * - 其次选择标记了 `isDefault` 的边
   * - 最后回退到第一条出边
   */
  async getNextNodeId(
    edges: Edge[],
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<string | string[] | null> {
    if (!edges || edges.length === 0) {
      return null;
    }

    // 1) 优先匹配条件成立的边
    for (const edge of edges) {
      try {
        if (edge.data?.conditions) {
          const isMatch = await pluginExecutionEngine.evaluateRule(
            edge.data.conditions,
            edge.id
          );
          if (isMatch) {
            return edge.target;
          }
        }
      } catch {
        // 忽略单条边的规则异常，继续尝试其他边
      }
    }

    // 2) 选择默认边
    const defaultEdge = edges.find((e) => e.data?.isDefault);
    if (defaultEdge) {
      return defaultEdge.target;
    }

    // 3) 回退到第一条出边
    return edges[0].target;
  }

  /**
   * 是否应该执行此节点（默认实现）
   * - 若节点配置了条件，则在此处进行评估，未通过则跳过执行
   */
  async shouldExecuteNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<boolean> {
    const conditions = node.data?.config?.conditions;
    if (!conditions || Object.keys(conditions).length === 0) {
      return true;
    }
    try {
      return await pluginExecutionEngine.evaluateRule(conditions, node.id);
    } catch {
      return false;
    }
  }

  /**
   * 节点执行完成后的回调（默认路由行为）
   * - 在执行成功时自动跳转到下一个节点
   * - 使用引擎的 `getNextNodeId` 以委托子类（如分支/并行）自定义路由
   */
  async onNodeComplete(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem: ExecutionHistory,
    result: boolean
  ): Promise<void> {
    if (!result) return;

    const next = await pluginExecutionEngine.getNextNodeId(
      node.id,
      historyItem
    );

    if (Array.isArray(next)) {
      // 基类默认顺序执行（并行节点会覆写此方法实现并行）
      for (const id of next) {
        await pluginExecutionEngine.executeNode(id);
      }
    } else if (typeof next === "string") {
      await pluginExecutionEngine.executeNode(next);
    }
    // null 表示流程结束，基类不作处理
  }
}
```

示例：
```ts
import { PluginManagerInstance, BaseNodePlugin, type PluginExecutionEngine } from '@plugin-flow-engine/core';
import type { TopLevelCondition, Event, FlowData, Node } from '@plugin-flow-engine/type/core';
import  {NodeStatus} from '@plugin-flow-engine/type/core';

class MyNodePlugin extends BaseNodePlugin {
  pluginNodeType = 'MyNode';
  pluginNodeTypeName = '我的节点';
  /**
   * 可选方法，用于定义节点的表单配置
   * @returns 节点表单配置对象
   */
  getNodeFormConfig() {
    return { schema: { type: 'Action', label: '我的节点', config: [{ key: 'text', label: '文本', type: 'string' }] } };
  }
    /**
   * 获取节点执行状态
   * @param node 节点信息
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 执行状态
   */
  async getExecuteNodeStatus(node: Node, pluginExecutionEngine: PluginExecutionEngine): Promise<NodeStatus | null> {
    return super.getExecuteNodeStatus(node, pluginExecutionEngine);
  }
}

// 注册（单个或批量）
PluginManagerInstance().registerPlugin(new MyNodePlugin());
// PluginManagerInstance().registerAllPlugin([new MyNodePlugin(), new OtherPlugin()]);

// 在流程数据中绑定插件类型
const flowData: FlowData = {
  flow: { id: 'demo', name: 'Demo', version: '1.0.0', enable: true, description: '', category: 'demo', create_date: '', update_date: '' },
  context: { variables: {} },
  nodes: [
    { id: 'action', type: 'Action', position: { x: 200, y: 0 }, data: { name: '动作', pluginNodeType: 'MyNode', config: { text: 'hi' } } },
  ],
  edges: [],
  global_config: {},
};
```

### 2. 流程执行引擎（PluginExecutionEngine）
- 初始化：`initialize(flowData, context)` 验证流程定义，归一化节点名称并重置缓存。
- 执行流程：`executeFlow(startNodeId = 'trigger')`，将从触发节点开始推进；结束时触发 `flow_completed` 事件，并返回 `{ status, message, variables, errorInfo, executionReport }`。
- 执行节点：`executeNode(nodeId)` 委托对应插件执行；成功时触发 `node_executed` 与 `history_updated`。
- 条件评估：`evaluateRule(conditions, nodeId?)` 基于 `json-rules-engine`，支持自定义操作符并对缺失 `fact` 进行安全填充。
- 事件调用：`evaluateMethod(event, nodeId?)` 调用由 `ComponentManager` 托管的方法，会根据返回对象自动 `updateVariables`。
- 路由推进：`getNextNodeId(nodeId, historyItem?)` 由插件决定（基类默认按“匹配条件 > 默认边 > 第一出边”策略）。
- 事件订阅：`on(eventName, listener)` / `off(eventName, listener)`；内置事件包括 `history_updated`、`node_executed`、`flow_completed`。
- 监控与校验：集成 `FlowMonitor`（性能与统计）与 `FlowValidator`（流程结构与逻辑校验）。


#### 引擎实例方法（可访问）
- `getPluginManager()`：获取插件管理器（全局单例）。
- `getComponentManager()`：获取组件/全局方法管理器（全局单例）。
- `getContextManager()`：获取上下文管理器（每流程实例，强关联引擎）。
- `initialize(flow, context)`：初始化流程数据与上下文。
- `executeFlow(startNodeId = 'trigger')`：执行整条流程并返回结果。
- `executeNode(nodeId)`：执行指定节点（委托对应插件）。
- `getExecutionHistory()`：获取标准化的执行历史列表。
- `getNodes()` / `getNode(id?)`：读取所有节点或指定节点。
- `getEdges(nodeId, edgeType)` / `getIncomingEdges(nodeId)` / `getOutgoingEdges(nodeId)`：读取某节点的边。
- `getNextNodeId(nodeId, historyItem?)`：由插件决策获取下一节点 ID（支持并行/分支策略）。
- `getNodeStatus(nodeId)`：获取节点当前状态（`pending/running/success/failed`）。
- `getContext()` / `updateContext(context)`：读取与替换执行上下文。
- `on(eventName, listener)` / `off(eventName, listener)`：订阅/取消订阅引擎事件（`history_updated/node_executed/flow_completed`）。
- `evaluateRule(conditions, nodeId?)`：评估条件（基于 `json-rules-engine`）。
- `evaluateMethod(event, nodeId?)`：调用事件方法并根据返回对象自动合并到上下文变量。
- 属性：`hasFailed: boolean` 当前引擎是否发生失败标记。

> 说明：`emit(...)`、`createEngine()`、`collectConditionFacts(...)` 等为内部方法，不对外暴露。

### 3. 流程历史记录（ExecutionHistory）
- 获取：`getExecutionHistory()` 返回历史项数组；Hook 中也会在 `history_updated` 时自动同步。
- 数据结构类型定义：详见 [Type 模块 - ExecutionHistory](/modules/type#executionhistory)
- 失败定位：内部按最新失败项生成 `errorInfo`；同时产出 `executionReport`（含节点统计与建议）。

### 4. 事件管理（全局方法与组件实例）
- 统一方法调用：`callMethod(fullPath, ...params)` 支持：
  - `instanceName.methodName`（组件实例方法）。
  - `global.methodName`（全局方法）。
  - `window.methodName`（浏览器全局）。
- 事件配置：节点 `data.config.event` 形如 `{ type: 'global.sendMsg' | 'ButtonRef.click', params: any }`；参数将原样传入目标方法。
- 组件注册：`registerInstance(name, ref)`；在 `useFlowEngine` 中可通过 `options.components: [{ name, ref }]` 批量注册。
- 全局方法：`registerGlobalMethod(name, fn)` / `registerGlobalMethods([{ name, method }])`；支持注销与查询。

#### 引擎事件（每流程隔离）
- 订阅：`on(eventName, listener)` / `off(eventName, listener)`；内置事件包括 `history_updated`、`node_executed`、`flow_completed`。
- 作用域：严格按“流程引擎实例”隔离，每次 `useFlowEngine` 创建的 `engine` 有独立事件总线与订阅。
- 用途：聚焦某条流程的生命周期联动（如 UI 高亮、日志记录）

### 5. 流程上下文管理（ContextManager）
- 作用域：按“流程实例”隔离；仅在该流程引擎内生效，多个流程并发执行不会互相污染。
- 访问方式（强关联）：ContextManager 为引擎内聚对象，必须通过 `engine.getContextManager()` 访问与调用；不要直接导入/实例化后独立使用。
- 初始化与获取：`initialize(initialContext)`、`getContext()`、`getVariables()`。
- 更新：`updateVariables(partial)`（部分更新）、`updateContext(next)`（整体替换）。
- 监听：`addListener(listener)` / `removeListener(listener)`；变更后自动通知监听器。
- 清理：`clear()` 重置变量为 `{}` 并广播变更。

示例（推荐通过引擎访问）：
```ts
import { useFlowEngine } from '@plugin-flow-engine/core';

const { engine, updateVariables } = useFlowEngine({ flowData, initialVariables: {} });
const cm = engine.getContextManager();

// 通过 ContextManager 直接更新
cm.updateVariables({ a: 1 });

// 或使用 Hook 提供的便捷方法（内部同样走 ContextManager）
updateVariables({ b: 2 });
```

### 6. 自定义规则评估操作符（RuleOperators）
- 外部注入：`injectOperator(name, fn)` 将在每次创建规则引擎时统一注册。
- 已内置增强操作符：
  - 字符串：`start_with`、`end_with`、`regex`、`include`、`not_include`。
  - 数值范围：`between`、`not_between`。
  - 结构：`has_key`、`is_empty`、`not_empty`。
- 引擎注册：由引擎内部 `registerAllOperators(engine)` 统一完成。

### 7. 流程 Hook（useFlowEngine）
- 入参：`{ flowData, initialVariables?, components?: [{ name, ref }] }`。
- 返回：`{ engine, executeFlow, executionResult, executionHistory, isExecuting, updateVariables }`。
- 引擎实例方法：`engine.getPluginManager()`、`engine.getContextManager()`、`engine.getComponentManager()`；分别用于插件管理、每流程上下文管理与组件/全局方法调用（参考 `PluginExecutionEngine.ts`）。
- 自动执行：当 `flowData.flow.auto === true`，在组件挂载且组件实例注册完成后自动调用 `executeFlow`。
- 变量更新：`updateVariables({ ... })` 将通过 `ContextManager` 更新变量，并在后续节点评估中生效。

## 进阶示例

- 自定义操作符注入：
```ts
import { injectOperator } from '@plugin-flow-engine/core';
// 注入“大小写不敏感包含”操作符
injectOperator('i_include', (fact, value) => {
  if (typeof fact !== 'string' || typeof value !== 'string') return false;
  return fact.toLowerCase().includes(value.toLowerCase());
});
```

- 自定义插件注册（与 UI 注入配合）：
```ts
import { PluginManagerInstance, BaseNodePlugin } from '@plugin-flow-engine/core';
import { registerPluginUI } from '@plugin-flow-engine/ui';
import { BuiltInPluginNodeTypes, AntdWidgetKeys, type NodeConfig } from '@plugin-flow-engine/type';
import type { WidgetProps } from '@plugin-flow-engine/type';
import { Input } from 'antd';

// 1) 自定义控件
const CustomInputWidget: React.FC<WidgetProps<any>> = ({ value, onChange, ...rest }) => (
  <div>
    <label>我是自定义的控件哦</label>
    <Input {...rest} value={value} onChange={onChange} />
  </div>
);

// 2) 插件的表单 schema（包含自定义控件映射）
const schema: NodeConfig = {
  schema: {
    type: 'MyAction',
    label: '我的操作',
    config: [
      { type: AntdWidgetKeys.Input, label: '操作名称', field: 'name', formItemProps: { required: true } },
      { type: 'custom-input', widget: 'custom-input', label: '操作参数', field: 'params', formItemProps: { required: true }, widgetProps: { placeholder: '请输入操作参数' } },
    ],
  },
  widgets: {
    'custom-input': CustomInputWidget,
  },
};

// 3) 自定义插件（返回 schema 供 UI 渲染）
class MyActionPlugin extends BaseNodePlugin {
  pluginNodeTypeName = '我的操作';
  pluginNodeType = 'MyAction';
  getNodeFormConfig(): NodeConfig | null {
    return schema;
  }
}

// 4) 注册插件（使引擎可识别该类型，并可在流程中使用）
PluginManagerInstance().registerPlugin(new MyActionPlugin());

// 5) 覆盖内置 Action 的默认 UI 表单（仅 UI 层覆盖，业务插件仍按各自逻辑执行）
registerPluginUI(BuiltInPluginNodeTypes.Action, schema);
```

- 事件调用（全局方法与组件实例）：
```ts
import { ComponentManagerInstance } from '@plugin-flow-engine/core';
const cm = ComponentManagerInstance();

cm.registerGlobalMethod('sendMsg', (payload) => {
  console.log('发送：', payload);
  return { lastMsg: payload }; // 返回对象将合并到上下文变量
});

// 节点事件配置示例：
node.data.config.event = { type: 'global.sendMsg', params: { text: 'Hello' } };
// 或：node.data.config.event = { type: 'ButtonRef.click', params: { id: 1 } };
```


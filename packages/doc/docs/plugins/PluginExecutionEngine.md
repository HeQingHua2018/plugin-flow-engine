# 插件执行引擎

## 概述

PluginExecutionEngine 是插件流程引擎的核心类，负责流程的执行与状态管理。

## 构造函数

```typescript
new PluginExecutionEngine(options?: {
  pluginManager?: PluginManager;
});
```

### 参数

| 参数 | 类型 | 可选 | 描述 |
|------|------|------|------|
| `pluginManager` | `PluginManager` | 是 | 自定义插件管理器，默认使用全局插件管理器 |

### 示例

```typescript
// 默认使用全局插件管理器
const engine1 = new PluginExecutionEngine();

// 使用自定义插件管理器（隔离场景）
const customPM = createPluginManager();
const engine2 = new PluginExecutionEngine({ pluginManager: customPM });
```

## 核心方法

### 初始化与执行

| 方法 | 签名 | 描述 |
|------|------|------|
| `initialize` | `(flow: FlowData, context?: ExecutionContext) => void` | 初始化引擎，设置流程定义和上下文 |
| `executeFlow` | `(nodeId?: string) => Promise<{ status: boolean; message: string; variables?: Record<string, any>; errorInfo?: any; executionReport?: any }>` | 执行整个流程 |
| `executeNode` | `(nodeId: string) => Promise<boolean>` | 执行指定节点 |

#### initialize

```typescript
initialize(flow: FlowData, context?: ExecutionContext): void
```

初始化引擎，验证流程定义并设置初始上下文变量。

| 参数 | 类型 | 描述 |
|------|------|------|
| `flow` | `FlowData` | 流程定义数据 |
| `context` | `ExecutionContext` | 执行上下文，包含变量和元数据 |

#### executeFlow

```typescript
executeFlow(nodeId?: string): Promise<{
  status: boolean;
  message: string;
  variables?: Record<string, any>;
  errorInfo?: any;
  executionReport?: any;
}>
```

执行整个流程，自动从 Trigger 节点开始。

| 参数 | 类型 | 描述 |
|------|------|------|
| `nodeId` | `string` | 可选，指定从哪个节点开始执行 |

#### executeNode

```typescript
executeNode(nodeId: string): Promise<boolean>
```

执行指定节点。

| 参数 | 类型 | 描述 |
|------|------|------|
| `nodeId` | `string` | 要执行的节点 ID |

### 流程查询

| 方法 | 签名 | 描述 |
|------|------|------|
| `getNodes` | `() => Node[]` | 获取所有节点 |
| `getNode` | `(nodeId?: string) => Node \| Node[] \| undefined` | 获取指定节点或所有节点 |
| `getEdges` | `(nodeId: string, edgeType?: EdgeType) => Edge[]` | 获取节点的边 |
| `getIncomingEdges` | `(nodeId: string) => Edge[]` | 获取入边 |
| `getOutgoingEdges` | `(nodeId: string) => Edge[]` | 获取出边 |
| `getNextNodeId` | `(nodeId: string, historyItem?: ExecutionHistory) => Promise<string \| string[] \| null>` | 获取下一个节点 ID |
| `getNodeStatus` | `(nodeId: string) => Promise<NodeStatus \| null>` | 获取节点状态 |

### 规则评估

| 方法 | 签名 | 描述 |
|------|------|------|
| `evaluateRule` | `(conditions?: any, nodeId?: string) => Promise<boolean>` | 评估规则条件 |
| `evaluateMethod` | `(event?: Event, nodeId?: string) => Promise<any>` | 执行事件方法 |

#### evaluateRule

```typescript
evaluateRule(conditions?: any, nodeId?: string): Promise<boolean>
```

评估规则条件，支持缓存优化。

| 参数 | 类型 | 描述 |
|------|------|------|
| `conditions` | `any` | 规则条件 |
| `nodeId` | `string` | 节点 ID，用于错误上下文 |

#### evaluateMethod

```typescript
evaluateMethod(event?: Event, nodeId?: string): Promise<any>
```

调用事件的方法，通过 ComponentManager 执行。

| 参数 | 类型 | 描述 |
|------|------|------|
| `event` | `Event` | 事件配置 |
| `nodeId` | `string` | 节点 ID，用于错误上下文 |

### 状态与历史

| 方法 | 签名 | 描述 |
|------|------|------|
| `getExecutionHistory` | `() => ExecutionHistory[]` | 获取执行历史记录 |
| `setHasFailed` | `(hasFailed: boolean) => void` | 设置失败状态 |
| `getContext` | `() => ExecutionContext \| null` | 获取执行上下文 |
| `updateContext` | `(context: ExecutionContext) => void` | 更新执行上下文 |

### 管理器访问

| 方法 | 签名 | 描述 |
|------|------|------|
| `getContextManager` | `() => ContextManager` | 获取上下文管理器 |
| `getComponentManager` | `() => ComponentManager` | 获取组件管理器 |
| `getPluginManager` | `() => PluginManager` | 获取插件管理器 |
| `getRuleEnginePool` | `() => RuleEnginePool` | 获取规则引擎池 |
| `getEnhancedRuleEngineCache` | `() => EnhancedRuleEngineCache` | 获取增强规则引擎缓存 |

### 性能优化

| 方法 | 签名 | 描述 |
|------|------|------|
| `getPerformanceStats` | `() => { ruleEnginePool: PoolStats; enhancedCache: EnhancedCacheStats; nodeCacheSize: number; edgeCacheSize: number }` | 获取性能统计信息 |
| `resetPerformanceStats` | `() => void` | 重置性能统计信息 |

### 事件系统

| 方法 | 签名 | 描述 |
|------|------|------|
| `on` | `(eventName: string, listener: (...args: any[]) => void) => void` | 注册事件监听器 |
| `off` | `(eventName: string, listener: (...args: any[]) => void) => void` | 移除事件监听器 |

**支持的事件**：
- `flow_completed` - 流程完成时触发
- `history_updated` - 执行历史更新时触发
- `node_executed` - 节点执行完成时触发

### 插件管理

| 方法 | 签名 | 描述 |
|------|------|------|
| `registerPlugin` | `(plugin: NodePlugin, force?: boolean, silent?: boolean) => void` | 注册节点插件 |

#### registerPlugin

```typescript
registerPlugin(plugin: NodePlugin, force?: boolean, silent?: boolean): void
```

注册插件到当前引擎使用的插件管理器。

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `plugin` | `NodePlugin` | - | 要注册的插件实例 |
| `force` | `boolean` | `false` | 是否强制注册（覆盖已存在的插件） |
| `silent` | `boolean` | `false` | 是否静默注册（不打印日志） |

### 组件注册

| 方法 | 签名 | 描述 |
|------|------|------|
| `registerComponents` | `(components: Array<{ name: string; ref: { current: any } }>) => void` | 注册业务组件实例 |

### 并发控制

| 方法 | 签名 | 描述 |
|------|------|------|
| `getContextLock` | `() => ReadWriteLock` | 获取上下文变量的读写锁 |
| `getNextSequence` | `() => number` | 获取操作序列号 |
| `getThreadId` | `() => string` | 获取当前线程 ID |
| `getExecutionDepth` | `() => number` | 获取当前执行深度 |
| `incrementExecutionDepth` | `() => void` | 增加执行深度 |
| `decrementExecutionDepth` | `() => void` | 减少执行深度 |
| `getConcurrencyStats` | `() => { threadId: string; executionDepth: number; variablesLock: { status: string; readers: number; writers: number; waitingWriters: number; queueLength: number }; operationSequence: { current: number; lockedResources: number; waitingResources: number }; resourceLocks: number }` | 获取并发控制统计信息 |
| `enableConcurrencyDebug` | `(enabled: boolean) => void` | 启用/禁用并发调试 |
| `getConcurrencyLogs` | `() => Array<{ timestamp: number; threadId: string; action: string; resourceId?: string; sequence?: number; details?: any }>` | 获取并发调试日志 |
| `clearConcurrencyLogs` | `() => void` | 清空并发调试日志 |
| `generateConcurrencyReport` | `() => string` | 生成并发调试报告 |

### 调试

| 方法 | 签名 | 描述 |
|------|------|------|
| `startDebug` | `(config?: { breakpoints?: string[]; stepByStep?: boolean }) => void` | 启动调试 |
| `pauseDebug` | `() => Promise<void>` | 暂停调试 |
| `resumeDebug` | `() => void` | 恢复调试 |
| `stopDebug` | `() => void` | 停止调试 |

### 资源管理

| 方法 | 签名 | 描述 |
|------|------|------|
| `dispose` | `() => void` | 清理引擎资源 |

## 节点插件接口 (NodePlugin)

所有节点插件都必须实现以下接口：

```typescript
interface NodePlugin {
  pluginNodeType: PluginNodeType;
  pluginNodeTypeName: string;

  executeNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<boolean>;

  getExecuteNodeStatus(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<NodeStatus | null>;

  getNextNodeId(
    edges: Edge[],
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<string | string[] | null>;

  shouldExecuteNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<boolean>;

  onNodeComplete(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem: ExecutionHistory,
    result: boolean
  ): Promise<void>;
}
```

## 基础节点插件类 (BaseNodePlugin)

BaseNodePlugin 是一个实现了 NodePlugin 接口的抽象基类，建议优先继承而非直接实现 NodePlugin 接口。

### 核心特性

- **默认实现**: 提供 `getExecuteNodeStatus`、`getNextNodeId`、`shouldExecuteNode`、`onNodeComplete` 的默认实现
- **通用逻辑**: 包含执行状态检查、条件评估、事件执行和历史记录管理
- **易于扩展**: 自定义插件只需重写 `executeNode` 核心方法

### 实现概要

```typescript
abstract class BaseNodePlugin implements NodePlugin {
  abstract pluginNodeType: PluginNodeType;
  abstract pluginNodeTypeName: string;

  async executeNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<boolean> { /* ... */ }

  async getExecuteNodeStatus(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<NodeStatus | null> { /* ... */ }

  async getNextNodeId(
    edges: Edge[],
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<string | string[] | null> {
    if (!edges || edges.length === 0) return null;
    for (const edge of edges) {
      if (edge.data?.conditions) {
        const isMatch = await pluginExecutionEngine.evaluateRule(edge.data.conditions, edge.id);
        if (isMatch) return edge.target;
      }
    }
    const defaultEdge = edges.find(e => e.data?.isDefault);
    if (defaultEdge) return defaultEdge.target;
    return edges[0].target;
  }

  async shouldExecuteNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<boolean> { return true; }

  async onNodeComplete(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem: ExecutionHistory,
    result: boolean
  ): Promise<void> { /* ... */ }
}
```
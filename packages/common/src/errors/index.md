# 错误处理

## FlowExecutionError

流程执行错误类，用于流程执行过程中的错误处理，继承自 Error。

### 构造函数

```typescript
class FlowExecutionError extends Error {
  constructor(
    message: string,
    code?: FlowErrorCode,
    severity?: ErrorSeverity,
    options?: {
      nodeId?: string;
      context?: Record<string, any>;
      originalError?: Error;
    }
  )
}
```

### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `message` | `string` | 错误信息 |
| `code` | `FlowErrorCode` | 错误码 |
| `severity` | `ErrorSeverity` | 错误严重级别 |
| `nodeId` | `string \| undefined` | 节点ID |
| `timestamp` | `Date` | 时间戳 |
| `context` | `Record<string, any> \| undefined` | 错误详情 |
| `originalError` | `Error \| undefined` | 原始错误 |

## errorHandler

全局错误处理器单例实例，用于统一处理流程执行中的错误。

### 方法

| 方法 | 签名 | 描述 |
|------|------|------|
| `getInstance` | `() => ErrorHandler` | 获取单例实例（静态方法） |
| `handleError` | `(error: unknown, context?: Record<string, any>) => FlowExecutionError` | 处理错误，返回 FlowExecutionError 实例 |
| `addErrorListener` | `(listener: (error: FlowExecutionError) => void) => () => void` | 添加错误监听器，返回移除监听器的函数 |

### FlowExecutionError 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `message` | `string` | 错误信息 |
| `code` | `FlowErrorCode` | 错误码 |
| `severity` | `ErrorSeverity` | 错误严重级别 |
| `nodeId` | `string \| undefined` | 节点ID |
| `timestamp` | `Date` | 时间戳 |
| `context` | `Record<string, any> \| undefined` | 错误详情 |
| `originalError` | `Error \| undefined` | 原始错误 |

### FlowErrorCode 枚举

| 错误码 | 描述 |
|--------|------|
| `ENGINE_NOT_INITIALIZED` | 引擎未初始化 |
| `ENGINE_EXECUTION_FAILED` | 引擎执行失败 |
| `NODE_NOT_FOUND` | 节点未找到 |
| `NODE_EXECUTION_FAILED` | 节点执行失败 |
| `NODE_PLUGIN_NOT_FOUND` | 节点插件未找到 |
| `RULE_EVALUATION_FAILED` | 规则评估失败 |
| `RULE_CONDITION_INVALID` | 规则条件无效 |
| `EVENT_EXECUTION_FAILED` | 事件执行失败 |
| `EVENT_METHOD_NOT_FOUND` | 事件方法未找到 |
| `CONTEXT_MANAGER_NOT_INITIALIZED` | 上下文管理器未初始化 |
| `CONTEXT_VARIABLE_NOT_FOUND` | 上下文变量未找到 |
| `CONTEXT_SNAPSHOT_NOT_FOUND` | 上下文快照未找到 |
| `TRANSACTION_NOT_ACTIVE` | 事务未激活 |
| `TRANSACTION_NOT_FOUND` | 事务未找到 |
| `TRANSACTION_NESTED_LIMIT_EXCEEDED` | 事务嵌套层级超限 |
| `INSTANCE_NOT_FOUND` | 实例未找到 |
| `INSTANCE_METHOD_NOT_FOUND` | 实例方法未找到 |
| `FLOW_DEFINITION_INVALID` | 流程定义无效 |
| `FLOW_CIRCULAR_DEPENDENCY` | 流程循环依赖 |
| `FLOW_TIMEOUT` | 流程超时 |
| `UNKNOWN_ERROR` | 未知错误 |
| `VALIDATION_ERROR` | 验证错误 |

### ErrorSeverity 枚举

| 级别 | 描述 |
|------|------|
| `LOW` | 低 |
| `MEDIUM` | 中 |
| `HIGH` | 高 |
| `CRITICAL` | 严重 |

### 静态方法

| 方法 | 签名 | 描述 |
|------|------|------|
| `engineNotInitialized` | `(message?: string) => FlowExecutionError` | 创建引擎未初始化错误 |
| `nodeExecutionFailed` | `(nodeId: string, message: string, originalError?: Error) => FlowExecutionError` | 创建节点执行失败错误 |
| `pluginNotFound` | `(pluginNodeType: string) => FlowExecutionError` | 创建插件未找到错误 |
| `ruleEvaluationFailed` | `(nodeId: string, message: string, originalError?: Error) => FlowExecutionError` | 创建规则评估失败错误 |
| `eventExecutionFailed` | `(nodeId: string, eventType: string, message: string, originalError?: Error) => FlowExecutionError` | 创建事件执行失败错误 |
| `contextManagerNotInitialized` | `(message: string) => FlowExecutionError` | 创建上下文管理器未初始化错误 |
| `contextVariableNotFound` | `(message: string) => FlowExecutionError` | 创建上下文变量未找到错误 |
| `contextSnapshotNotFound` | `(message: string) => FlowExecutionError` | 创建上下文快照未找到错误 |
| `transactionNotActive` | `(message: string) => FlowExecutionError` | 创建事务未激活错误 |
| `transactionNotFound` | `(message: string) => FlowExecutionError` | 创建事务未找到错误 |
| `transactionNestedLimitExceeded` | `(maxDepth: number) => FlowExecutionError` | 创建事务嵌套层级超限错误 |
| `instanceNotFound` | `(instanceName: string) => FlowExecutionError` | 创建实例未找到错误 |
| `methodNotFound` | `(instanceName: string, methodName: string) => FlowExecutionError` | 创建方法未找到错误 |
| `flowDefinitionInvalid` | `(message: string) => FlowExecutionError` | 创建流程定义无效错误 |
| `timeout` | `(nodeId: string, timeoutMs: number) => FlowExecutionError` | 创建超时错误 |

### 实例方法

| 方法 | 签名 | 描述 |
|------|------|------|
| `toJSON` | `() => Record<string, any>` | 转换为 JSON 格式，包含 name、message、code、severity、nodeId、timestamp、context、stack、originalError |
| `getUserFriendlyMessage` | `() => string` | 获取用户友好的错误消息，根据错误码返回对应的中文提示 |

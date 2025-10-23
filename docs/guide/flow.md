---
title: 流程数据定义
order: 6
toc: menu
---

# 流程数据定义

## 总览

本页聚焦“如何配置与使用流程”，完整的类型定义已统一迁移至“类型速查表”。

- 核心类型请参见：[FlowDefinition](./types.md#flowdefinition)、[Node](./types.md#node)、[Edge](./types.md#edge)、[ExecutionContext](./types.md#executioncontext)、[ExecutionHistory](./types.md#executionhistory)、[GlobalConfig](./types.md#globalconfig)。
- 条件判断依赖 `json-rules-engine`，并支持扩展的自定义操作符，详见 [规则操作符](./operators.md)。
- 分支优先级与默认分支请使用 `priority` 与 `isDefault`；并行与迭代策略参见 [ParallelStrategy](./types.md#parallelstrategy) 与 [IterationMode](./types.md#iterationmode)。

## 最小示例

```ts
import type { FlowDefinition } from 'plugin-flow-engine';

const flow: FlowDefinition = {
  flow: {
    id: 'flow-001',
    name: '最小流程',
    version: '1.0.0',
    description: '触发 -> 结束',
    category: 'demo',
    enable: true,
    create_date: '2025-01-01',
    update_date: '2025-01-01',
  },
  context: { variables: {} },
  nodes: [
    { id: 'n1', name: '触发', type: 'Trigger', config: { event: { type: 'start' } as any } },
    { id: 'n2', name: '结束', type: 'End', config: {} },
  ],
  edges: [ { id: 'e1', source: 'n1', target: 'n2', label: '进入结束' } ],
  global_config: { timeout: 10000, max_depth: 32 },
};
```

## 进阶示例：分支与并行

```ts
const flowAdv: FlowDefinition = {
  flow: { id: 'adv', name: '分支与并行', version: '1.0.0', description: 'VIP 走并行，普通走 Action', category: 'demo', enable: true, create_date: '2025-01-01', update_date: '2025-01-01' },
  context: { variables: { isVip: { type: 'boolean', source: 'context', default: false } } },
  nodes: [
    { id: 'n1', name: '触发', type: 'Trigger', config: { event: { type: 'start' } as any } },
    { id: 'n2', name: '分支', type: 'Branch', config: {} },
    { id: 'n3', name: 'VIP 并行处理', type: 'Parallel', config: { parallel_strategy: 'all' } },
    { id: 'n4', name: '普通处理', type: 'Action', config: { event: { type: 'notify' } as any } },
    { id: 'n5', name: '结束', type: 'End', config: {} },
  ],
  edges: [
    { id: 'e1', source: 'n1', target: 'n2', label: '进入分支' },
    { id: 'e2', source: 'n2', target: 'n3', label: '是VIP', priority: 1, conditions: { all: [{ fact: 'isVip', operator: 'equal', value: true }] } as any },
    { id: 'e3', source: 'n2', target: 'n4', label: '非VIP', isDefault: true, priority: 99 },
    { id: 'e4', source: 'n3', target: 'n5', label: '并行完成' },
    { id: 'e5', source: 'n4', target: 'n5', label: '普通完成' },
  ],
  global_config: { timeout: 30000, max_depth: 100 },
};
```

## 最佳实践

- 唯一性：`flow.id`、节点 `id` 与边 `id` 保持唯一；`name` 便于调试与展示。
- 分支策略：为分支设置合理的 `priority` 与 `isDefault`，避免路径歧义。
- 并行/迭代：根据业务选择 `[ParallelStrategy](./types.md#parallelstrategy)` 与 `[IterationMode](./types.md#iterationmode)`。
- 超时与深度：为长流程设置 `timeout` 与 `max_depth`，防止阻塞与递归错误。
- 上下文管理：共享变量写入 `ExecutionContext.variables`，便于规则判断与事件执行。
- 历史记录：使用 `ExecutionHistory` 记录分支决策与并行信息，便于排查与审计。

## 相关文档

- 类型速查与完整字段说明：[./types](./types.md)
- 规则操作符与扩展用法：[./operators](./operators.md)
- 自定义控件与表单 Schema：[./widgets](./widgets.md)
- 插件开发规范与替换策略：[./plugins](./plugins.md)

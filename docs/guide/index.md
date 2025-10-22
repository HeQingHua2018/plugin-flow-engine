---
title: 介绍
order: 1
toc: menu
---

## 什么是 Plugin Flow Engine?

Plugin Flow Engine 是一个基于插件化架构的流程执行引擎，用于搭建可扩展、可测试的流程执行系统。它通过“节点插件 + 表单 Schema + 自定义控件”三件套，使流程的建模、渲染与执行解耦。

## 阅读路径建议

- 快速上手（本页）：安装与最小可用示例
- 插件规范：如何开发与注册节点插件（[查看详情](./plugins)）
- 自定义控件：如何为节点表单扩展控件（[查看详情](./widgets)）
- 类型速查：统一查看所有类型定义（[查看详情](./types)）
- 流程数据定义：核心类型与配置示例（[查看详情](./flow)）
- 规则操作符：扩展 json-rules-engine 自定义操作符（[查看详情](./operators)）
- 组件与示例：更多完整演示与 UI 说明（[查看示例](./components)）

## 快速上手

1. 安装

```bash
npm i plugin-flow-engine
```

2. 最小示例

```ts
import { useFlowEngine } from 'plugin-flow-engine';

// 最小可用配置：1 个触发节点 + 1 个结束节点
const flowData = {
  flow: { id: 'demo', name: '最小示例', version: '1.0.0', description: 'Hello Flow', category: 'demo', enable: true, create_date: '2025-01-01', update_date: '2025-01-01' },
  context: { variables: {} },
  nodes: [
    { id: 'n1', name: '触发', type: 'Trigger', config: { event: { type: 'start' } } },
    { id: 'n2', name: '结束', type: 'End', config: {} },
  ],
  edges: [ { id: 'e1', source: 'n1', target: 'n2', label: '进入结束' } ],
  global_config: { timeout: 10000, max_depth: 32 },
};

export function Demo() {
  const { executeFlow, isExecuting, executionResult } = useFlowEngine({
    flowData,
    initialVariables: {},
    components: [], // 如果流程中需要与组件交互，这里传组件引用
  });

  return (
    <div>
      <button disabled={isExecuting} onClick={executeFlow}>
        {isExecuting ? '执行中…' : '执行流程'}
      </button>
      {executionResult && (
        <pre>{JSON.stringify(executionResult, null, 2)}</pre>
      )}
    </div>
  );
}
```

3. 完整示例

- 更多完整演示与 UI 集成方式，[查看示例](./components)。
- 复杂流程（分支/并行/迭代）建模可参考[流程数据定义](./flow)。

## 特别说明

- 依赖 [antd](https://ant.design) 作为基础 UI 组件库
- 依赖 [json-rules-engine](https://github.com/CacheControl/json-rules-engine) 进行规则评估
- 依赖 [ReactFlow](https://reactflow.nodejs.cn) 进行流程图编辑与展示
- 文档站使用 [Dumi](https://d.umijs.org)

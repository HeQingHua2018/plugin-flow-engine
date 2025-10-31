---
title: 快速上手
order: 1
toc: menu
---

# 简介

Plugin Flow Engine 是一套用于前端工程中的“插件化流程”解决方案：
- “插件”描述流程节点（触发、动作、分支、并行、迭代、合并、结束等）；
- “引擎”负责运行与状态维护；
- “组件”用于 UI 渲染与表单配置；
- “注入器”支持 schema 与控件覆写/扩展；
- 提供完整类型定义与最佳实践。

## 快速上手

### 安装

```bash
# 核心（不含 UI）
pnpm add @plugin-flow-engine/core @plugin-flow-engine/type

# UI（React 环境，可选）
pnpm add @plugin-flow-engine/ui @plugin-flow-engine/type react react-dom
```

### 最小示例

```ts
import { PluginManagerInstance, BaseNodePlugin, useFlowEngine } from '@plugin-flow-engine/core';
import type { FlowData } from '@plugin-flow-engine/type/core';

// 1) 定义并注册插件
class MyActionPlugin extends BaseNodePlugin {
  pluginNodeType = 'MyAction';
  pluginNodeTypeName = '我的动作';
  async execute(node, context, engine) {
    // 在此执行你的业务逻辑（返回 true 表示继续，false 表示停止）
    return true;
  }
}
PluginManagerInstance().registerPlugin(new MyActionPlugin());

// 2) 构造最小流程数据
const flowData: FlowData = {
  flow: { id: 'demo', name: 'Demo', version: '1.0.0', description: '', category: 'demo', enable: true, create_date: '', update_date: '' },
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

// 3) 执行流程
const { executeFlow, executionHistory } = useFlowEngine({ flowData, initialVariables: {} });
await executeFlow();
console.log(executionHistory);
```

### 特别说明

#### 依赖
项目分为以下三部分：
- `@plugin-flow-engine/core`：核心库
  - 流程引擎（评估规则、执行流程、维护状态等）
  - 插件系统（注册插件、调用插件、插件生命周期管理等）
  - 事件系统（注册事件、触发事件、监听事件等）
  - 数据管理（用于存储流程状态、变量、上下文等）
- `@plugin-flow-engine/ui`：UI 组件库
  - 节点配置
  - 内置antd表单控件
  - 自定义注册节点组件
- `@plugin-flow-engine/type`：类型定义库，
  - 包含流程数据结构
  - 插件接口
  - 执行上下文等类型
#### 引用说明

- `react`、`react-dom`（UI 渲染基础）
- `@xyflow/react`（流程图 UI）
- `antd`（基础表单控件）
- `dumi`（文档）
- `father`（库构建）

# @plugin-flow-engine/core

核心模块，提供流程执行引擎、插件管理器、内置插件集合以及 React Hook 封装，负责与 UI 层无关的业务逻辑。

## 功能概览
- 插件管理：注册/获取节点插件，统一管理插件生命周期。
- 执行引擎：按流程节点与边执行，维护上下文与历史记录。
- 类型导出：统一的节点、边、上下文、历史等类型。
- Hook 封装：`useFlowEngine` 快速集成到应用中。

## 安装与引用
> 本仓库为 monorepo，内部包通过 workspace 互相引用。外部项目如需单独使用 core 包，请安装并按如下方式引用。

```bash
# 使用 pnpm（外部项目）
pnpm add @plugin-flow-engine/core @plugin-flow-engine/type

# 使用 npm（外部项目）
npm install @plugin-flow-engine/core @plugin-flow-engine/type
```

在代码中引用：

```ts
import {
  PluginManagerInstance,
  PluginExecutionEngine,
  getBuiltInPluginInstances,
  BaseNodePlugin,
  useFlowEngine,
} from '@plugin-flow-engine/core';

import type {
  Node,
  Edge,
  FlowData,
  ExecutionHistory,
  PluginNodeType,
} from '@plugin-flow-engine/type';
```

## 主要导出
- `PluginManagerInstance`：获取插件管理器单例，支持注册/获取插件。
- `PluginExecutionEngine`：流程执行引擎，按节点/边推进，维护上下文与历史。
- `BaseNodePlugin`：插件基类，统一实现通用逻辑，子类覆写差异化行为。
- `getBuiltInPluginInstances`：内置插件实例集合（触发、动作、分支、并行、迭代、合并、结束）。
- `useFlowEngine`：React Hook，提供引擎与执行 API。
- 类型：`Node`、`Edge`、`FlowData`、`ExecutionHistory`、`PluginNodeType` 等。

## 快速示例
注册自定义插件并执行最小流程：

```ts
import { PluginManagerInstance, useFlowEngine, BaseNodePlugin } from '@plugin-flow-engine/core';
import type { FlowData } from '@plugin-flow-engine/type/core';

class MyActionPlugin extends BaseNodePlugin {
  pluginNodeType = 'MyAction';
  pluginNodeTypeName = '我的动作';
  async execute(node, context, engine) {
    // 在此执行业务逻辑
    return { success: true };
  }
}

// 注册插件（应用初始化时）
PluginManagerInstance().registerPlugin(new MyActionPlugin());

// 最小流程定义
const flowData: FlowData = {
  flow: {
    id: 'demo', name: 'Demo', version: '1.0.0', description: '最小示例', category: 'demo', enable: true, create_date: '', update_date: '',
  },
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

// 在组件中使用 Hook
const { engine, executeFlow, executionHistory } = useFlowEngine({ flowData, initialVariables: {} });
await executeFlow();
console.log(executionHistory);
```

## 开发与构建
- 开发：`pnpm --filter @plugin-flow-engine/core dev`
- 构建：`pnpm --filter @plugin-flow-engine/core build`（Father）
- 清理：`pnpm --filter @plugin-flow-engine/core run clean`

更多示例与最佳实践，请参见文档站点与仓库内 `packages/doc`。
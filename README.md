# Plugin Flow Engine

一个基于插件化架构的前端流程执行引擎与配套 React 组件库。支持通过“节点插件”描述流程的触发、分支、并行、迭代与结束等行为，并提供可注入的节点配置表单与自定义控件体系。

## 特性

- 插件化节点：触发、动作、分支、并行、迭代、合并、结束等内置插件，可扩展自定义插件。
- 流程执行引擎：维护上下文变量、执行历史、错误处理与性能监控。
- 动态配置表单：基于 `schema` 自动渲染，支持注入与覆写控件映射（widgets）。
- React 组件：`FlowView` 流程视图、`PluginView` 插件演示；`useFlowEngine` Hook 快速集成。
- TypeScript 类型：完整的流程、节点、边、上下文与插件类型约束。

## 安装

```bash
# 使用 pnpm
pnpm add plugin-flow-engine

# 或使用 npm
yarn add plugin-flow-engine
npm install plugin-flow-engine
```

## 快速开始

- 在页面中集成流程引擎（以 Hook 为例）：

```tsx
import { useFlowEngine } from 'plugin-flow-engine';

const { engine, executeFlow, executionHistory } = useFlowEngine({
  flowData: yourFlowDefinition,      // FlowDefinition
  initialVariables: { userId: '1' }, // 初始上下文变量
  components: [                      // 可选：注册实例组件（供事件调用）
    { name: 'Demo1', ref: demo1Ref },
  ],
});

// 触发流程执行
await executeFlow();
```

- 渲染流程视图并打开节点配置表单：

```tsx
import { FlowView } from 'plugin-flow-engine';

<FlowView
  initialNodes={nodes}
  initialEdges={edges}
  getNodeConfig={(nodeId) => ({})}
  onNodeConfigChange={(nodeId, values) => { /* 保存配置 */ }}
/>
```

## 插件与表单

- 注册或获取插件管理器：

```ts
import { PluginManagerInstance } from 'plugin-flow-engine';

const pm = PluginManagerInstance();
pm.registerPlugin(new MyNodePlugin());
```

- 在插件中返回表单 `schema` 与自定义控件：

```ts
import { BaseNodePlugin } from 'plugin-flow-engine';

class MyNodePlugin extends BaseNodePlugin {
  nodeType = 'MyNode';
  nodeTypeName = '我的节点';
  getNodeFormConfig() {
    return {
      schema: {
        type: 'MyNode',
        label: '我的节点',
        config: [
          { field: 'title', label: '标题', type: 'ant_Input' },
        ],
      },
    };
  }
}
```

- 直接注入或覆写某类型的 `schema` 与控件：

```ts
import { injectNodeSchema, injectWidget } from 'plugin-flow-engine';

injectWidget('json-editor', JsonEditor);

injectNodeSchema('Action', {
  type: 'Action',
  label: '动作节点（覆写）',
  config: [
    { field: 'api_key', label: 'API 密钥', type: 'ant_Input' },
  ],
});
```

## 主要导出

- 组件与 Hook：`FlowView`、`PluginView`、`useFlowEngine`
- 插件基类与内置插件：`BaseNodePlugin`、`getBuiltInPluginInstances`
- 管理器：`PluginManagerInstance`、`ComponentManagerInstance`
- 注入器：`injectNodeSchema`、`injectWidget`、`getNodeSchemas`、`getWidgets`
- 类型：`FlowDefinition`、`Node`、`Edge`、`ExecutionHistory`、`NodeConfig`、`WidgetProps`

## 开发与调试

```bash
# 安装依赖
pnpm install

# 文档开发（Dumi）
pnpm start

# 构建库源码（Father）
pnpm run build

# 构建并预览文档站点
yarn docs:build
yarn docs:preview
```

## 注意事项与常见问题
- 节点类型大小写：建议统一使用 `PascalCase`（如 `Trigger`、`Action`）。若流程定义与插件注册大小写不一致，可能导致找不到插件。

## 许可证

MIT

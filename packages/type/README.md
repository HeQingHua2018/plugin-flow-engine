# @plugin-flow-engine/type

类型定义模块，集中维护核心与 UI 层共享的 TypeScript 类型，避免包之间的重复与耦合。

## 模块划分
- `common.ts`：通用表单与 schema 类型（与运行时无关）：`FieldBase`、`Schema`、`WidgetMap`、`NodeConfig`。
- `core.ts`：流程引擎相关类型：`Node`、`Edge`、`FlowData`、`ExecutionContext`、`ExecutionHistory`、`PluginNodeType`、`NodeStatus` 等。
- `ui.ts`：UI 侧类型：`AntdWidgetKeys`、`AntdWidgetKey`、`WidgetProps`、`DynamicConfigFormRef`、`DynamicFormProps` 等。

## 安装与引用
> 本仓库为 monorepo，内部包通过 workspace 互相引用。外部项目如需使用类型包，请安装并按如下方式引用。

```bash
# 使用 pnpm（外部项目）
pnpm add @plugin-flow-engine/type

# 使用 npm（外部项目）
npm install @plugin-flow-engine/type
```

在代码中引用：

- 完整聚合导出（简单场景）：
```ts
import type {
  FieldBase,
  Schema,
  WidgetMap,
  NodeConfig,
  Node,
  Edge,
  FlowData,
  ExecutionContext,
  ExecutionHistory,
  PluginNodeType,
  NodeStatus,
} from '@plugin-flow-engine/type';
import { AntdWidgetKeys } from '@plugin-flow-engine/type';
```

- 子路径按需导入（推荐，更轻量且边界清晰）：
```ts
import type { Schema, NodeConfig } from '@plugin-flow-engine/type/common';
import type { Node, Edge, FlowData, ExecutionContext, ExecutionHistory, PluginNodeType, NodeStatus } from '@plugin-flow-engine/type/core';
import { AntdWidgetKeys } from '@plugin-flow-engine/type/ui';
```

## 关键类型速览
- `Schema`：表单 schema，包含 `type`、`label` 与字段 `config` 数组。
- `FieldBase`：表单字段定义，包含 `field`、`label`、`type`、`widgetProps` 等。
- `Node` / `Edge`：对齐 React Flow 的节点与边，承载引擎数据于 `data` 字段。
- `FlowData`：完整流程定义，含 `flow` 元数据、`context` 变量、`nodes`、`edges` 与 `global_config`。
- `ExecutionContext`：执行期上下文变量集合。
- `ExecutionHistory`：单次节点执行的历史记录，含时间、结果、条件、并行策略等。
- `PluginNodeType`：插件节点类型（内置字面量 + 字符串开放集合）。
- `NodeStatus`：节点状态枚举（`pending`、`running`、`success`、`failed`）。
- `AntdWidgetKeys` / `AntdWidgetKey`：Antd 控件键集合与联合类型。
- `WidgetProps<T>`：控件通用 props 类型（包含 `value`、`onChange` 等）。

## 使用示例
在 UI 模块中编写控件并使用类型约束：

```tsx
import type { WidgetProps } from '@plugin-flow-engine/type';

const JsonEditor: React.FC<WidgetProps<any>> = ({ value, onChange }) => {
  return <textarea value={JSON.stringify(value)} onChange={(e) => onChange(JSON.parse(e.target.value || '{}'))} />;
};
```

在核心模块中声明流程数据：

```ts
import type { FlowData } from '@plugin-flow-engine/type';

export const flowData: FlowData = {
  flow: { id: 'demo', name: 'Demo', version: '1.0.0', description: '', category: 'demo', enable: true, create_date: '', update_date: '' },
  context: { variables: {} },
  nodes: [],
  edges: [],
  global_config: {},
};
```

## 开发与维护
- 类型集中管理，避免跨包引用第三方库的具体类型（如 antd 的 `FormInstance`），以降低耦合。
- 当引入新能力（插件、控件、引擎配置）时，优先在 `type` 包补充类型并在 `core/ui` 对齐实现。
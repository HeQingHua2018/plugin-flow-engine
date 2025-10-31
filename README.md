# Plugin Flow Engine

本仓库为一个基于插件化架构的前端流程执行引擎的 monorepo，包含核心引擎（core）、界面层（ui）、类型定义（type）与文档站点（doc）。支持通过“节点插件”描述流程的触发、分支、并行、迭代与结束等行为，并提供可注入的节点配置表单与自定义控件体系。

## 安装与启动（仓库开发）

- 环境要求：`Node.js >= 18`、`pnpm >= 8`
- 安装依赖：
  - `pnpm install`
- 启动开发（按包或一次性）：
  - core/type/ui 包一起启动：`pnpm dev`
  - 分包启动：
    - `pnpm --filter @plugin-flow-engine/core dev`
    - `pnpm --filter @plugin-flow-engine/ui dev`
    - `pnpm --filter @plugin-flow-engine/type dev`
  - 文档站点（Dumi）：
    - `pnpm --filter @plugin-flow-engine/doc dev`（本地预览，默认 `http://localhost:8000/`）

## 构建与打包

- 全量构建（推荐）：`pnpm -r build`
- 分包构建：
  - `pnpm --filter @plugin-flow-engine/core build`
  - `pnpm --filter @plugin-flow-engine/ui build`
  - `pnpm --filter @plugin-flow-engine/type build`
  - 文档站点：`pnpm --filter @plugin-flow-engine/doc build`
- 清理构建产物：`pnpm -r run clean`

> 说明：各包使用 Father 构建，产物位于 `es/` 与 `lib/`（按 ESM/CJS），`files` 字段已声明要发布的目录。

## 发布到 npm（包：core/ui/type）

- 前置检查：确保已构建（见上）、各包版本号已更新，并已登录 npm（`npm login` 或设置 `NPM_TOKEN`）。
- 方式一（工作空间一次性发布）：
  - `pnpm -r publish --access public`
- 方式二（推荐：用 Lerna 管理版本与发布）：
  - 改版本：`pnpm run version:lerna`（或 `lerna version`）
  - 构建：`pnpm -r build`
  - 发布：`pnpm run publish:lerna`（或 `lerna publish from-package --yes --access public`）
- 注意：各包 `publishConfig.registry` 已指向 `https://registry.npmjs.org/`，文档包 `@plugin-flow-engine/doc` 为私有将被跳过。

## 文档站点

- 开发：`pnpm --filter @plugin-flow-engine/doc dev`
- 构建：`pnpm --filter @plugin-flow-engine/doc build`
- 预览：`pnpm --filter @plugin-flow-engine/doc preview`

## 目录结构

```
plugin-flow-engine/
├── packages/
│   ├── core/   # 核心执行引擎、插件管理、Hook
│   ├── ui/     # 动态配置表单、控件注入、插件 UI 注册器
│   ├── type/   # TypeScript 类型定义与子路径导出
│   └── doc/    # Dumi 文档站点（私有，不发布）
├── .gitignore
├── package.json           # 顶层工作空间与脚本（dev/build/changelog/clean）
├── pnpm-workspace.yaml    # pnpm 工作空间声明
├── lerna.json             # Lerna 配置（可选地管理版本/发布）
└── 其他工程与配置文件
```

## 各包简要说明

- `@plugin-flow-engine/core`
  - 能力：插件管理器、流程执行引擎、执行历史、事件管理（全局/实例）、上下文管理、规则操作符扩展、React Hook（`useFlowEngine`）。
  - 构建/开发：`pnpm --filter @plugin-flow-engine/core dev` / `pnpm --filter @plugin-flow-engine/core build`
  - 依赖：`@plugin-flow-engine/type`（peer 依赖含 `react`/`react-dom`）。
  - 主要导出：`PluginManagerInstance`、`PluginExecutionEngine`、`BaseNodePlugin`、`useFlowEngine` 等。

- `@plugin-flow-engine/ui`
  - 能力：`DynamicConfigForm` 动态表单、`injectWidget/getWidgets` 控件注入器、`injectNodeSchema/getNodeSchemas` 节点表单注入器、`registerPluginUI/bindPluginsToUI/resolveNodeFormConfig` 插件 UI 注册与解析。
  - 构建/开发：`pnpm --filter @plugin-flow-engine/ui dev` / `pnpm --filter @plugin-flow-engine/ui build`
  - 依赖：`react`、`react-dom`、`antd`、`@xyflow/react`、`@plugin-flow-engine/type`。

- `@plugin-flow-engine/type`
  - 能力：集中维护 Core/UI 共享类型；支持子路径按需导入：`@plugin-flow-engine/type/common`、`/core`、`/ui`。
  - 构建/开发：`pnpm --filter @plugin-flow-engine/type dev` / `pnpm --filter @plugin-flow-engine/type build`
  - 导出：聚合导出与子路径导出（`exports` 字段已配置）。

- `@plugin-flow-engine/doc`（私有包）
  - 能力：Dumi 文档站点（演示组件与模块说明）。
  - 开发/构建/预览：`dev` / `build` / `preview`。

## 常用脚本（顶层）

- `pnpm dev`：通过 Lerna 启动 core/ui/type 的开发模式。
- `pnpm build`：通过 Lerna 构建 core/ui/type（文档请在 doc 包内单独构建）。
- `pnpm clean`：清理依赖与临时产物。
- `pnpm changelog`：生成更新日志到 `packages/doc/docs/versions/changelog.md`。

## 使用与示例（外部项目）

- 安装（按需选择包）：
  - 核心：`pnpm add @plugin-flow-engine/core @plugin-flow-engine/type`
  - UI：`pnpm add @plugin-flow-engine/ui @plugin-flow-engine/type react react-dom antd`
  - 类型：`pnpm add @plugin-flow-engine/type`
- 快速示例：注册插件并执行最小流程（详见各包 README 与文档站点）。


一个基于插件化架构的前端流程执行引擎与配套 React 组件库。支持通过“节点插件”描述流程的触发、分支、并行、迭代与结束等行为，并提供可注入的节点配置表单与自定义控件体系。

## 特性

- 插件化节点：触发、动作、分支、并行、迭代、合并、结束等内置插件，可扩展自定义插件。
- 流程执行引擎：维护上下文变量、执行历史、错误处理与性能监控。
- 动态配置表单：基于 `schema` 自动渲染，支持注入与覆写控件映射（widgets）。
- React 组件：`FlowView` 流程视图、`PluginView` 插件演示；`useFlowEngine` Hook 快速集成。
- TypeScript 类型：完整的流程、节点、边、上下文与插件类型约束。

## 安装（外部项目）

```bash
# 核心（不含 UI）
pnpm add @plugin-flow-engine/core @plugin-flow-engine/type

# UI（React 环境，可选）
pnpm add @plugin-flow-engine/ui @plugin-flow-engine/type react react-dom antd

# 仅类型包（按需）
pnpm add @plugin-flow-engine/type
```

## 快速开始

- 在页面中集成流程引擎（以 Hook 为例）：

```tsx
import { useFlowEngine } from '@plugin-flow-engine/core';

const { engine, executeFlow, executionHistory } = useFlowEngine({
  flowData: yourFlowData,      // FlowData
  initialVariables: { userId: '1' }, // 初始上下文变量
  components: [                      // 可选：注册实例组件（供事件调用）
    { name: 'Demo1', ref: demo1Ref },
  ],
});

// 触发流程执行
await executeFlow();
```

- 渲染动态配置表单（UI 包）：
```tsx
import React, { useRef, useState } from 'react';
import { DynamicConfigForm, injectWidget } from '@plugin-flow-engine/ui';
import { AntdWidgetKeys } from '@plugin-flow-engine/type/ui';
import type { Schema } from '@plugin-flow-engine/type/common';

// 自定义控件（示例）
const JsonEditor: React.FC<{ value: any; onChange: (v: any) => void }> = ({ value, onChange }) => (
  <textarea value={JSON.stringify(value, null, 2)} onChange={(e) => onChange(JSON.parse(e.target.value || '{}'))} />
);

// 注入自定义控件键
injectWidget('json-editor', JsonEditor);

const schema: Schema = {
  type: 'MyAction',
  label: '我的动作配置',
  config: [
    { field: 'title', label: '标题', type: AntdWidgetKeys.Input },
    { field: 'payload', label: '负载', type: 'json-editor' },
  ],
};

export default function DemoForm() {
  const formRef = useRef<any>(null);
  const [value, setValue] = useState<Record<string, any>>({ title: '', payload: {} });

  return (
    <DynamicConfigForm
      ref={formRef}
      schema={schema}
      value={value}
      isValidate
      showButtons
      onChange={setValue}
      onValidateSave={(val) => console.log('validated save', val)}
    />
  );
}
```

## 插件与表单

- 注册或获取插件管理器：

```ts
import { PluginManagerInstance } from '@plugin-flow-engine/core';

const pm = PluginManagerInstance();
pm.registerPlugin(new MyNodePlugin());
```

- 在插件中返回表单 `schema` 与自定义控件：

```ts
import { BaseNodePlugin } from '@plugin-flow-engine/core';

class MyNodePlugin extends BaseNodePlugin {
  pluginNodeType = 'MyNode';
  pluginNodeTypeName = '我的节点';
  getNodeFormConfig() {
    return {
      schema: {
        type: this.pluginNodeType,
        label: this.pluginNodeTypeName,
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
import { injectNodeSchema, injectWidget } from '@plugin-flow-engine/ui';

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
- 类型：`FlowData`、`Node`、`Edge`、`ExecutionHistory`、`NodeConfig`、`WidgetProps`

## 开发与调试

```bash
# 安装依赖
pnpm install

# 文档开发（Dumi）
cd packages/doc
pnpm dev

# 构建并预览文档站点
cd packages/doc
pnpm run build
pnpm run preview
```

## 注意事项与常见问题
- 节点类型大小写：建议统一使用 `PascalCase`（如 `Trigger`、`Action`）。若流程定义与插件注册大小写不一致，可能导致找不到插件。

## 许可证

MIT

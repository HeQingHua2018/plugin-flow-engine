# Plugin Flow Engine

一个基于插件化架构的前端流程执行引擎与配套 React 组件库。采用 monorepo 架构，包含核心引擎（core）、界面层（ui）、公共工具（common）与文档站点（doc）。支持通过"节点插件"描述流程的触发、分支、并行、迭代与结束等行为，并提供可注入的节点配置表单与自定义控件体系。

## 安装与启动（仓库开发）

- 环境要求：`Node.js >= 18.20.4`、`pnpm >= 10.18.2`
- 安装依赖：
  - `pnpm install`
- 启动开发（按包或一次性）：
  - core/common/ui/doc 包一起启动：`pnpm dev`
  - 分包启动：
    - `pnpm --filter @chloehe/logic-engine-core dev`
    - `pnpm --filter @chloehe/logic-engine-ui dev`
    - `pnpm --filter @chloehe/logic-engine-common dev`
  - 文档站点（Dumi）：
    - `pnpm --filter @chloehe/logic-engine-doc dev`

## 构建与打包

- 全量构建（推荐）：`pnpm build`
- 分包构建：
  - `pnpm --filter @chloehe/logic-engine-core build`
  - `pnpm --filter @chloehe/logic-engine-ui build`
  - `pnpm --filter @chloehe/logic-engine-common build`
  - 文档站点：`pnpm --filter @chloehe/logic-engine-doc build`
- 清理构建产物：`pnpm -r run clean`

> 说明：各包使用 Father 构建，产物位于 `es/` 与 `lib/`（按 ESM/CJS），`files` 字段已声明要发布的目录。

## 发布到 npm（包：core/ui/common/react/utils）

- 前置检查：确保已构建（见上）、各包版本号已更新，并已登录 npm（`npm login` 或设置 `NPM_TOKEN`）。
- 发布方式：
  - `pnpm -r publish --access public`
- 注意：各包 `publishConfig.registry` 已指向 `https://registry.npmjs.org/`，文档包 `@chloehe/logic-engine-doc` 为私有将被跳过。

## 目录结构

```
logic-engine/
├── packages/
│   ├── common/ # 公共模块、工具函数、类型定义
│   ├── core/   # 核心执行引擎、插件管理、Hook
│   ├── ui/     # 动态配置表单、控件注入、插件 UI 注册器
│   └── doc/    # Dumi 文档站点（私有，不发布）
├── .gitignore
├── package.json           # 顶层工作空间与脚本（dev/build/test）
├── pnpm-workspace.yaml    # pnpm 工作空间声明
└── 其他工程与配置文件
```

## 各包简要说明
- `@chloehe/logic-engine-common`
  - 能力：提供通用类型定义、操作符、错误处理、组件/上下文管理器等基础功能。
  - 导出：聚合导出。

- `@chloehe/logic-engine-core`
  - 能力：提供流程执行引擎、插件管理、Hook、流程版本/调试/重放等核心功能。
  - 导出：聚合导出。

- `@chloehe/logic-engine-ui`
  - 能力：提供动态配置表单、条件规则编辑器、流程可视化 FlowView、控件注入、插件 UI 注册器等 UI 功能。
  - 导出：聚合导出。

## 快速上手

### 安装依赖

```bash
# 核心
pnpm add @chloehe/logic-engine-core 

# UI
pnpm add @chloehe/logic-engine-ui 

# 公共模块（工具函数、类型定义等）
pnpm add @chloehe/logic-engine-common
```

### 集成流程引擎

- 在页面中集成流程引擎（以 Hook 为例）：

```tsx
import { useFlowEngine } from '@chloehe/logic-engine-core';

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
import { DynamicConfigForm, injectWidget, WidgetKeys, type Schema } from '@chloehe/logic-engine-ui';

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
    { field: 'title', label: '标题', type: WidgetKeys.Input },
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

# @plugin-flow-engine/ui

UI 模块，提供动态配置表单、控件注入器与插件 UI 注册器等能力，专注于界面层的渲染与交互，不包含执行引擎逻辑。

## 功能概览
- 动态配置表单：`DynamicConfigForm` 根据 `schema` 自动渲染表单。
- 控件注入与覆写：`injectWidget`、`getWidgets` 支持控件映射扩展与查询。
- 节点表单 schema 注入：`injectNodeSchema`、`getNodeSchemas` 管理节点类型的表单配置。
- 插件 UI 注册器：`registerPluginUI`、`bindPluginsToUI`、`resolveNodeFormConfig` 将“插件 → UI 表单”串起来。
- Antd 组件键：`AntdWidgetKeys` 与 `AntdWidgetKey` 统一控件键名提示。

## 安装与引用
> 本仓库为 monorepo，内部包通过 workspace 互相引用。外部项目如需单独使用 ui 包，请安装并按如下方式引用。

```bash
# 使用 pnpm（外部项目）
pnpm add @plugin-flow-engine/ui @plugin-flow-engine/type antd react react-dom

# 使用 npm（外部项目）
npm install @plugin-flow-engine/ui @plugin-flow-engine/type antd react react-dom
```

在代码中引用：

```ts
import {
  DynamicConfigForm,
  injectWidget,
  injectNodeSchema,
  getWidgets,
  getNodeSchemas,
  registerPluginUI,
  bindPluginsToUI,
  resolveNodeFormConfig,
  AntdWidgetKeys,
  getWidgetByType,
} from '@plugin-flow-engine/ui';

import type { Schema, NodeConfig, WidgetProps, AntdWidgetKey } from '@plugin-flow-engine/type';
```

## 使用示例
1) 注入自定义控件并渲染动态表单：

```tsx
import React, { useRef, useState } from 'react';
import { DynamicConfigForm, injectWidget, AntdWidgetKeys } from '@plugin-flow-engine/ui';
import type { Schema } from '@plugin-flow-engine/type';

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

const DemoForm = () => {
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
};
```

2) 管理节点类型的表单 schema：

```ts
import { injectNodeSchema, getNodeSchemas, bindPluginsToUI, resolveNodeFormConfig } from '@plugin-flow-engine/ui';
import { AntdWidgetKeys } from '@plugin-flow-engine/type';
import { PluginManagerInstance } from '@plugin-flow-engine/core';

// 覆写/注入某节点类型的 schema
injectNodeSchema('MyAction', {
  type: 'MyAction',
  label: '我的动作节点配置',
  config: [
    { field: 'title', label: '标题', type: AntdWidgetKeys.Input },
    { field: 'count', label: '次数', type: AntdWidgetKeys.InputNumber },
  ],
});

// 获取所有已注册的节点 schema
console.log(getNodeSchemas());

// 批量绑定：从插件管理器读取 schema/widgets 并注入
const pm = PluginManagerInstance();
bindPluginsToUI(pm);

// 运行时解析某节点类型的最终表单配置
const { schema } = resolveNodeFormConfig(pm, 'MyAction');
```

## 开发与构建
- 开发：`pnpm --filter @plugin-flow-engine/ui dev`
- 构建：`pnpm --filter @plugin-flow-engine/ui build`（Father）
- 清理：`pnpm --filter @plugin-flow-engine/ui run clean`

更多示例与最佳实践，请参见文档站点与仓库内 `packages/doc`。
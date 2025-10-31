---
title: UI 模块
toc: menu
order: 2
---
# UI 模块

## 模块概述
提供动态配置表单、控件注入器与插件 UI 注册器，专注界面渲染与交互，不包含执行引擎。

## 功能
- 动态表单：`DynamicConfigForm` 基于 `schema` 自动渲染。
- 控件注入：`injectWidget`、`getWidgets` 支持扩展与查询。
- 节点表单：`injectNodeSchema`、`getNodeSchemas` 管理节点类型的表单配置。
- 插件 UI：`registerPluginUI`、`bindPluginsToUI`、`resolveNodeFormConfig` 串联“插件 → 表单”。
- Antd 键名：`AntdWidgetKeys` 与 `AntdWidgetKey` 统一控件键名提示。

## 安装

```bash
pnpm add @plugin-flow-engine/ui @plugin-flow-engine/type
```

如需在 React 中使用：

```bash
pnpm add react react-dom
```

## 示例

```tsx
import React, { useState, useEffect } from 'react';
import type { Schema } from '@plugin-flow-engine/type/common';
import type { WidgetProps } from '@plugin-flow-engine/ui';
import { DynamicConfigForm, injectWidget, AntdWidgetKeys } from '@plugin-flow-engine/ui';

// 自定义 JSON 编辑器控件（带错误处理与受控状态）
const JsonEditor: React.FC<WidgetProps<any>> = ({ value, onChange }) => {
  const [text, setText] = useState(() => JSON.stringify(value ?? {}, null, 2));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(JSON.stringify(value ?? {}, null, 2));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setText(next);
    try {
      const parsed = JSON.parse(next || '{}');
      setError(null);
      onChange(parsed);
    } catch (err: any) {
      setError(err?.message || 'JSON 解析失败');
    }
  };

  return (
    <div>
      <textarea
        style={{ width: '100%', minHeight: 120, fontFamily: 'monospace' }}
        value={text}
        onChange={handleChange}
      />
      {error && <div style={{ marginTop: 8, color: 'red' }}>错误：{error}</div>}
    </div>
  );
};

// 注册自定义控件
injectWidget('json-editor', JsonEditor);

// 定义 Schema（从 type/common 子路径导入类型）
const schema: Schema = {
  type: 'MyAction',
  label: 'Widget 注入示例',
  config: [
    { 
        field: 'name', 
        type: AntdWidgetKeys.Input, 
        label: '名称', 
        formItemProps: {
          rules: [{ required: true, message: '请输入名称' }],
        }
    },
    { 
        field: 'count', 
        type: AntdWidgetKeys.InputNumber, 
        label: '数量' 
    },
    { 
        field: 'enabled', 
        type: AntdWidgetKeys.Switch, 
        label: '启用' 
    },
    { 
        field: 'config', 
        type: 'json-editor', 
        label: '配置(JSON)' 
    },
  ],
};

export default () => {
  const [value, setValue] = useState<any>({ name: 'demo', count: 1, enabled: true, config: { foo: 'bar' } });
  return (
    <div>
      <DynamicConfigForm schema={schema} value={value} onChange={setValue} />
      <pre style={{ marginTop: 16 }}>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
};
```

## 插件 UI 注册与解析

- `registerPluginUI(nodeType, ui)`：在 UI 层手动注册某个插件的表单 `schema` 与 `widgets`，适合不经插件管理器的场景或测试。
- `bindPluginsToUI(pm)`：从插件管理器读取每个插件的 `getNodeFormConfig()`，批量注入 `schema` 与 `widgets`。推荐在应用启动时调用一次。
- `resolveNodeFormConfig(pm, nodeType)`：解析某节点类型的最终表单配置。优先使用 UI 注入器中的 `schema`，否则回退到插件自身的 `schema`；同时确保插件提供的 `widgets` 被注入。

示例 1：批量绑定插件 UI

```ts
import { PluginManagerInstance, BaseNodePlugin } from '@plugin-flow-engine/core';
import { bindPluginsToUI } from '@plugin-flow-engine/ui';

class MyActionPlugin extends BaseNodePlugin {
  pluginNodeType = 'MyAction';
  pluginNodeTypeName = '我的动作';
  getNodeFormConfig() {
    return {
      schema: {
        type: 'MyAction',
        label: '我的动作配置',
        config: [
          { field: 'title', label: '标题', type: 'ant_Input' },
        ],
      },
      widgets: {
        'json-editor': ({ value, onChange }: any) => (
          <textarea value={JSON.stringify(value ?? {}, null, 2)} onChange={(e) => onChange(JSON.parse(e.target.value || '{}'))} />
        ),
      },
    };
  }
}

const pm = PluginManagerInstance();
pm.registerPlugin(new MyActionPlugin());

// 将所有插件的 schema 与 widgets 注入到 UI
bindPluginsToUI(pm);
```

示例 2：在运行时解析节点的表单配置

```ts
import { resolveNodeFormConfig } from '@plugin-flow-engine/ui';
import { PluginManagerInstance } from '@plugin-flow-engine/core';

const pm = PluginManagerInstance();
const { schema } = resolveNodeFormConfig(pm, 'MyAction');
// 如在 FlowView 中：打开抽屉时根据 node.data.pluginNodeType 解析
// const { schema } = resolveNodeFormConfig(pm, node.data.pluginNodeType);
```

示例 3：手动注册某插件的 UI 元数据

```ts
import { registerPluginUI } from '@plugin-flow-engine/ui';

registerPluginUI('MyAction', {
  schema: {
    type: 'MyAction',
    label: '我的动作配置',
    config: [
      { field: 'title', label: '标题', type: 'ant_Input' },
    ],
  },
  widgets: {
    'json-editor': /* React 组件 */ (() => null) as any,
  },
});
```

行为说明

- 注入优先级：UI 注入器中的 `schema` 优先；未注入则回退到插件提供的 `schema`。
- 自动注入：`bindPluginsToUI(pm)` 会自动注入插件的 `schema` 与 `widgets`。
- 兜底处理：即使未调用 `bindPluginsToUI`，`resolveNodeFormConfig(pm, nodeType)` 也会返回插件的 `schema` 并自动注入其 `widgets`，因此表单可正常渲染；但该 `schema` 不会记录进注入器的注册表（`getNodeSchemas()` 查看不到），如需全局查询或覆写，建议调用 `bindPluginsToUI` 或 `registerPluginUI`。


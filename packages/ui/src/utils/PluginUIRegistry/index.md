# 插件 UI 配置注册管理器

## 功能介绍

PluginUIRegistry 是 UI 层的插件配置注册管理器，负责管理插件类型与表单配置的映射关系。通过此模块，可以将插件类型（pluginNodeType）与对应的表单 schema 和控件进行绑定，实现节点配置表单的动态渲染。

## 主要特性

- 集中管理插件的 UI 配置
- 支持控件注册和映射
- 提供灵活的配置查询和管理 API
- 支持批量注册多个插件配置

## API 文档

| 函数名 | 描述 | 签名 | 参数 | 返回值 |
|--------|------|------|------|--------|
| registerWidget | 注册控件映射 | `registerWidget(type: string, component: React.ElementType<any>): string` | - `type`: 控件映射键<br>- `component`: React 组件 | 返回类型键，便于链式调用或存储 |
| registerNodeSchema | 注册节点表单 schema | `registerNodeSchema(pluginNodeType: string \| PluginNodeType, schema: Schema): string` | - `pluginNodeType`: 插件类型<br>- `schema`: 表单 schema | 返回插件类型，便于链式调用 |
| registerPluginUI | 注册插件 UI 配置（支持 schema 与控件） | `registerPluginUI(pluginNodeType: PluginNodeType \| string, ui: NodeConfig): PluginNodeType \| string` | - `pluginNodeType`: 插件类型<br>- `ui`: 节点表单配置（包含 schema 与控件映射） | 返回插件类型，便于链式调用 |
| bindPluginUI | 绑定插件 UI 配置，与 registerPluginUI 等价 | `bindPluginUI(pluginNodeType: PluginNodeType \| string, uiConfig: NodeConfig): PluginNodeType \| string` | - `pluginNodeType`: 插件类型<br>- `uiConfig`: 节点表单配置对象 | 返回插件类型，便于链式调用 |
| getAllNodeUIConfigs | 获取已注册的所有节点 UI 配置 | `getAllNodeUIConfigs(): Record<string, NodeConfig>` | 无 | 插件类型到配置的映射 |
| getNodeUIConfig | 获取特定插件的 UI 配置 | `getNodeUIConfig(pluginNodeType: PluginNodeType \| string): NodeConfig \| undefined` | - `pluginNodeType`: 插件类型 | UI 配置对象或 undefined |
| hasNodeUIConfig | 检查插件 UI 配置是否已注册 | `hasNodeUIConfig(pluginNodeType: PluginNodeType \| string): boolean` | - `pluginNodeType`: 插件类型 | 是否已注册 |
| removeNodeUIConfig | 移除插件 UI 配置 | `removeNodeUIConfig(pluginNodeType: PluginNodeType \| string): boolean` | - `pluginNodeType`: 插件类型 | 是否成功移除 |
| resolveNodeFormConfig | 解析节点的最终表单配置 | `resolveNodeFormConfig(pluginNodeType: PluginNodeType \| string): NodeConfig \| null` | - `pluginNodeType`: 插件类型 | 解析后的表单配置对象或 null |
| registerMultiplePluginUI | 批量注册多个插件 UI 配置 | `registerMultiplePluginUI(configs: Record<PluginNodeType \| string, NodeConfig>): void` | - `configs`: 插件类型到配置的映射 | 无 |
| createNodeConfig | 创建节点配置的帮助函数 | `createNodeConfig(schema: Schema, widgets?: Record<string, React.ElementType<any>>): NodeConfig` | - `schema`: 表单 schema<br>- `widgets`: 可选的控件映射 | 完整的 NodeConfig 对象 |

## 使用示例

### 基本用法

```typescript
import { registerPluginUI, bindPluginUI, createNodeConfig, WidgetKeys } from '@chloehe/logic-engine-ui';
import { PluginNodeType } from '@chloehe/logic-engine-common';

const triggerConfig = createNodeConfig({
  type: PluginNodeType.Trigger,
  label: '触发节点',
  config: [
    {
      field: 'event_name',
      label: '事件名称',
      type: WidgetKeys.Input,
      widget: WidgetKeys.Input,
      formItemProps: { required: true },
      widgetProps: { placeholder: '请输入事件名称' }
    }
  ]
});

registerPluginUI(PluginNodeType.Trigger, triggerConfig);
```

### 获取和使用注册的配置

```typescript
import { resolveNodeFormConfig, getAllNodeUIConfigs } from '@chloehe/logic-engine-ui';

const config = resolveNodeFormConfig(PluginNodeType.Trigger);
if (config) {
  console.log('获取到表单配置:', config.schema);
}

const allConfigs = getAllNodeUIConfigs();
console.log('所有插件UI配置:', Object.keys(allConfigs));
```

### 批量注册多个配置

```typescript
import { registerMultiplePluginUI, WidgetKeys } from '@chloehe/logic-engine-ui';
import { PluginNodeType } from '@chloehe/logic-engine-common';

registerMultiplePluginUI({
  [PluginNodeType.Trigger]: {
    schema: {
      type: PluginNodeType.Trigger,
      label: '触发节点',
      config: [{ field: 'event_name', label: '事件名称', type: WidgetKeys.Input }]
    }
  },
  [PluginNodeType.Action]: {
    schema: {
      type: PluginNodeType.Action,
      label: '动作节点',
      config: [{ field: 'action_type', label: '动作类型', type: WidgetKeys.Select }]
    }
  }
});
```

## 关键优势

1. **集中管理**：插件 UI 配置集中管理，便于维护和定制
2. **强绑定**：表单配置与插件类型强绑定，逻辑清晰
3. **低耦合**：与底层控件注入器解耦，职责分离
4. **可扩展性**：提供丰富的 API，方便扩展和定制

## 与 FormWidgetInjector 的关系

PluginUIRegistry 基于 FormWidgetInjector 实现，两者职责分离：

- **FormWidgetInjector**：负责控件的注册、映射和查找
- **PluginUIRegistry**：负责插件 UI 配置（schema 和控件）的注册、查询和解析

PluginUIRegistry 在注册插件 UI 配置时，会自动将控件注册到 FormWidgetInjector 中。
---
category: Components
title: FlowView 组件 # 组件的标题，会在菜单侧边栏展示
toc: content # 在页面右侧展示锚点链接
group: # 分组
  title: 工具类演示 # 所在分组的名称
  order: 1 # 分组排序，值越小越靠前
---

# FlowView 组件

> 该组件由 `@plugin-flow-engine/ui` 包提供并随包发布。

## 基础示例
<code src="./demo/basic.tsx"></code>

## API

### FlowViewProps

| 参数名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `FlowData` | - | 完整流程数据结构。类型详情：[FlowData](/modules/type#flowdata)。 |
| `initialValue` | `Record<string, Record<string, any>>` | `undefined` | 按节点 `id` 提供初始配置。初始值合并顺序：`props.initialValue[nodeId]` > 表单 `schema.defaultValue` > `{}`。 |
| `onNodeConfigChange` | `(nodeId: string, config: Record<string, any>) => void` | - | 节点配置保存回调（在“保存”或“校验并保存”时触发；实时修改不外抛）。 |
| `isValidate` | `boolean` | `true` | 抽屉关闭或“校验并保存”时是否校验表单。`true` 时使用 `validateFields` 校验；`false` 时直接保存当前值。 |

### 交互说明
- 点击节点打开右侧配置抽屉，表单 `schema` 来自插件管理器的 `pluginNodeType`。
- 修改表单不会立即保存；点击“保存”仅保存当前节点配置。
- 关闭抽屉时弹出确认框：根据 `isValidate` 决定是否校验后保存；取消则不保存直接关闭。
- 顶部“保存流程”按钮会弹窗预览所有节点配置（JSON）。
- 抽屉标题显示 `data.label` 与 `data.pluginNodeType`。

### 类型说明
- 最小图结构：`{ nodes: Node[]; edges: Edge[] }`（请参见 [Node](/modules/type#nodedata)、[Edge](/modules/type#edgedata)）
- 插件节点类型：[PluginNodeType](/modules/type#pluginnodetype)
- 动态表单 Schema：[Schema](/modules/type#schema)
- 完整流程数据：[FlowData](/modules/type#flowdata)
- 类型导入示例：`import type { Node, Edge, PluginNodeType } from '@plugin-flow-engine/type'`

## 自定义插件与覆盖插件 Schema 示例
### 自定义插件
```ts
import { BaseNodePlugin } from "@plugin-flow-engine/core";
import { NodeConfig } from "@plugin-flow-engine/type";
import schema from "./schema";
class MyActionPlugin extends BaseNodePlugin {
  pluginNodeTypeName = '我的操作';
  pluginNodeType = 'MyAction';
  getNodeFormConfig(): NodeConfig | null {
    return schema;
  }
}
export default MyActionPlugin;
```
### 自定义插件表单 Schema
```ts

import { AntdWidgetKeys, NodeConfig } from "@plugin-flow-engine/type";
import customInputWidget from "./customInputWidget";

const schema: NodeConfig = {
 schema:{
    type:"MyAction",
    label:"我的操作",
    config:[
      {
        type:AntdWidgetKeys.Input,
        label:"操作名称",
        field:"name",
        formItemProps:{
          required:true,
        }
      },
      {
          type: "custom-input",
          widget: 'custom-input',
          label: "操作参数",
          field: "params",
          formItemProps: {
              required: true,
          },
          widgetProps:{
            placeholder:"请输入操作参数",
          }
      },
    ]
 },
 widgets:{
    'custom-input': customInputWidget,
 }
 
};
export default schema;

```
### 自定义控件示例
```ts
import { WidgetProps } from "@plugin-flow-engine/type";
import { Input } from "antd";

const customInputWidget: React.FC<WidgetProps<any>> = ({value,onChange, ...reset}) => {
  return (
   <div>
     <label>我是自定义的控件哦</label>
     <Input
      {...reset}
      value={value}
      onChange={onChange}
    />
   </div>
  );
};

export default customInputWidget;
```
### 覆盖内建插件默认 Schema（示例为覆盖 `Action` 的表单）

```ts
import { BuiltInPluginNodeTypes } from '@plugin-flow-engine/type';
import { registerPluginUI } from '@plugin-flow-engine/ui';
import schema from './plugins/MyAction/schema';

registerPluginUI(BuiltInPluginNodeTypes.Action, schema);
```

### 启用示例中的自定义插件与覆盖：请在示例页引入插件注册入口

```ts
// packages/doc/components/FlowView/demo/basic.tsx
import '../plugins';
```





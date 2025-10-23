---
category: Components
title: FlowView 组件 # 组件的标题，会在菜单侧边栏展示
toc: content # 在页面右侧展示锚点链接
group: # 分组
  title: 工具类演示 # 所在分组的名称
  order: 1 # 分组排序，值越小越靠前
---

# FlowView 组件

## 基础示例
<code src="./demo/basic.tsx"></code>
## API

### FlowViewProps

| 参数名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `FlowData` | - | 流程数据，包含节点与边。 |
| `initialValue` | `Record<string, Record<string, any>>` | `undefined` | 按节点 `id` 提供初始配置。初始值优先级：本地缓存 > `props.initialValue[nodeId]` > 表单 `schema.defaultValue` > `{}`。 |
| `onNodeConfigChange` | `(nodeId: string, config: Record<string, any>) => void` | - | 节点配置保存回调（在“保存”或“校验并保存”时触发；实时修改不外抛）。 |
| `isValidate` | `boolean` | `true` | 抽屉关闭或“校验并保存”时是否校验表单。`true` 时使用 `validateFields` 校验；`false` 时直接保存当前值。 |

### 交互说明
- 点击节点打开右侧配置抽屉，表单 `schema` 来自插件管理器的 `nodeType`。
- 修改表单不会立即保存；点击“保存”仅保存当前节点配置。
- 关闭抽屉时弹出确认框：根据 `isValidate` 决定是否校验后保存；取消则不保存直接关闭。
- 顶部“保存流程”按钮会弹窗预览所有节点配置（JSON）。
- 抽屉标题显示 `data.label` 与 `data.nodeType`。

### 类型说明
- `FlowData`: `{ nodes: Node[]; edges: Edge[] }`
- `Node`: 继承 `@xyflow/react` 的 `Node`, 可扩展任意属性，
- `Edge`: 继承 `@xyflow/react` 的 `Edge`, 可扩展任意属性，





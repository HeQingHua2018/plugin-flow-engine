---
category: Components
title: 动态表单组件 # 组件的标题，会在菜单侧边栏展示
toc: content # 在页面右侧展示锚点链接
group: # 分组
  title: 基础组件 # 所在分组的名称
  order: 1 # 分组排序，值越小越靠前
---
# DynamicConfigForm 组件

## 组件概述

通过schema动态渲染配置表单，支持自定义控件

## 基础示例

<code src="./demo/basic.tsx"></code>

## API

### Props 属性

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| schema | [Schema](#schema) | - | 表单配置schema，定义表单字段结构 |
| value | Record<string, any> | - | 当前表单值 |
| onChange | (value: Record<string, any>) => void | - | 值变化时的回调函数 |
| renderFooter | () => ReactNode | - | 自定义页脚渲染函数 |

### Ref 实例

| 属性名 | 类型 | 说明 |
| :--- | :--- | :--- |
| form | FormInstance | Ant Design的Form实例，用于外部控制表单 |

### Schema

| 属性名 | 类型 | 说明 |
| :--- | :--- | :--- |
| type | string | 节点类型标识 |
| label | string | 节点标签名称 |
| config | [FieldBase[]](#fieldbase) | 字段配置数组 |

### FieldBase

| 属性名 | 类型 | 说明 |
| :--- | :--- | :--- |
| type | WidgetKey | 控件类型标识 |
| widget | WidgetKey | 自定义控件类型（可选，优先级高于type） |
| field | string | 字段名 |
| label | string | 字段标签 |
| formItemProps | Omit<FormItemProps, 'initialValue'> | Ant Design Form.Item属性 |
| widgetProps | Omit<Record<string, any>, 'value' \| 'onChange'> | 控件属性 |
| defaultValue | any | 字段默认值 |
| description | string | 字段描述 |
| dependsOn | { field: string, value: any \| ((value: any) => boolean) } | 字段显示依赖条件 |

## 使用说明

### 自定义控件注入

DynamicConfigForm 支持通过 `injectWidgets` 或 `injectWidget` 函数注入自定义控件，如下示例：

```ts
import { injectWidgets } from '@chloehe/logic-engine-ui';
import CustomWidget from './demo/CustomWidget';

// 批量注入自定义组件
const customwidgetMap = {
  'custom_widget': CustomWidget,
};

injectWidgets(customwidgetMap);
```

### 条件显示字段

通过配置 `dependsOn` 属性，可以实现字段的条件显示：

```typescript
const fieldWithDependency = {
  field: 'detail',
  label: '详情',
  type: 'text',
  dependsOn: {
    field: 'showDetail',
    value: true
  }
};
```

## 最佳实践 

- 使用 `schema` 定义清晰的表单结构
- 对于复杂的表单逻辑，可以使用 `dependsOn` 实现条件显示
- 通过 `renderFooter` 自定义底部操作区，适配不同业务场景
- 使用 `onChange` 监听表单值变化，实现实时响应


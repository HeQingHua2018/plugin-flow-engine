---
title: 自定义控件开发规范 
order: 3
toc: menu 
---

# 自定义控件开发规范

## 总览

Plugin Flow Engine 支持为节点配置表单注入自定义控件（widget）：
- 默认内置一组基于 Ant Design 的控件映射，以及少量自定义控件
- 可注册自定义控件组件（实现或复用 `BaseWidgetProps<T>`）
- 在节点的 `schema` 中通过 `type` 或 `widget` 指定渲染控件，并用 `widgetProps` 传递额外属性
- 渲染优先级：`widget` > `type` > 兜底 `ant_Input`
- 相关类型速查：参见 [Schema](./types#schema)、[Field](./types#field)、[NodeConfig](./types#nodeconfig)、[BaseWidgetProps](./types#basewidgetprops)、[WidgetProps](./types#widgetprops)

## 外部如何使用自定义控件

- 注册并注入自定义控件组件
```ts
import { injectWidget } from 'plugin-flow-engine';
import type { BaseWidgetProps } from 'plugin-flow-engine';

function MyWidget(props: BaseWidgetProps<string>) {
  const { value, onChange, placeholder } = props;
  return (
    <input
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
// my-widget 为自定义控件的键名 重复注册会覆盖之前的组件
injectWidget('my-widget', MyWidget);
```

- 在节点 `schema` 中使用控件
```ts
import type { NodeConfig } from 'plugin-flow-engine';

const nodeConfig: NodeConfig = {
  schema: {
    type: 'form',
    label: '节点配置',
    config: [
      {
        field: 'title',
        label: '标题',
        type: 'ant_Input',
        formItemProps: { required: true }, // formItem 属性
        widgetProps: { placeholder: '请输入标题' }, // 控件额外属性
        defaultValue: 'Hello',
      },
      {
        field: 'content',
        label: '内容',
        widget: 'my-widget', // 指定自定义控件，优先级高于 type
        widgetProps: { placeholder: '自定义控件示例' },
      },
      {
        field: 'advanced',
        label: '高级配置',
        type: 'ant_Select',
        widgetProps: {
          options: [
            { label: '开启', value: true },
            { label: '关闭', value: false },
          ],
        },
        defaultValue: false,
      },
      {
        field: 'advancedKey',
        label: '高级参数',
        type: 'ant_Input',
        dependsOn: {
          field: 'advanced',
          value: (v: any) => Boolean(v), // 仅当 advanced 为真时显示
        },
      },
    ],
  },
};
```

## API

### BaseWidgetProps
```ts
export interface BaseWidgetProps<T> {
  /** 当前值 */
  value: T;
  /** 值变化回调 */
  onChange: (value: T) => void;
  /** 其他额外属性 */
  [key: string]: any;
}

export type WidgetProps<T, U = object> = BaseWidgetProps<T> & U;
```
- 所有控件必须支持受控属性：`value` 与 `onChange`
- 所有控件的props定义 `widgetProps` 

### Schema 与 Field
```ts
interface Field {
  /** 控件类型（规范化键），如：ant_Input、ant_Input.Password、ant_DatePicker.RangePicker */
  type: string;
  /** 指定控件映射键（优先级最高），如：my-widget、rich-text */
  widget?: string;
  /** 字段名称 */
  field: string;
  /** 字段标签 */
  label: string;
  /** 表单项属性（除 initialValue） */
  formItemProps?: Record<string, any>;
  /** 控件属性（例如 options、placeholder 等） */
  widgetProps?: Record<string, any>;
  /** 默认值（用于初始渲染） */
  defaultValue?: any;
  /** 字段描述（帮助信息） */
  description?: string;
  /** 依赖条件，用于动态显隐 */
  dependsOn?: {
    field: string;
    value: any | ((value: any) => boolean);
  };
}

interface Schema {
  type: string; //  节点key -保持唯一
  label: string; // 节点名
  config: Field[]; // 配置项
}
```

### NodeConfig
```ts
export interface NodeConfig {
  schema: Schema;
  /** 局部控件映射（可覆盖或补充全局映射） */
  widgets?: { [key: string]: React.ElementType };
  [key: string]: any;
}
```
- 通过 `widgets` 可在节点级别注入或覆盖控件映射
- 全局映射由内置控件与外部 `injectWidget` 共同组成


## 内置控件
- 当前内置 AntD 控件键：
  - `ant_Input`
  - `ant_Input.Password`
  - `ant_Input.TextArea`
  - `ant_Input.Search`
  - `ant_InputNumber`
  - `ant_Select`
  - `ant_Checkbox`
  - `ant_Checkbox.Group`
  - `ant_Radio.Group`
  - `ant_Switch`
  - `ant_DatePicker`
  - `ant_DatePicker.RangePicker`
  - `ant_TimePicker`
  - `ant_Slider`
  - `ant_Cascader`
  - `ant_TreeSelect`
  - `ant_Rate`
  - `ant_AutoComplete`
  - `ant_Mentions`
  - `ant_Upload`
  - `ant_Transfer`
  - `ant_ColorPicker`
- 自定义的控件
  - `key-value-editor`：键值对编辑器（复杂对象类型）
- 渲染优先顺序与兜底：
  - 优先使用 `widget` 指定的控件；其次尝试 `type`；最后回退到 `ant_Input`

## 最佳实践

- 在控件内部仅处理受控数据，不直接操作外部状态
- 使用 `dependsOn` 实现按条件显隐，避免复杂的外部联动逻辑
- 将通用控件以 `injectWidget` 方式注册为全局，节点级特殊控件放入 `NodeConfig.widgets`
- `formItemProps` 不建议设置 `initialValue`，统一用 `defaultValue` 控制初始值

## 示例小结
- 注册控件：`injectWidget('my-widget', MyWidget)`
- 使用控件：在 `schema.config` 中设置 `widget: 'my-widget'`
- 动态显隐：配置 `dependsOn` 来描述显示条件
- 兜底策略：未命中映射时自动回退到 `ant_Input`
## 自定义控件示例
<code src="../../src/core/widget/components/KeyValueEditor.tsx" ></code>

## 键常量与开放扩展

- 设计目标：提供常用控件键的智能提示，不限制外部扩展自由。
- 我们导出了一组“已知控件键”的常量，方便 IDE 提示与防止拼写错误；字段类型仍保持 `string`，不会因为不在常量里而报类型错误。

```ts
import { AntdWidgetKeys, injectWidget } from 'plugin-flow-engine';

// 使用常量获得提示（推荐），也可直接字符串
const schema = {
  type: 'Demo',
  label: '示例',
  config: [
    { field: 'title', label: '标题', type: AntdWidgetKeys.Input },
    { field: 'desc', label: '描述', type: 'ant_Input.TextArea' },
    { field: 'ext', label: '扩展控件', widget: 'my-rich-text' },
  ],
};

// 注册扩展控件（不会因不在常量中而报错）
injectWidget('my-rich-text', MyRichTextComponent);
```

- 兜底策略：
  - 渲染优先级为 `widget > type > ant_Input > 简单 Input`
  - 未命中映射时，在开发环境会打印一次性警告并自动回退，避免运行中断

**为什么不强约束联合类型？**
- 联合类型会阻止第三方或团队外部插件自由扩展键名，维护成本高且不稳定
- 当前方案提供提示但不强制，开放性与体验兼顾

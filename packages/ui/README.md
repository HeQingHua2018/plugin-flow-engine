# @chloehe/logic-engine-ui

插件流程引擎 UI 组件库，提供流程可视化、动态配置表单、规则编辑器等 React 组件。

## 目录结构

```
src/
├── components/         # React 组件
│   ├── DynamicConfigForm/  # 动态配置表单
│   ├── FlowConsole/        # 流程控制台
│   ├── FlowView/           # 流程可视化编辑器
│   └── RuleEditor/         # 规则编辑器
├── utils/              # 工具类
│   ├── FormWidgetInjector/ # 表单控件注入器
│   └── PluginUIRegistry/   # 插件 UI 注册器
├── widget/             # 表单控件
├── types.ts            # 类型定义
└── index.ts            # 聚合导出
```

## 核心组件

### DynamicConfigForm

基于 schema 的动态配置表单，支持自定义控件注入。

**特性：**
- 支持多种内置控件（Input、Select、Switch、DatePicker 等）
- 支持自定义控件注入
- 表单验证支持
- 动态字段配置

### FlowView

基于 React Flow 的流程可视化编辑器。

**特性：**
- 拖拽式节点编辑
- 自定义节点样式
- 边连接管理
- 性能监控面板
- 节点配置抽屉

### RuleEditor

条件规则编辑器，支持复杂规则组合。

**特性：**
- 规则组嵌套
- 多种操作符支持
- 范围输入组件
- 可视化规则树

### FlowConsole

流程执行控制台，展示执行日志和状态。

## 工具模块

### FormWidgetInjector

表单控件注入器，负责控件的注册、映射和查找。

### PluginUIRegistry

插件 UI 配置注册管理器，管理插件类型与表单配置的映射关系。

## 表单控件

内置多种表单控件：
- **antdWidgets** - 基于 Ant Design 的控件
- **customWidgets** - 自定义控件（KeyValueEditor、EventConfig 等）
- **defaultWidget** - 默认控件实现

## 安装

```bash
pnpm add @chloehe/logic-engine-ui
```

## 使用示例

```tsx
import { DynamicConfigForm, injectWidget, WidgetKeys, type Schema } from '@chloehe/logic-engine-ui';

injectWidget('json-editor', JsonEditor);

const schema: Schema = {
  type: 'MyAction',
  label: '我的动作配置',
  config: [
    { field: 'title', label: '标题', type: WidgetKeys.Input },
    { field: 'payload', label: '负载', type: 'json-editor' },
  ],
};

<DynamicConfigForm
  schema={schema}
  value={value}
  onChange={setValue}
/>
```
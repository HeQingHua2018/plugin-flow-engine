
export { default as FlowView } from './components/FlowView';
export { default as PluginView } from './components/PluginView';
// 仅暴露 Hook API 给外部使用
export { useFlowEngine } from './core/hooks/useFlowEngine';
// 保留基础插件基类与核心类型用于插件开发
export { BaseNodePlugin } from './core/plugins/BaseNodePlugin';
export { getBuiltInPluginInstances } from './core/plugins/index';
export { PluginManagerInstance } from './core/utils/PluginManager';
export { ComponentManagerInstance } from './core/utils/ComponentManager';
// 导出注入器相关 API，支持全局注入/覆写 schema 与控件
export { getWidgetByType, injectWidget, injectNodeSchema } from './core/utils/NodeInjector';
export { AntdWidgetKeys } from './core/widget/keys';
export { default as DynamicConfigForm } from './core/widget/DynamicConfigForm';
export type { PluginExecutionEngine } from "./core/utils/PluginExecutionEngine"
export type { FlowDefinition, Node, Edge, ExecutionHistory, NodeConfig } from './core/type.d';
export type { WidgetProps } from './core/widget/components/BaseWidgetProps';
export { injectOperator } from './core/utils/RuleOperators';
/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月29日 10:06:46
 * @example: 调用示例
 */

export { default as DynamicConfigForm } from './widget/DynamicConfigForm';
export { bindPluginsToUI, resolveNodeFormConfig, registerPluginUI, registerNodeSchema } from './utils/PluginUIRegistry';
export { injectNodeSchema, injectWidget, getNodeSchemas, getWidgets, getWidgetByType } from './utils/NodeInjector';
export { AntdWidgetKeys } from './widget/keys';
export type { WidgetProps } from './widget/components/BaseWidgetProps';
export type { AntdWidgetKey } from './widget/keys';
export type { Schema, NodeConfig } from '@plugin-flow-engine/type';
export { default as FlowView } from './components/FlowView';
export type { FlowViewProps } from './components/FlowView';
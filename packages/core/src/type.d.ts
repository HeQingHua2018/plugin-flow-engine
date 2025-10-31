/*
 * @File: type.d.ts (forwarded)
 * @desc: 插件核心类型统一从 @plugin-flow-engine/type 转发，避免重复定义
 */
export type {
  LiteralUnion,
  PluginNodeType,
  DefaultNodeConfig,
  NodeData,
  Node,
  EdgeData,
  Edge,
  Variable,
  ContextConfig,
  ExecutionContext,
  GlobalConfig,
  ExecutionHistory,
  FlowData,
  BuiltInPluginNodeType,
} from '@plugin-flow-engine/type/core';

// 内置插件类型与常量转发
export { BuiltInPluginNodeTypes } from '@plugin-flow-engine/type/core';

// 通用类型转发（表单与字段）
export type WidgetMap = import('@plugin-flow-engine/type/common').WidgetMap;
export type Field = import('@plugin-flow-engine/type/common').FieldBase;

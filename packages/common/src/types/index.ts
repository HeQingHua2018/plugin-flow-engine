/*
 * @File: types.ts
 * @desc: 核心公共类型定义
 * @author: heqinghua
 */
import type { Event, TopLevelCondition } from 'json-rules-engine';
import {
  BuiltInPluginNodeTypes,
  IterationMode,
  NodeStatus,
  EdgeType,
  ParallelStrategy,
} from '../constants';

export { NodeStatus, EdgeType, ParallelStrategy, IterationMode };

export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<never, never>);

export type BuiltInPluginNodeType = keyof typeof BuiltInPluginNodeTypes;

export type PluginNodeType = LiteralUnion<BuiltInPluginNodeType, string>;

export interface DefaultNodeConfig {
  conditions?: TopLevelCondition;
  event?: Event;
  iteration_count?: number;
  iteration_mode?: IterationMode | string;
  parallel_strategy?: ParallelStrategy | string;
  [key: string]: any;
}

export interface NodeData<TConfig = DefaultNodeConfig> {
  label: string;
  pluginNodeType: PluginNodeType;
  config?: TConfig;
  [key: string]: any;
}

export interface Node<TConfig = DefaultNodeConfig> {
  id: string;
  type?: string;
  position?: { x: number; y: number };
  data: NodeData<TConfig>;
  [key: string]: any;
}

export interface EdgeData {
  conditions?: TopLevelCondition;
  isDefault?: boolean;
  priority?: number;
  [key: string]: any;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  data?: EdgeData;
  [key: string]: any;
}

export interface Variable {
  type: string;
  source: string;
  description?: string;
  default?: any;
}

export interface ContextConfig {
  variables: Record<string, Variable>;
}

export interface GlobalConfig {
  timeout?: number;
  max_depth?: number;
  [key: string]: any;
}

export interface FlowData {
  flow: {
    id: string;
    name: string;
    version: string;
    description: string;
    category: string;
    enable: boolean;
    create_date: string;
    update_date: string;
    auto?: boolean;
  };
  context: ContextConfig;
  nodes: Node[];
  edges: Edge[];
  global_config: GlobalConfig;
}

export * from './events';
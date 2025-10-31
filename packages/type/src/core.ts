// Core types and constants centralized here to avoid duplications across packages.
import type { Edge as RFEdge, Node as RFNode } from '@xyflow/react';
import type { Event, TopLevelCondition } from 'json-rules-engine';

// Re-export common building blocks
export type { FieldBase, WidgetMap, Schema, NodeConfig } from './common';

// Utility type for union of known literals and open string
export type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

// Built-in plugin node types as constant map
export const BuiltInPluginNodeTypes = {
  Trigger: 'Trigger',
  Action: 'Action',
  Branch: 'Branch',
  Parallel: 'Parallel',
  Iteration: 'Iteration',
  Merge: 'Merge',
  End: 'End',
} as const;
export type BuiltInPluginNodeType = keyof typeof BuiltInPluginNodeTypes;

// Plugin node type keeps flexible: known literals + open string
export type PluginNodeType = LiteralUnion<BuiltInPluginNodeType, string>;

// Node status enum
export enum NodeStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
}

// Edge type enum
export enum EdgeType {
  INCOMING = 'in',
  OUTGOING = 'out',
  ALL = 'all',
}

// Parallel strategy enum
export enum ParallelStrategy {
  ALL = 'all',
  ANY = 'any',
}

// Iteration mode enum
export enum IterationMode {
  ALL_SUCCESS = 1,
  ANY_SUCCESS = 2,
  ANY_FAILURE = 3,
}

// Default config for nodes (kept generic to avoid tight coupling)
export interface DefaultNodeConfig {
  conditions?: TopLevelCondition;
  event?: Event;
  iteration_count?: number;
  iteration_mode?: IterationMode | string;
  parallel_strategy?: ParallelStrategy | string;
  [key: string]: any;
}

// Node data payload for React Flow nodes
export interface NodeData<TConfig = DefaultNodeConfig> {
  name: string;
  pluginNodeType: PluginNodeType;
  config?: TConfig;
  [key: string]: any;
}

// Align to React Flow Node structure, carrying engine-specific data in `data`
export type Node<TConfig = DefaultNodeConfig> = RFNode<NodeData<TConfig>, string>;

// Edge data payload for React Flow edges
export interface EdgeData {
  conditions?: TopLevelCondition;
  isDefault?: boolean;
  priority?: number;
  [key: string]: any;
}

// Align to React Flow Edge structure, carrying engine-specific data in `data`
export type Edge = RFEdge<EdgeData>;

// Variable schema in flow context
export interface Variable {
  type: string;
  source: string;
  description?: string;
  default?: any;
}

// Context configuration for a flow
export interface ContextConfig {
  variables: Record<string, Variable>;
}

// Execution context at runtime
export interface ExecutionContext {
  variables: Record<string, any>;
}

// Global flow-level configuration
export interface GlobalConfig {
  timeout?: number;
  max_depth?: number;
  [key: string]: any;
}

// Execution history record for a single node run
export interface ExecutionHistory {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  pluginNodeType: PluginNodeType;
  status: NodeStatus | string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  contextBefore?: Record<string, any>;
  contextAfter?: Record<string, any>;
  event?: Event;
  conditions?: TopLevelCondition;
  eventResult?: any;
  timestamp: Date;
  engineResult?: any;
  decision?: {
    selectPath?: string;
    conditions?: TopLevelCondition;
    isDefault?: boolean;
  };
  is_end_node?: boolean;
  parallel_strategy?: ParallelStrategy | string;
  parallel_edges?: Array<{
    target: string;
    conditions: TopLevelCondition;
    isDefault: boolean;
  }>;
}

// Complete flow definition
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
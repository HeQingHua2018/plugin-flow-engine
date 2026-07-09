/*
 * @File: types.ts
 * @desc: 流程视图类型定义
 */
import type { FlowData, Edge, Node, PluginNodeType, NodeConfig } from '../../types';
import type { ExecutionHistory, PluginManager} from '@chloehe/logic-engine-core';
export interface FlowViewProps {
  /** 流程数据（完整结构） */
  data: FlowData;
  /** 节点配置（按节点类型索引） */
  nodeConfigs?: Record<PluginNodeType, NodeConfig>;
  /** 自定义插件管理器（会与全局插件合并，用于隔离场景） */
  customPluginManager?: PluginManager;
  /** 节点的初始配置（按节点 id 索引） */
  initialValue?: Record<Node['id'], Record<string, any>>;
  /** 节点配置变更时的回调 (nodeId, 最新的节点完整 data) */
  onNodeConfigChange?: (nodeId: Node['id'], nodeData: Record<string, any>) => void;
  /** 关闭抽屉时是否进行校验 */
  isValidate?: boolean;

  // ---- 执行相关 ----
  /** 执行流程回调 (参数为最新的完整流程数据) */
  onExecute?: (data: FlowData) => void;
  /** 是否正在执行 */
  /** 执行历史 */
  executionHistory?: ExecutionHistory[];
  /** 执行结果（来自 engine.executeFlow 返回值） */
  executionResult?: {
    status: boolean;
    message: string;
    variables?: Record<string, any>;
    errorInfo?: any;
    retries?: number;
    stoppedAt?: string;
  } | null;

  // ---- 工具栏显示控制 ----
  /** 显示性能监控（默认 false） */
  showPerformance?: boolean;

  // ---- 保存回调 ----
  /** 保存完整流程数据回调（返回 FlowData，包含 flow/context/nodes/edges/global_config） */
  onSaveFlowData?: (flowData: FlowData) => void;
}

export type { Edge, Node, PluginNodeType, FlowData };
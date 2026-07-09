/*
 * @File: type.d.ts (forwarded)
 * @desc: 插件核心类型
 */
import type { TopLevelCondition } from 'json-rules-engine';

/** 流程事件类型 - 与 json-rules-engine 的 Event 类型兼容 */
export interface FlowEvent {
  type: string;
  params?: any;
  [key: string]: any;
}
import {  NodeStatus, ParallelStrategy } from './constants';
import { PluginNodeType } from '@chloehe/logic-engine-common';
// 从common包导出共用类型
export type {
  Node,
  Edge,
  FlowData,
  ExecutionContext,
  PluginNodeType,
} from '@chloehe/logic-engine-common';


// ----------执行历史记录定义 start ----------
export interface ExecutionHistory {
  /**
   * 节点ID
   */
  nodeId: string;
  /**
   * 节点名称
   */
  nodeName: string;
  /**
   * 节点类型
   */
  nodeType: string;
  /**
   * 插件节点类型
   */
  pluginNodeType: PluginNodeType;
  /**
   * 节点状态
   */
  status: NodeStatus;
  /**
   * 开始时间
   */
  startTime?: Date;
  /**
   * 结束时间
   */
  endTime?: Date;
  /**
   * 执行时长
   */
  duration?: number;
  /**
   * 执行上下文前
   */
  contextBefore?: Record<string, any>;
  /**
   * 执行上下文后
   */ 
  contextAfter?: Record<string, any>;
  /**
   * 事件
   */
  event?: FlowEvent;
  /**
   * 规则条件
   */
  conditions?: TopLevelCondition;
  /**
   * 事件结果
   */
  eventResult?: any;
  /**
   * 记录时间戳
   */
  timestamp: Date;
  /**
   * 引擎结果
   */
  engineResult?: any;
  /**
   * 分支节点信息
   */
  decision?: {
    /**
     * 选中的路径
     */
    selectPath?: string;
    /**
     * 决策条件
     */
    conditions?: TopLevelCondition;
    /**
     * 是否默认路径
     */
    isDefault?: boolean;
  };
  /**
   * 是否结束节点
   */
  is_end_node?: boolean;
  /**
   * 迭代模式
   */
  iteration_mode?: number;
  /**
   * 迭代次数
   */
  iteration_count?: number;
  /**
   * 并行策略
   */
  parallel_strategy?: ParallelStrategy;
  /**
   * 并行路径
   */
  parallel_edges?: Array<{
    /**
     * 目标节点ID
     */
    target: string;
    /**
     * 并行路径条件
     */
    conditions: TopLevelCondition;
    /**
     * 是否默认路径
     */
    isDefault: boolean;
  }>;
  [key:string]: any;
}

// ----------执行历史记录定义 end ----------


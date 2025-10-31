/*
 * @File: NodePlugin.d.ts
 * @desc: 节点插件接口定义，为所有节点类型的插件提供统一的接口规范
 * @author: heqinghua
 * @date: 2025年09月18日
 */

import {
  type Edge,
  type Node,
  type ExecutionHistory,
  type PluginNodeType,
  type NodeStatus,
} from "@plugin-flow-engine/type/core";
import type { NodeConfig } from "@plugin-flow-engine/type/common";
import type { PluginExecutionEngine } from "../utils/PluginExecutionEngine";


/**
 * 节点插件接口
 * 定义了所有节点类型插件必须实现的核心方法，是插件化架构的基础接口
 */
export interface NodePlugin {
  /**
   * 节点类型标识符
   * 用于区分不同类型的节点插件
   */
  pluginNodeType: PluginNodeType;

  /**
   * 节点类型名称
   */
  pluginNodeTypeName: string;

  /**
   * 获取节点表单配置项
   * 用于动态生成节点配置表单，支持自定义字段和验证规则
   * @returns 节点表单配置项schema对象或null（如果节点不支持配置）
   */
  getNodeFormConfig(): NodeConfig | null;

  /**
   * 执行节点的核心业务逻辑
   * @param node 当前要执行的节点对象
   * @param pluginExecutionEngine 插件执行引擎实例，提供上下文和工具方法
   * @param historyItem 执行历史记录项，用于记录执行过程和结果
   * @returns 执行是否成功的布尔值
   */
  executeNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<boolean>;

  /**
   * 获取节点当前的执行状态
   * @param node 要查询状态的节点对象
   * @param pluginExecutionEngine 插件执行引擎实例
   * @returns 节点状态或null
   */
  getExecuteNodeStatus(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<NodeStatus | null>;

  /**
   * 获取流程中下一个要执行的节点ID
   * 不同类型的节点有不同的路由逻辑
   * @param edges 当前节点的所有出边集合
   * @param pluginExecutionEngine 插件执行引擎实例
   * @param historyItem 执行历史记录项
   * @returns 单个节点ID、多个节点ID数组或null（表示流程结束）
   */
  getNextNodeId(
    edges: Edge[],
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<string | string[] | null>;

  /**
   * 是否应该执行此节点
   * 钩子方法，允许插件决定是否执行当前节点
   * @param node 当前节点
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 是否应该执行
   */
  shouldExecuteNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<boolean>;

  /**
   * 节点执行完成后的回调
   * 钩子方法，在节点执行完成后调用
   * @param node 当前节点
   * @param pluginExecutionEngine 插件执行引擎
   * @param historyItem 执行历史记录项
   * @param result 执行结果
   */
  onNodeComplete(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem: ExecutionHistory,
    result: boolean
  ): Promise<void>;
}

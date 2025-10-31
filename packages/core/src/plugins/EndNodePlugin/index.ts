/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @File: EndNodePlugin.ts
 * @desc: 结束节点插件实现，处理流程的终结逻辑
 * @author: heqinghua
 * @date: 2025年09月24日
 */

import { BaseNodePlugin } from "../BaseNodePlugin";
import type { PluginExecutionEngine } from '../../utils/PluginExecutionEngine';
import schema, { PluginNodeType, PluginNodeTypeName } from './schema';
import type { Node, NodeStatus, Edge, ExecutionHistory } from "@plugin-flow-engine/type/core";

/**
 * 结束节点插件
 * 实现流程终结逻辑，是流程执行的终点节点
 * 重写了BaseNodePlugin的部分方法以实现结束节点特有的行为
 */
export class EndNodePlugin extends BaseNodePlugin {
  /**
   * 节点类型
   */
  public pluginNodeType = PluginNodeType;

  /**
   * 节点类型名称
   */
  public pluginNodeTypeName = PluginNodeTypeName;

  /**
   * 获取节点表单配置项
   * @returns 节点表单配置项
   */
  getNodeFormConfig() {
    return schema;
  }

  /**
   * 获取节点执行状态
   * @param node 节点信息
   * @param pluginExecutionEngine 插件执行引擎
   */
  async getExecuteNodeStatus(node: Node, pluginExecutionEngine: PluginExecutionEngine): Promise<NodeStatus | null> {
    return super.getExecuteNodeStatus(node, pluginExecutionEngine);
  }

  /**
 * 执行结束节点的核心逻辑
 * 特殊处理：执行成功后标记为流程结束节点
 * @param node 结束节点对象
 * @param pluginExecutionEngine 插件执行引擎实例
 * @param historyItem 执行历史记录项
 * @returns 执行是否成功的布尔值
 */
  async executeNode(node: Node, pluginExecutionEngine: PluginExecutionEngine, historyItem?: ExecutionHistory): Promise<boolean> {
    const result = await super.executeNode(node, pluginExecutionEngine, historyItem);
    // 如果执行成功，标记为流程结束节点
    if (result && historyItem) {
      historyItem.is_end_node = true;
    }
    return result;
  }

  /**
 * 获取下一个节点ID
 * 结束节点是流程的终点，因此总是返回null
 * @param edges 所有出边的集合（实际上结束节点不应有出边）
 * @param pluginExecutionEngine 插件执行引擎实例
 * @param historyItem 执行历史记录项
 * @returns null，表示流程结束
 */
  async getNextNodeId(edges: Edge[], pluginExecutionEngine: PluginExecutionEngine, historyItem?: ExecutionHistory): Promise<string | null> {
    // 结束节点没有后续节点
    return null;
  }

/**
 * 节点执行完成后的回调方法
 * 特殊处理：确认标记为流程结束
 * @param node 结束节点对象
 * @param pluginExecutionEngine 插件执行引擎实例
 * @param historyItem 执行历史记录项
 * @param result 执行结果
 */
  async onNodeComplete(node: Node, pluginExecutionEngine: PluginExecutionEngine, historyItem: ExecutionHistory, result: boolean): Promise<void> {
    await super.onNodeComplete(node, pluginExecutionEngine, historyItem, result);
    
    // 标记为流程结束
    historyItem.is_end_node = true;
  }
}

export default EndNodePlugin;

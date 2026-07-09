/*
 * @File: index.ts
 * @desc: {{pluginTypeName}}，继承自BaseNodePlugin
 * @author: {{authorName}}
 * @date: {{currentDate}}
 */
import { BaseNodePlugin } from '@chloehe/logic-engine-core';
import type { Node, Edge, PluginExecutionEngine, ExecutionHistory } from '@chloehe/logic-engine-core';

export class {{formattedPluginName}} extends BaseNodePlugin {
  /**
   * 插件节点类型标识符
   */
  pluginNodeType = '{{pluginType}}';
  
  /**
   * 插件节点类型名称
   */
  pluginNodeTypeName = '{{pluginTypeName}}';

  /**
   * 执行节点的核心业务逻辑
   */
  async executeNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory,
  ): Promise<boolean> {
    return super.executeNode(node, pluginExecutionEngine, historyItem);
  }

  /**
   * 获取节点当前的执行状态
   */
  async getExecuteNodeStatus(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
  ): Promise<any> {
    return super.getExecuteNodeStatus(node, pluginExecutionEngine);
  }

  /**
   * 获取流程中下一个要执行的节点ID
   */
  async getNextNodeId(
    edges: Edge[],
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory,
  ): Promise<string | string[] | null> {
    return super.getNextNodeId(edges, pluginExecutionEngine, historyItem);
  }

  /**
   * 判断节点是否应该执行
   */
  async shouldExecuteNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
  ): Promise<boolean> {
    return super.shouldExecuteNode(node, pluginExecutionEngine);
  }

  /**
   * 节点执行完成后的回调
   */
  async onNodeComplete(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem: ExecutionHistory,
    result: boolean,
  ): Promise<void> {
    return super.onNodeComplete(node, pluginExecutionEngine, historyItem, result);
  }
}
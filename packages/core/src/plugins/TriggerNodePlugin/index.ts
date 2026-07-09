/*
 * @File: TriggerNodePlugin.ts
 * @desc: 触发器节点插件实现
 * @author: heqinghua
 * @date: 2025 年 09 月 24 日
 */
import { BuiltInPluginNodeTypes, NodeStatus } from '../../constants';
import type { Edge, ExecutionHistory, Node } from '../../types';
import type { PluginExecutionEngine } from '../../utils/PluginExecutionEngine';
import { BaseNodePlugin } from '../BaseNodePlugin';

/**
 * 触发器节点插件
 * 用于处理流程的触发逻辑
 */
export class TriggerNodePlugin extends BaseNodePlugin {
  /**
   * 节点类型
   */
  public pluginNodeType = BuiltInPluginNodeTypes.Trigger;

  /**
   * 节点类型名称
   */
  public pluginNodeTypeName = '触发器节点';

  /**
   * 获取节点执行状态
   * @param node 节点信息
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 执行状态
   */
  async getExecuteNodeStatus(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
  ): Promise<NodeStatus | null> {
    return super.getExecuteNodeStatus(node, pluginExecutionEngine);
  }

  /**
   * 获取下一个节点 ID（继承基类实现）
   */
  async getNextNodeId(
    edges: Edge[],
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory,
  ): Promise<string | string[] | null> {
    return super.getNextNodeId(edges, pluginExecutionEngine, historyItem);
  }
}

export default TriggerNodePlugin;

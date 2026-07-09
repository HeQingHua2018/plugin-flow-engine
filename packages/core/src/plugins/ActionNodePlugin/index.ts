/*
 * @File: ActionNodePlugin.ts
 * @desc: 动作节点插件实现
 * @author: heqinghua
 * @date: 2025年09月24日
 */
import { BuiltInPluginNodeTypes, NodeStatus } from '../../constants';
import type { Node } from '../../types';
import type { PluginExecutionEngine } from '../../utils/PluginExecutionEngine';
import { BaseNodePlugin } from '../BaseNodePlugin';

/**
 * 动作节点插件
 * 用于处理流程中的动作执行逻辑
 */
export class ActionNodePlugin extends BaseNodePlugin {
  /**
   * 节点类型
   */
  public pluginNodeType = BuiltInPluginNodeTypes.Action;
  /**
   * 节点类型名称
   */
  public pluginNodeTypeName = '动作节点';

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
}

export default ActionNodePlugin;

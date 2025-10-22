/*
 * @File: TriggerNodePlugin.ts
 * @desc: 触发器节点插件实现
 * @author: heqinghua
 * @date: 2025年09月24日
 */

import { type Node, type NodeConfig } from '../../type.d';
import type { PluginExecutionEngine } from '../../utils/PluginExecutionEngine';
import { BaseNodePlugin } from '../BaseNodePlugin';
import schema, { nodeType, nodeName } from './schema';

/**
 * 触发器节点插件
 * 用于处理流程的触发逻辑
 */
export class TriggerNodePlugin extends BaseNodePlugin {
  /**
   * 节点类型
   */
  public nodeType = nodeType;
  
  /**
   * 节点类型名称
   */
  public nodeTypeName = nodeName;

  /**
   * 获取节点表单配置项schema
   * @returns 节点表单配置项schema对象
   */
  getNodeFormConfig(): NodeConfig | null {
    return schema;
  }
  
  /**
   * 获取节点执行状态
   * @param node 节点信息
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 执行状态
   */
  async getExecuteNodeStatus(
    node: Node, 
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<string | null> {
    return super.getExecuteNodeStatus(node, pluginExecutionEngine);
  }
}

export default TriggerNodePlugin;

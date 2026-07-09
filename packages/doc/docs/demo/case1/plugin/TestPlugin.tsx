import { BaseNodePlugin, NodeStatus } from "@chloehe/logic-engine-core";
import type { Edge, ExecutionHistory, Node, PluginNodeType, PluginExecutionEngine } from '@chloehe/logic-engine-core';

/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2026年06月17日 17:19:48
 * @example: 调用示例
 */
export class TestPlugin extends BaseNodePlugin {
  pluginNodeType: PluginNodeType;
  pluginNodeTypeName: string;
  constructor() {
    super();
    this.pluginNodeType = 'Test';
    this.pluginNodeTypeName = 'Test Node';
  }
 async executeNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<boolean> {
    return true;
  }
}

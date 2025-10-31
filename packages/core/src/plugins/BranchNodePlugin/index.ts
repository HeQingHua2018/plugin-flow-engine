/*
 * @File: BranchNodePlugin.ts
 * @desc: 分支节点插件实现
 * @author: heqinghua
 * @date: 2025年09月24日
 */

import { BaseNodePlugin } from "../BaseNodePlugin";
import type { PluginExecutionEngine } from '../../utils/PluginExecutionEngine';
import schema, { PluginNodeType, PluginNodeTypeName } from './schema';
import type { Node, NodeStatus, Edge, ExecutionHistory } from "@plugin-flow-engine/type/core";

/**
 * 分支节点插件
 * 用于处理流程中的分支决策逻辑，根据条件选择执行路径
 * 支持基于规则条件匹配和优先级排序的分支选择机制
 */
export class BranchNodePlugin extends BaseNodePlugin {
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
   * @returns 节点当前状态，始终返回PENDING，表示等待执行
   */
  async getExecuteNodeStatus(node: Node, pluginExecutionEngine: PluginExecutionEngine): Promise<NodeStatus | null> {
    return super.getExecuteNodeStatus(node, pluginExecutionEngine);
  }

  /**
   * 获取下一个节点ID
   * 分支节点根据条件评估结果决定执行路径，支持多条件匹配和默认路径
   * @param edges 所有出边的集合
   * @param pluginExecutionEngine 插件执行引擎
   * @param historyItem 执行历史记录项(可选)，用于记录决策信息
   * @returns 下一个节点ID或null，表示无后续节点
   * @throws 当没有匹配的边且没有默认边时抛出异常
   */
  async getNextNodeId(edges: Edge[], pluginExecutionEngine: PluginExecutionEngine, historyItem?: ExecutionHistory): Promise<string | null> {
    if (edges.length === 0) {
      return null;
    }
    let matchedEdges: Edge[] = [];
    
    // 获取当前上下文变量用于调试
    const contextManager = pluginExecutionEngine.getContextManager();
    const variables = contextManager.getVariables();
    console.log('[BranchNodePlugin] 当前上下文变量:', variables);
    console.log('[BranchNodePlugin] 可用的边:', edges.map(e => ({ id: e.id, target: e.target, conditions: e.data?.conditions, isDefault: e.data?.isDefault })));
    
    // 评估所有非默认边的条件
    for (const edge of edges) {
      if (!edge.data?.isDefault) {
        try {
          console.log(`[BranchNodePlugin] 评估边 ${edge.id} 的条件:`, edge.data?.conditions);
          const isMatch = await pluginExecutionEngine.evaluateRule(edge?.data?.conditions, edge.id);
          console.log(`[BranchNodePlugin] 边 ${edge.id} 评估结果:`, isMatch);
          if (isMatch) {
            matchedEdges.push(edge);
          }
        } catch (error) {
          // 规则评估失败，该边不匹配
          console.log(`[BranchNodePlugin] 边 ${edge.id} 的规则评估失败:`, error);
        }
      }
    }

    // 根据匹配结果确定最终选择的边
    let matchedEdge: Edge | null = null;
    
    // 如果有多条匹配的边
    if (matchedEdges.length > 1) {
      // 记录多条边满足规则的情况
      console.warn(`分支节点有${matchedEdges.length}条边的规则都满足，选择优先级最高的边`);
      // 优先级倒序排序
      matchedEdges.sort((a, b) => ((b.data?.priority || 0) - (a.data?.priority || 0)));
      matchedEdge = matchedEdges[0];
    } 
    // 如果有一条匹配的边
    else if (matchedEdges.length === 1) {
      matchedEdge = matchedEdges[0];
    } 
    // 如果没有匹配的非默认边，查找默认边
    else {
      const defaultEdge = edges.find((edge) => edge.data?.isDefault);
      if (defaultEdge) {
        matchedEdge = defaultEdge;
      } else {
        throw new Error("分支节点没有配置默认的边")
      }
    }
    console.log(`[BranchNodePlugin] 匹配的边数量: ${matchedEdges.length}`);
    console.log(`[BranchNodePlugin] 最终选择的边:`, matchedEdge);
    console.log(`[BranchNodePlugin] 下一个节点ID: ${matchedEdge.target}`);
    
    if(historyItem){
      historyItem.decision={
        selectPath: matchedEdge.target,
        conditions: matchedEdge.data?.conditions,
        isDefault: !!matchedEdge?.data?.isDefault 
      }
    }
    return matchedEdge.target;
  }
}

export default BranchNodePlugin;

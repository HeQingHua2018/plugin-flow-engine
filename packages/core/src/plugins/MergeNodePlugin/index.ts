/*
 * @File: MergeNodePlugin.ts
 * @desc: 合并节点插件，用于处理流程中的节点聚合逻辑
 * @author: heqinghua
 * @date: 2025年09月24日
 */

import  { type ExecutionHistory, type Edge, type Node, NodeStatus } from "@plugin-flow-engine/type/core";
import type { PluginExecutionEngine } from "../../utils/PluginExecutionEngine";
import { BaseNodePlugin } from "../BaseNodePlugin";
import schema, { PluginNodeType, PluginNodeTypeName } from './schema';

/**
 * 合并节点插件
 * 用于处理流程中的节点聚合逻辑，协调多个并行分支的执行流程
 * 确保只有当所有前置节点执行完成后才执行后续逻辑
 */
export class MergeNodePlugin extends BaseNodePlugin {
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
   * 检查所有前置节点是否已执行完成
   * 遍历所有入边的源节点，确保它们都已执行成功
   * @param node 当前节点
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 所有前置节点是否已执行完成并成功
   */
  protected async checkAllPredecessorNodes(node: Node, pluginExecutionEngine: PluginExecutionEngine): Promise<boolean> {
    try {
      // 获取当前节点的所有入边
      const incomingEdges = pluginExecutionEngine.getIncomingEdges(node.id);
      
      // 如果没有入边，直接返回true
      if (incomingEdges.length === 0) {
        return true;
      }
      
      // 获取所有入边的源节点ID
      const predecessorNodeIds = incomingEdges.map((edge: Edge) => edge.source);
      
      // 获取执行历史
      const executionHistory = pluginExecutionEngine.getExecutionHistory();
      
      // 检查每个前置节点是否已执行完成（成功或失败）
      for (const nodeId of predecessorNodeIds) {
        // 查找该节点的最新执行记录
        const nodeHistory = executionHistory.filter((item: ExecutionHistory) => item.nodeId === nodeId);
        
        if (nodeHistory.length === 0) {
          // 前置节点尚未执行
          console.log(`前置节点 ${nodeId} 尚未执行，合并节点等待...`);
          return false;
        }
        
        // 获取最新的执行记录
        const latestHistory = nodeHistory.reduce((latest: ExecutionHistory, current: ExecutionHistory) => {
          return current.timestamp > latest.timestamp ? current : latest;
        });
        
        // 检查节点是否执行完成
        if (latestHistory.status === NodeStatus.FAILED) {
          // 前置节点执行失败
          console.log(`前置节点 ${nodeId} 执行失败，合并节点无法继续执行`);
          return false;
        } else if (latestHistory.status !== NodeStatus.SUCCESS) {
          // 前置节点未完成（可能是pending状态）
          console.log(`前置节点 ${nodeId} 执行状态为 ${latestHistory.status}，合并节点等待...`);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('检查前置节点状态时发生错误:', error);
      return false;
    }
  }
  
  /**
   * 判断是否应该执行此节点
   * @param node 当前节点
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 是否应该执行节点
   */
  async shouldExecuteNode(node: Node, pluginExecutionEngine: PluginExecutionEngine): Promise<boolean> {
      const shouldExecute = await this.checkAllPredecessorNodes(node, pluginExecutionEngine);
      if (!shouldExecute) {
        console.log(`合并节点 ${node.id} 的前置节点尚未全部完成，跳过执行`);
      }
      return shouldExecute;
  }
  
  /**
   * 获取节点执行状态
   * 首先检查所有前置节点是否已完成，然后查看节点自身的执行历史
   * @param node 当前节点
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 节点当前状态
   */
  async getExecuteNodeStatus(node: Node, pluginExecutionEngine: PluginExecutionEngine): Promise<NodeStatus | null> {
    // 检查所有前置节点是否已完成
    const allPredecessorsCompleted = await this.checkAllPredecessorNodes(node, pluginExecutionEngine);
    if (!allPredecessorsCompleted) {
      return NodeStatus.PENDING;
    }
    
    // 前置节点已完成，检查节点自身的执行历史
    const executionHistory = pluginExecutionEngine.getExecutionHistory();
    const nodeHistory = executionHistory.filter((item: ExecutionHistory) => item.nodeId === node.id);
    
    if (nodeHistory.length > 0) {
      // 获取最新的执行记录
      const latestHistory = nodeHistory.reduce((latest: ExecutionHistory, current: ExecutionHistory) => {
        return current.timestamp > latest.timestamp ? current : latest;
      });
      
      return latestHistory.status as NodeStatus;
    }
    // 没有执行历史，返回pending状态
    return NodeStatus.PENDING;
  }

}

export default MergeNodePlugin;

/*
 * @File: ParallelNodePlugin.ts
 * @desc: 并行节点插件实现
 * @author: heqinghua
 * @date: 2025年09月24日
 */
import {
  type Node,
  type ExecutionHistory,
  type Edge,
  NodeStatus,
  ParallelStrategy
} from "@plugin-flow-engine/type/core";
import { BaseNodePlugin } from "../BaseNodePlugin";
import type { PluginExecutionEngine } from '../../utils/PluginExecutionEngine';
import schema, { PluginNodeType, PluginNodeTypeName } from './schema';



/**
 * 并行节点插件
 * 用于处理流程中的并行执行逻辑，支持同时执行多个分支路径
 * 提供不同的成功策略（全部成功或任一成功）和上下文管理机制
 */
export class ParallelNodePlugin extends BaseNodePlugin {
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
    return super.getExecuteNodeStatus(node,pluginExecutionEngine);
  }
  
  /**
   * 执行节点逻辑
   * 为并行节点设置执行策略，并保存到历史记录
   * @param node 当前节点
   * @param pluginExecutionEngine 插件执行引擎
   * @param historyItem 执行历史记录项(可选)
   * @returns 执行结果，始终为true
   */
  async executeNode(node: Node, pluginExecutionEngine: PluginExecutionEngine, historyItem?: ExecutionHistory): Promise<boolean> {
    // 保存并行策略到节点配置
    if (!node.data) {
      (node as any).data = {};
    }
    if (!node.data.config) {
      node.data.config = {} as any;
    }
    const config = node.data.config as any;
    // 如果没有设置并行策略，默认为ALL
    if (!config.parallel_strategy) {
      config.parallel_strategy = ParallelStrategy.ALL;
    }
    
    // 记录并行策略到历史记录
    if (historyItem) {
      historyItem.parallel_strategy = config.parallel_strategy;
    }
    
    return super.executeNode(node, pluginExecutionEngine, historyItem);
  }
  
  /**
   * 获取下一个节点ID
   * 并行节点返回所有满足条件的目标节点ID数组，支持多条路径同时执行
   * @param edges 所有出边的集合
   * @param pluginExecutionEngine 插件执行引擎
   * @param historyItem 执行历史记录项（可选），用于记录匹配的边信息
   * @returns 下一个节点ID数组或null
   */
  async getNextNodeId(
    edges: Edge[],
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<string | string[] | null> {
    if (edges.length === 0) return null;
  
    const matchedEdges: Edge[] = [];
    for (const edge of edges) {
      try {
        const isMatch = await pluginExecutionEngine.evaluateRule(edge?.data?.conditions);
        if (isMatch || edge?.data?.isDefault) {
          matchedEdges.push(edge);
        }
      } catch (error) {
        console.error(`评估并行边条件失败:`, error);
      }
    }
    
    // 如果有历史记录项，保存匹配的边信息
    if (historyItem) {
      historyItem.parallel_edges = matchedEdges.map(edge => ({
        target: edge.target,
        conditions: edge.data?.conditions ?? { all: [] },
        isDefault: !!edge.data?.isDefault
      }));
    }
    
    // 返回所有匹配的边的目标节点ID数组
    return matchedEdges.map((edge) => edge.target);
  }


  /**
   * 节点执行完成后的回调方法
   * 并行节点根据执行结果和成功策略来决定是否继续执行后续节点
   * @param node 节点
   * @param pluginExecutionEngine 插件执行引擎
   * @param historyItem 执行历史记录项
   * @param result 节点执行结果
   */
  async onNodeComplete(node: Node, pluginExecutionEngine: PluginExecutionEngine, historyItem: ExecutionHistory, result: boolean): Promise<void> {
    if (result === true) {
      const outgoingEdges = pluginExecutionEngine.getOutgoingEdges(node.id);
      const nextNodeInfo = await this.getNextNodeId(
        outgoingEdges,
        pluginExecutionEngine,
        historyItem
      );
      
      // 根据返回的节点信息类型进行不同处理
      if (Array.isArray(nextNodeInfo)) {
        // 并行执行多个节点
        let successStrategy: ParallelStrategy = ParallelStrategy.ALL;
        const configured = node.data?.config?.parallel_strategy;
        if (typeof configured === 'string') {
          const key = configured.toUpperCase() as keyof typeof ParallelStrategy;
          if (ParallelStrategy[key] !== undefined) {
            successStrategy = ParallelStrategy[key];
          }
        } else if (configured !== undefined) {
          successStrategy = configured;
        }
        await this.executeNodesInParallel(
          nextNodeInfo,
          pluginExecutionEngine,
          successStrategy
        );
      } else if (typeof nextNodeInfo === "string") {
        // 串行执行单个节点
        await pluginExecutionEngine.executeNode(nextNodeInfo);
      }
      // 对于null值，不执行任何操作（表示流程结束）
    }
  }
  
  /**
   * 并行执行多个节点
   * 为每个分支创建独立的上下文副本，并行执行后合并上下文变更
   * @param nodeIds 并行执行的节点ID数组
   * @param pluginExecutionEngine 插件执行引擎
   * @param successStrategy 成功策略枚举值，默认ALL
   * @returns 执行结果，true表示成功，false表示失败
   */
  async executeNodesInParallel(
    nodeIds: string[], 
    pluginExecutionEngine: PluginExecutionEngine, 
    successStrategy: ParallelStrategy = ParallelStrategy.ALL
  ): Promise<boolean> {
    if (!nodeIds || nodeIds.length === 0) return true;
    // 为每个并行分支创建上下文副本
    const contextCopies = nodeIds.map(() => ({
      ...pluginExecutionEngine.getContextManager().getVariables(),
    }));
    // 在独立上下文中并行执行每个节点
    const executionPromises = nodeIds.map((nodeId, index) =>
      this.executeNodeInParallelContext(nodeId, contextCopies[index], pluginExecutionEngine)
    );
    // 等待所有并行执行完成
    const results = await Promise.all(executionPromises);
    // 合并多个并行分支的上下文变更
    this.mergeParallelContexts(pluginExecutionEngine, contextCopies);
    
    // 根据成功策略决定整体结果
    if (successStrategy === ParallelStrategy.ALL) {
      // 当前行为：所有分支成功才算成功
      const all = results.every((result) => result);
      // 明确设置hasFailed状态，确保结果正确反映
      pluginExecutionEngine.setHasFailed(!all);
      return all;
    } else if (successStrategy === ParallelStrategy.ANY) {
      // 新行为：任一分支成功就算成功
      const any = results.some((result) => result);
      // 明确设置hasFailed状态
      pluginExecutionEngine.setHasFailed(!any);
      return any;
    }
    
    // 默认返回原行为
    const defaultResult = results.every((result) => result);
    pluginExecutionEngine.setHasFailed(!defaultResult);
    return defaultResult;
  }
  
  /**
   * 在独立上下文中执行单个节点
   * 临时切换到指定上下文，执行节点后恢复原始上下文
   * @param nodeId 节点ID
   * @param contextCopy 上下文副本，用于保存执行过程中的上下文变更
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 执行结果，true表示成功，false表示失败
   */
  private async executeNodeInParallelContext(
    nodeId: string, 
    contextCopy: Record<string, any>, 
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<boolean> {
    const originalContext = { ...pluginExecutionEngine.getContextManager().getVariables() };
    const originalHasFailed = pluginExecutionEngine.hasFailed;
    // 设置当前分支的上下文
    pluginExecutionEngine.getContextManager().updateVariables(contextCopy);
    try {
      // 执行节点
      const result = await pluginExecutionEngine.executeNode(nodeId);
      // 保存上下文变更
      Object.assign(contextCopy, pluginExecutionEngine.getContextManager().getVariables());
      return result;
    } finally {
      // 恢复原始上下文
      pluginExecutionEngine.getContextManager().updateVariables(originalContext);
      pluginExecutionEngine.setHasFailed(originalHasFailed);
    }
  }
  
  /**
   * 合并多个并行分支的上下文变更
   * @param pluginExecutionEngine 插件执行引擎
   * @param contexts 上下文数组，包含所有并行分支的上下文变更
   */
  protected mergeParallelContexts(
    pluginExecutionEngine: PluginExecutionEngine,
    contexts: Record<string, any>[]
  ): void {
    const mergedContext: Record<string, any> = {};
    contexts.forEach((context) => {
      Object.assign(mergedContext, context);
    });
    // 更新引擎上下文
    pluginExecutionEngine.getContextManager().updateVariables(mergedContext);
  }
}

export default ParallelNodePlugin;

/*
 * @File: MergeNodePlugin.ts
 * @desc: 合并节点插件，用于处理流程中的节点聚合逻辑
 * @author: heqinghua
 * @date: 2025年09月24日
 */

import { BuiltInPluginNodeTypes, NodeStatus } from '../../constants';
import type { Edge, ExecutionHistory, Node } from '../../types';
import type { PluginExecutionEngine } from '../../utils/PluginExecutionEngine';
import { BaseNodePlugin } from '../BaseNodePlugin';

/**
 * 合并节点插件
 * 用于处理流程中的节点聚合逻辑，协调多个并行分支的执行流程
 * 确保只有当所有前置节点执行完成后才执行后续逻辑
 */
export class MergeNodePlugin extends BaseNodePlugin {
  /**
   * 节点类型
   */
  public pluginNodeType = BuiltInPluginNodeTypes.Merge;
  /**
   * 节点类型名称
   */
  public pluginNodeTypeName = '合并节点';
  /**
   * 检查所有前置节点是否已执行完成
   * 遍历所有入边的源节点，根据节点类型和策略判断是否满足执行条件
   * @param node 当前节点
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 前置节点是否满足执行条件
   */
  protected async checkAllPredecessorNodes(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
  ): Promise<boolean> {
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

      // 按来源节点分组的并行分支映射
      const parallelBranches = new Map<
        string,
        { total: number; success: number }
      >();

      // 检查每个前置节点是否已执行完成
      for (const predecessorId of predecessorNodeIds) {
        // 获取节点状态
        const status = this.getNodeStatus(executionHistory, predecessorId);

        if (status === NodeStatus.PENDING) {
          // 前置节点尚未执行
          console.log(`前置节点 ${predecessorId} 尚未执行，合并节点等待...`);
          return false;
        }

        // 检查节点是否为并行节点的分支
        const isParallelBranch = await this.isParallelBranch(
          predecessorId,
          executionHistory,
          pluginExecutionEngine,
        );
        if (isParallelBranch) {
          // 并行分支特殊处理
          const parallelSourceId = await this.getParallelSourceNodeId(
            predecessorId,
            executionHistory,
          );
          if (parallelSourceId) {
            // 初始化并行分支计数
            if (!parallelBranches.has(parallelSourceId)) {
              // 获取并行节点信息
              const parallelEdges =
                pluginExecutionEngine.getOutgoingEdges(parallelSourceId);
              parallelBranches.set(parallelSourceId, {
                total: parallelEdges.length,
                success: 0,
              });
            }

            // 更新成功计数
            const branchInfo = parallelBranches.get(parallelSourceId)!;
            if (status === NodeStatus.SUCCESS) {
              branchInfo.success++;
            }

            // 检查节点是否执行完成
            if (status !== NodeStatus.SUCCESS && status !== NodeStatus.FAILED) {
              // 前置节点未完成（可能是pending状态）
              console.log(
                `前置节点 ${predecessorId} 执行状态为 ${status}，合并节点等待...`,
              );
              return false;
            }
          }
        } else {
          // 非并行分支，需要执行成功
          if (status === NodeStatus.FAILED) {
            // 前置节点执行失败
            console.log(
              `前置节点 ${predecessorId} 执行失败，合并节点无法继续执行`,
            );
            return false;
          } else if (status !== NodeStatus.SUCCESS) {
            // 前置节点未完成（可能是pending状态）
            console.log(
              `前置节点 ${predecessorId} 执行状态为 ${status}，合并节点等待...`,
            );
            return false;
          }
        }
      }

      // 检查每个并行组是否满足策略要求
      const nodes = pluginExecutionEngine.getNodes();
      for (const [parallelSourceId, branchInfo] of parallelBranches) {
        const nodeData = nodes.find((n) => n.id === parallelSourceId);
        if (nodeData) {
          const parallelStrategy = nodeData.data?.config?.parallel_strategy;

          // 默认为ALL策略
          if (
            !parallelStrategy ||
            parallelStrategy === 'ALL' ||
            parallelStrategy === 'all'
          ) {
            // ALL策略要求所有分支成功
            if (branchInfo.success !== branchInfo.total) {
              console.log(
                `并行节点 ${parallelSourceId} 采用ALL策略，但只有 ${branchInfo.success}/${branchInfo.total} 个分支成功，合并节点无法继续执行`,
              );
              return false;
            }
          } else if (parallelStrategy === 'ANY' || parallelStrategy === 'any') {
            // ANY策略要求至少一个分支成功
            if (branchInfo.success === 0) {
              console.log(
                `并行节点 ${parallelSourceId} 采用ANY策略，但没有分支成功，合并节点无法继续执行`,
              );
              return false;
            }
          }
        }
      }

      return true;
    } catch (error) {
      console.error('检查前置节点状态时发生错误:', error);
      return false;
    }
  }

  /**
   * 判断节点是否为并行节点的分支
   * @param nodeId 节点ID
   * @param executionHistory 执行历史
   * @param _pluginExecutionEngine 插件执行引擎
   * @returns 是否为并行分支
   */
  private async isParallelBranch(
    nodeId: string,
    executionHistory: ExecutionHistory[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pluginExecutionEngine: PluginExecutionEngine,
  ): Promise<boolean> {
    // 查找是否有并行节点的执行历史记录中包含此节点作为分支
    for (const historyItem of executionHistory) {
      if (historyItem.parallel_edges) {
        const parallelEdge = (historyItem.parallel_edges as any[]).find(
          (edge) => edge.target === nodeId,
        );
        if (parallelEdge) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 获取并行分支的源节点ID
   * @param nodeId 分支节点ID
   * @param executionHistory 执行历史
   * @returns 并行源节点ID
   */
  private async getParallelSourceNodeId(
    nodeId: string,
    executionHistory: ExecutionHistory[],
  ): Promise<string | null> {
    // 查找包含此分支的并行节点
    for (const historyItem of executionHistory) {
      if (historyItem.parallel_edges) {
        const parallelEdge = (historyItem.parallel_edges as any[]).find(
          (edge) => edge.target === nodeId,
        );
        if (parallelEdge) {
          return historyItem.nodeId;
        }
      }
    }
    return null;
  }

  /**
   * 判断是否应该执行此节点
   * @param node 当前节点
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 是否应该执行节点
   */
  async shouldExecuteNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
  ): Promise<boolean> {
    const shouldExecute = await this.checkAllPredecessorNodes(
      node,
      pluginExecutionEngine,
    );
    if (!shouldExecute) {
      console.log(
        `合并节点 ${node.id} 的前置节点尚未全部完成，等待前置节点完成`,
      );
    }
    return shouldExecute;
  }
  /**
   *
   * @param node 节点信息
   * @param pluginExecutionEngine 插件执行引擎
   * @param historyItem 执行历史项
   * @returns 是否执行节点
   */
  async executeNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory,
  ): Promise<boolean> {
    const shouldRun = await this.checkAllPredecessorNodes(
      node,
      pluginExecutionEngine,
    );

    if (!shouldRun) {
      if (historyItem) {
        historyItem.status = NodeStatus.WAITING;
        // 记录开始等待的时间
        historyItem.waitingStartTime = new Date().getTime();
        historyItem.endTime = undefined;
        historyItem.duration = undefined;
        historyItem.contextBefore = undefined;
      }
      console.log(`合并节点 ${node.id} 的前置条件不满足, 等待前置节点完成`);
      return false;
    }

    // 前置条件满足，如果存在等待开始时间，则计算等待耗时
    if (historyItem && historyItem.waitingStartTime) {
      const currentTime = new Date().getTime();
      const waitingDuration = currentTime - historyItem.waitingStartTime;
      // 记录等待耗时
      historyItem.waitingDuration = waitingDuration;
      // 清除等待开始时间，避免重复计算
      delete historyItem.waitingStartTime;
    }

    // 前置条件满足，继续执行标准流程
    return super.executeNode(node, pluginExecutionEngine, historyItem);
  }

  /**
   * 获取节点执行状态
   * 首先检查所有前置节点是否已完成，然后查看节点自身的执行历史
   * @param node 当前节点
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 节点当前状态
   */
  async getExecuteNodeStatus(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
  ): Promise<NodeStatus> {
    try {
      // 获取当前节点的所有入边
      const incomingEdges = pluginExecutionEngine.getIncomingEdges(node.id);
      const executionHistory = pluginExecutionEngine.getExecutionHistory();

      // 检查前置节点是否满足执行条件
      const parallelBranches = new Map<
        string,
        { total: number; success: number; completed: number }
      >();
      const nonParallelPredecessors = new Map<string, NodeStatus>();
      // 记录前置节点完成状态
      let allCompleted = true;

      // 分类处理前置节点
      for (const edge of incomingEdges) {
        const predecessorId = edge.source;

        // 检查是否为并行分支
        const isParallelBranch = await this.isParallelBranch(
          predecessorId,
          executionHistory,
          pluginExecutionEngine,
        );
        if (isParallelBranch) {
          const parallelSourceId = await this.getParallelSourceNodeId(
            predecessorId,
            executionHistory,
          );
          if (parallelSourceId) {
            if (!parallelBranches.has(parallelSourceId)) {
              // 获取并行节点信息
              const parallelEdges =
                pluginExecutionEngine.getOutgoingEdges(parallelSourceId);
              parallelBranches.set(parallelSourceId, {
                total: parallelEdges.length,
                success: 0,
                completed: 0,
              });
            }

            const branchInfo = parallelBranches.get(parallelSourceId)!;
            const status = this.getNodeStatus(executionHistory, predecessorId);
            if (status === NodeStatus.SUCCESS) {
              branchInfo.success++;
            }
            if (status === NodeStatus.SUCCESS || status === NodeStatus.FAILED) {
              branchInfo.completed++;
            } else {
              allCompleted = false;
            }
          }
        } else {
          // 非并行分支
          const status = this.getNodeStatus(executionHistory, predecessorId);
          nonParallelPredecessors.set(predecessorId, status);
          if (status !== NodeStatus.SUCCESS && status !== NodeStatus.FAILED) {
            allCompleted = false;
          }
        }
      }

      // 检查非并行前置节点
      for (const [, status] of nonParallelPredecessors) {
        if (status === NodeStatus.FAILED) {
          // 非并行前置节点失败，合并节点应处于FAILED状态
          return NodeStatus.FAILED;
        }
      }

      // 检查并行分支是否满足策略要求
      const nodes = pluginExecutionEngine.getNodes();
      let anyParallelGroupFailed = false;
      let anyParallelGroupNotCompleted = false;

      for (const [parallelSourceId, branchInfo] of parallelBranches) {
        const nodeData = nodes.find((n) => n.id === parallelSourceId);
        const parallelStrategy = nodeData?.data?.config?.parallel_strategy;

        // 检查是否所有分支都已完成
        if (branchInfo.completed < branchInfo.total) {
          anyParallelGroupNotCompleted = true;
        }

        if (branchInfo.completed === branchInfo.total) {
          if (parallelStrategy === 'ANY' || parallelStrategy === 'any') {
            // ANY策略：至少一个成功
            if (branchInfo.success === 0) {
              anyParallelGroupFailed = true;
            }
          } else {
            // 默认ALL策略：所有分支都成功
            if (branchInfo.success !== branchInfo.total) {
              anyParallelGroupFailed = true;
            }
          }
        }
      }

      // 如果有并行组未完成，返回WAITING
      if (anyParallelGroupNotCompleted || !allCompleted) {
        return NodeStatus.WAITING;
      }

      // 如果有并行组失败，返回FAILED
      if (anyParallelGroupFailed) {
        return NodeStatus.FAILED;
      }

      // 前置条件满足，检查节点自身执行历史
      const nodeStatus = this.getNodeStatus(executionHistory, node.id);
      return nodeStatus;
    } catch (error) {
      console.error('获取节点执行状态时发生错误:', error);
      return NodeStatus.PENDING;
    }
  }

  /**
   * 获取节点执行状态
   * @param executionHistory 执行历史
   * @param nodeId 节点ID
   * @returns 节点状态
   */
  private getNodeStatus(
    executionHistory: ExecutionHistory[],
    nodeId: string,
  ): NodeStatus {
    // 查找最新的执行历史
    const nodeHistory = executionHistory
      .filter((history) => history.nodeId === nodeId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

    if (nodeHistory.length === 0) {
      return NodeStatus.PENDING;
    }

    return nodeHistory[0].status as NodeStatus;
  }
}

export default MergeNodePlugin;

/*
 * @File: BaseNodePlugin.ts
 * @desc: 节点插件基类，提供所有节点类型共用的基础实现逻辑
 * @author: heqinghua
 * @date: 2025年09月25日
 */
import { NodePlugin } from './NodePlugin';
import { NodeStatus } from '../constants';
import type { Edge, ExecutionHistory, Node, PluginNodeType } from '../types';
import type { PluginExecutionEngine } from '../utils/PluginExecutionEngine';

/**
 * 节点插件基类
 * 实现了NodePlugin接口的通用逻辑，为各种具体节点类型提供统一的基础实现
 * 具体节点插件通过继承此类并重写特定方法来实现差异化的节点行为
 */
export abstract class BaseNodePlugin implements NodePlugin {
  /**
   * 插件节点类型标识符
   * 由具体子类实现
   */
  abstract pluginNodeType: PluginNodeType;
  /**
   * 插件节点类型名称
   */
  abstract pluginNodeTypeName: string;

  /**
   * 执行节点的核心业务逻辑（默认行为）
   * - 先判断是否应该执行
   * - 再评估节点上的条件（如有）
   * - 最后执行事件（如有）
   * 子类可覆写以实现差异化逻辑（如并行/迭代）
   * @param node 当前要执行的节点对象
   * @param pluginExecutionEngine 插件执行引擎实例
   * @param historyItem 执行历史记录项（可选）
   * @returns 执行是否成功的布尔值
   */
  async executeNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory,
  ): Promise<boolean> {
    const shouldRun = await this.shouldExecuteNode(node, pluginExecutionEngine);
    if (!shouldRun) return false;

    const conditions = node.data?.config?.conditions;
    if (conditions && typeof conditions === 'object' && Object.keys(conditions).length > 0) {
      const allArr = (conditions as any).all;
      const anyArr = (conditions as any).any;
      if ((Array.isArray(allArr) && allArr.length > 0) || (Array.isArray(anyArr) && anyArr.length > 0)) {
        try {
          const rulePass = await pluginExecutionEngine.evaluateRule(conditions, node.id);
          if (!rulePass) {
            if (historyItem) {
              historyItem.engineResult = '条件不满足、规则评估失败';
            }
            return false;
          }
        } catch (error) {
          if (historyItem) {
            historyItem.engineResult = `规则评估异常: ${error instanceof Error ? error.message : String(error)}`;
          }
          return false;
        }
      }
    }

    if (node.data?.config?.event) {
      try {
        const methodResult = await pluginExecutionEngine.evaluateMethod(node.data.config.event, node.id);
        if (historyItem) {
          historyItem.eventResult = `[${node.data.config.event.type}] 事件调用成功`;
        }
        return true;
      } catch (error) {
        if (historyItem) {
          historyItem.engineResult = `[${node.data.config.event.type}] 事件调用失败: ${error instanceof Error ? error.message : String(error)}`;
          historyItem.eventResult = `[${node.data.config.event.type}] 事件调用失败: ${error instanceof Error ? error.message : String(error)}`;
        }
        return false;
      }
    }

    return true;
  }

  /**
   * 获取节点当前的执行状态
   * @param node 要查询状态的节点对象
   * @param pluginExecutionEngine 插件执行引擎实例
   * @returns 节点状态或null
   */
  async getExecuteNodeStatus(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
  ): Promise<NodeStatus | null> {
    const executionHistory = pluginExecutionEngine.getExecutionHistory();
    const nodeHistory = executionHistory.filter((item) => item.nodeId === node.id);

    if (nodeHistory.length === 0) {
      return NodeStatus.PENDING;
    }

    const latestHistory = nodeHistory.reduce((latest, current) => {
      return current.timestamp > latest.timestamp ? current : latest;
    });

    return latestHistory.status as NodeStatus;
  }

  /**
   * 获取流程中下一个要执行的节点ID（默认路由策略）
   * - 遍历出边，优先匹配条件成立的边
   * - 其次选择标记了 `isDefault` 的边
   * - 最后回退到第一条出边
   * @param edges 当前节点的所有出边集合
   * @param pluginExecutionEngine 插件执行引擎实例
   * @param historyItem 执行历史记录项（可选）
   * @returns 单个节点ID、多个节点ID数组或null（表示流程结束）
   */
  async getNextNodeId(
    edges: Edge[],
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory,
  ): Promise<string | string[] | null> {
    if (!edges || edges.length === 0) {
      return null;
    }

    for (const edge of edges) {
      try {
        if (edge.data?.conditions) {
          const isMatch = await pluginExecutionEngine.evaluateRule(edge.data.conditions, edge.id);
          if (isMatch) {
            return edge.target;
          }
        }
      } catch {
      }
    }

    const defaultEdge = edges.find((e) => e.data?.isDefault);
    if (defaultEdge) {
      return defaultEdge.target;
    }

    return edges[0].target;
  }

  /**
   * 判断节点是否应该执行
   * 子类可以覆盖此方法实现特定的执行条件判断，包括WAITING状态的处理
   * @param node 要执行的节点
   * @param pluginExecutionEngine 插件执行引擎实例
   * @returns 是否应该执行节点
   */
  async shouldExecuteNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
  ): Promise<boolean> {
    return true;
  }

  /**
   * 节点执行完成后的回调（默认路由行为）
   * - 在执行成功时自动跳转到下一个节点
   * - 使用引擎的 `getNextNodeId` 以委托子类（如分支/并行）自定义路由
   * @param node 当前节点
   * @param pluginExecutionEngine 插件执行引擎实例
   * @param historyItem 执行历史记录项
   * @param result 执行结果
   */
  async onNodeComplete(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem: ExecutionHistory,
    result: boolean,
  ): Promise<void> {
    if (!result) {
      return;
    }

    const next = await pluginExecutionEngine.getNextNodeId(node.id, historyItem);

    if (Array.isArray(next)) {
      for (const id of next) {
        await pluginExecutionEngine.executeNode(id);
      }
    } else if (typeof next === 'string') {
      await pluginExecutionEngine.executeNode(next);
    }
  }
}
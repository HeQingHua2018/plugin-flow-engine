/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @File: BaseNodePlugin.ts
 * @desc: 节点插件基类，提供所有节点类型共用的基础实现逻辑
 * @author: heqinghua
 * @date: 2025年09月25日
 */

import {
  type Edge,
  type Node,
  type ExecutionHistory,
  type PluginNodeType,
  NodeStatus,
} from "@plugin-flow-engine/type/core";
import { type NodeConfig } from "@plugin-flow-engine/type/common";
import type { PluginExecutionEngine } from "../utils/PluginExecutionEngine";
import { NodePlugin } from "./NodePlugin";

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
   * 获取节点表单配置项
   * 用于动态生成节点配置表单，支持自定义字段和验证规则
   * @returns 节点表单配置项schema对象或null（如果节点不支持配置）
   */
  getNodeFormConfig(): NodeConfig | null {
    return null;
  }

  /**
   * 执行节点的核心业务逻辑（默认行为）
   * - 先评估节点上的条件（如有）
   * - 再执行事件（如有）
   * - 记录执行历史的状态与时间
   * 子类可覆写以实现差异化逻辑（如并行/迭代）
   */
  async executeNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<boolean> {
    // 评估节点条件（若未配置条件则视为通过）
    const conditions = node.data?.config?.conditions;
    let shouldRun = true;
    try {
      if (conditions && Object.keys(conditions).length > 0) {
        shouldRun = await pluginExecutionEngine.evaluateRule(conditions, node.id);
      }
    } catch (error) {
      shouldRun = false;
    }

    if (!shouldRun) {
      if (historyItem) {
        historyItem.status = NodeStatus.PENDING;
        historyItem.endTime = new Date();
        historyItem.duration = historyItem.startTime
          ? historyItem.endTime.getTime() - historyItem.startTime.getTime()
          : 0;
        historyItem.contextAfter = {
          ...pluginExecutionEngine.getContextManager().getVariables(),
        };
      }
      return false;
    }

    // 执行事件（若有）
    let result: any = true;
    try {
      if (node.data?.config?.event) {
        result = await pluginExecutionEngine.evaluateMethod(
          node.data.config.event,
          node.id
        );
      }
    } catch (error) {
      // evaluateMethod 内部已处理历史项与错误状态，这里仅返回失败
      result = false;
    }

    // 记录执行成功状态与时间
    if (historyItem) {
      historyItem.status = result ? NodeStatus.SUCCESS : NodeStatus.FAILED;
      historyItem.endTime = new Date();
      historyItem.duration = historyItem.startTime
        ? historyItem.endTime.getTime() - historyItem.startTime.getTime()
        : 0;
      historyItem.contextAfter = {
        ...pluginExecutionEngine.getContextManager().getVariables(),
      };
      historyItem.engineResult = result;
    }

    return !!result;
  }

  /**
   * 获取节点当前的执行状态
   * @param node 要查询状态的节点对象
   * @param pluginExecutionEngine 插件执行引擎实例
   * @returns 节点状态或null
   */
  async getExecuteNodeStatus(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<NodeStatus | null> {
    return NodeStatus.SUCCESS;
  }

  /**
   * 获取流程中下一个要执行的节点ID（默认路由策略）
   * - 遍历出边，优先匹配条件成立的边
   * - 其次选择标记了 `isDefault` 的边
   * - 最后回退到第一条出边
   */
  async getNextNodeId(
    edges: Edge[],
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<string | string[] | null> {
    if (!edges || edges.length === 0) {
      return null;
    }

    // 1) 优先匹配条件成立的边
    for (const edge of edges) {
      try {
        if (edge.data?.conditions) {
          const isMatch = await pluginExecutionEngine.evaluateRule(
            edge.data.conditions,
            edge.id
          );
          if (isMatch) {
            return edge.target;
          }
        }
      } catch {
        // 忽略单条边的规则异常，继续尝试其他边
      }
    }

    // 2) 选择默认边
    const defaultEdge = edges.find((e) => e.data?.isDefault);
    if (defaultEdge) {
      return defaultEdge.target;
    }

    // 3) 回退到第一条出边
    return edges[0].target;
  }

  /**
   * 是否应该执行此节点（默认实现）
   * - 若节点配置了条件，则在此处进行评估，未通过则跳过执行
   */
  async shouldExecuteNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<boolean> {
    const conditions = node.data?.config?.conditions;
    if (!conditions || Object.keys(conditions).length === 0) {
      return true;
    }
    try {
      return await pluginExecutionEngine.evaluateRule(conditions, node.id);
    } catch {
      return false;
    }
  }

  /**
   * 节点执行完成后的回调（默认路由行为）
   * - 在执行成功时自动跳转到下一个节点
   * - 使用引擎的 `getNextNodeId` 以委托子类（如分支/并行）自定义路由
   */
  async onNodeComplete(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem: ExecutionHistory,
    result: boolean
  ): Promise<void> {
    if (!result) return;

    const next = await pluginExecutionEngine.getNextNodeId(
      node.id,
      historyItem
    );

    if (Array.isArray(next)) {
      // 基类默认顺序执行（并行节点会覆写此方法实现并行）
      for (const id of next) {
        await pluginExecutionEngine.executeNode(id);
      }
    } else if (typeof next === "string") {
      await pluginExecutionEngine.executeNode(next);
    }
    // null 表示流程结束，基类不作处理
  }
}

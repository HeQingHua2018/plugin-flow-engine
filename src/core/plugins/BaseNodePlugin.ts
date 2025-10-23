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
  type NodeConfig,
  NodeStatus,
} from "../type.d";
import type { PluginExecutionEngine } from "../utils/PluginExecutionEngine";
import { NodePlugin } from "./NodePlugin.d";
// import { FlowExecutionError, errorHandler } from "../utils/FlowError";

/**
 * 节点插件基类
 * 实现了NodePlugin接口的通用逻辑，为各种具体节点类型提供统一的基础实现
 * 具体节点插件通过继承此类并重写特定方法来实现差异化的节点行为
 */
export abstract class BaseNodePlugin implements NodePlugin {
  /**
   * 节点类型标识符
   * 由具体子类实现
   */
  abstract nodeType: string;
  /**
   * 节点类型名称
   */
  abstract nodeTypeName: string;

  /**
   * 获取节点表单配置项schema
   * @returns 节点表单配置项schema对象
   */
  getNodeFormConfig() :NodeConfig | null{
    return null;
  }

  /**
   * 执行节点的核心业务逻辑
   * 默认实现：评估规则条件并调用节点事件
   * @param node 当前要执行的节点对象
   * @param pluginExecutionEngine 插件执行引擎实例
   * @param historyItem 执行历史记录项，用于记录执行过程和结果
   * @returns 执行是否成功的布尔值
   */
  async executeNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<boolean> {
    try {
      // 评估规则
      const ruleResult = await this.evaluateRule(
        node,
        pluginExecutionEngine,
        historyItem
      );
      if (!ruleResult) {
        await this.updateNodeExecutionHistory(
          NodeStatus.FAILED,
          pluginExecutionEngine,
          historyItem
        );
        return false;
      }

      // 调用事件
      const eventResult = await this.invokeEvent(
        node,
        pluginExecutionEngine,
        historyItem
      );

      // 更新节点状态
      await this.updateNodeExecutionHistory(
        eventResult ? NodeStatus.SUCCESS : NodeStatus.FAILED,
        pluginExecutionEngine,
        historyItem
      );

      return eventResult;
    } catch (error) {
      console.error(`执行节点[${node.id}]时出错:`, error);
      await this.updateNodeExecutionHistory(
        NodeStatus.FAILED,
        pluginExecutionEngine,
        historyItem
      );
      return false;
    }
  }

  /**
   * 评估节点规则条件
   * 默认实现：使用json-rules-engine评估节点配置的条件表达式
   * @param node 当前节点对象
   * @param pluginExecutionEngine 插件执行引擎实例
   * @param historyItem 执行历史记录项
   * @returns 规则评估是否通过的布尔值
   */
  protected async evaluateRule(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<boolean> {
    if (!node.config.conditions) {
      return true;
    }
    try {
      // 使用插件执行引擎的规则评估功能，传递节点ID用于错误上下文
      return await pluginExecutionEngine.evaluateRule(node.config.conditions, node.id);
    } catch (error) {
      // 记录规则评估失败的信息到engineResult
      if (historyItem) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        historyItem.engineResult = errorMessage;
      }
      return false;
    }
  }

  /**
   * 调用节点配置的事件
   * 默认实现：调用节点配置中定义的事件处理函数
   * @param node 当前节点对象
   * @param pluginExecutionEngine 插件执行引擎实例
   * @param historyItem 执行历史记录项
   * @returns 事件执行是否成功的布尔值
   */
  protected async invokeEvent(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<boolean> {
    if (!node.config.event || !node.config.event.type) {
      return true;
    }
    try {
      // 使用插件执行引擎的事件调用功能，传递节点ID用于错误上下文
      const result = await pluginExecutionEngine.evaluateMethod(
        node.config.event,
        node.id
      );

      // 直接记录事件结果到对应的历史记录项，而不是依赖共享的currentHistoryItem
      if (historyItem) {
        historyItem.eventResult = result;
        historyItem.engineResult = "节点执行成功";
      }

      // 如果返回值是布尔类型，直接返回
      if (typeof result === "boolean") {
        return result;
      }
      // 如果有结果返回，表示执行成功
      return result !== undefined;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (historyItem) {
        historyItem.eventResult = errorMessage;
        historyItem.engineResult = errorMessage;
      }
      return false;
    }
  }

  /**
   * 更新节点执行历史记录
   * 允许插件在执行过程中动态修改节点的执行历史记录
   * @param status 新的状态
   * @param historyItem 执行历史记录项
   * @param pluginExecutionEngine 插件执行引擎
   */
  protected async updateNodeExecutionHistory(
    status: NodeStatus,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<void> {
    if (historyItem) {
      historyItem.status = status;
      historyItem.endTime = new Date();
      historyItem.duration =
        historyItem.startTime &&
        historyItem.endTime.getTime() - historyItem.startTime.getTime();
      historyItem.contextAfter = {
        ...pluginExecutionEngine.getContextManager().getVariables(),
      };
    }
  }

  /**
   * 获取节点状态
   * @param node 当前节点
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 节点状态
   */
  async getExecuteNodeStatus(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<string | null> {
    // 先检查是否应该执行此节点
    const shouldExecute = await this.shouldExecuteNode(
      node,
      pluginExecutionEngine
    );
    if (!shouldExecute) {
      return NodeStatus.PENDING;
    }

    // 检查节点的执行历史
    const history = pluginExecutionEngine.getExecutionHistory();
    const nodeHistory = history.filter((item) => item.nodeId === node.id);

    if (nodeHistory.length > 0) {
      // 获取最新的历史记录
      const latestHistory = nodeHistory.reduce((latest, current) =>
        current.timestamp.getTime() > latest.timestamp.getTime()
          ? current
          : latest
      );
      return latestHistory.status;
    }

    // 默认返回pending状态
    return NodeStatus.PENDING;
  }

  /**
   * 获取下一个节点ID
   * 负责决定执行完当前节点后应该执行哪个或哪些节点
   * @param edges 所有出边的集合
   * @param pluginExecutionEngine 插件执行引擎
   * @param historyItem 执行历史记录项（可选）
   * @returns 下一个节点ID或null或ID数组(并行执行)
   */
  async getNextNodeId(
    edges: Edge[],
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem?: ExecutionHistory
  ): Promise<string | string[] | null> {
    // 默认实现：如果没有边，返回null
    if (edges.length === 0) {
      return null;
    }
    // 返回第一个出边的目标节点ID
    return edges[0].target;
  }

  /**
   * 判断是否应该执行此节点
   * 负责决定节点的执行时机
   * @param node 当前节点
   * @param pluginExecutionEngine 插件执行引擎
   * @returns 是否应该执行
   */
  async shouldExecuteNode(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine
  ): Promise<boolean> {
    // 默认实现：始终返回true，表示应该执行
    return true;
  }

  /**
   * 节点执行完成后的回调
   * 负责处理节点执行后的下一步流程
   * @param node 当前节点
   * @param pluginExecutionEngine 插件执行引擎
   * @param historyItem 执行历史记录项
   * @param result 执行结果
   */
  async onNodeComplete(
    node: Node,
    pluginExecutionEngine: PluginExecutionEngine,
    historyItem: ExecutionHistory,
    result: boolean
  ): Promise<void> {
    if (result === true) {
      const outgoingEdges = pluginExecutionEngine.getOutgoingEdges(node.id);
      const nextNodeInfo = await this.getNextNodeId(
        outgoingEdges,
        pluginExecutionEngine,
        historyItem
      );
      // 只处理字符串类型的节点ID（串行执行）
      if (typeof nextNodeInfo === "string") {
        await pluginExecutionEngine.executeNode(nextNodeInfo);
      }
      // 对于数组类型和null，BaseNodePlugin不做处理，由特定的插件子类（如ParallelNodePlugin）来实现
    }
  }
}

/*
 * @File: PluginExecutionEngine.ts
 * @desc: 插件化流程执行引擎核心类，负责协调各节点插件的执行和流程控制
 * @author: heqinghua
 * @date: 2025年09月24日
 */

import { Engine, type Event } from 'json-rules-engine';
import {
  type Edge,
  type ExecutionContext,
  type ExecutionHistory,
  type FlowData,
  type Node,
  EdgeType, NodeStatus
} from '@plugin-flow-engine/type/core';
import { ComponentManager } from './ComponentManager';
import { ContextManager } from './ContextManager';
import { FlowExecutionError, errorHandler } from './FlowError';
import { flowMonitor } from './FlowMonitor';
import { flowValidator } from './FlowValidator';
import { PluginManager } from './PluginManager';
import { registerAllOperators } from './RuleOperators';

/**
 * 插件化执行引擎类
 * 流程执行的核心控制器，负责协调各节点插件的执行、维护执行上下文和流程状态
 * 实现了基于插件的可扩展架构，将具体节点的执行逻辑委托给对应的插件处理
 */
export class PluginExecutionEngine {
  private flow: FlowData | null = null;
  private nodes: Record<string, Node> = {};
  private executionHistory: ExecutionHistory[] = [];
  public hasFailed = false;
  private currentHistoryItem: ExecutionHistory | null = null;
  private eventListeners: Map<string, Array<(...args: any[]) => void>> =
    new Map();

  // 性能优化：缓存常用对象
  private nodeCache: Map<string, Node> = new Map();
  private edgeCache: Map<string, Edge[]> = new Map();

  // 引擎实例拥有独立的管理器实例
  private contextManager: ContextManager;
  private componentManager: ComponentManager;
  private pluginManager: PluginManager;

  /**
   * 构造函数
   * 初始化执行引擎及其依赖的各管理器实例
   */
  constructor() {
    this.contextManager = new ContextManager(); // 实例-上下文管理器 每个流程执行都有独立的上下文
    // 使用单例模式获取管理器实例，避免重复初始化
    this.componentManager = ComponentManager.getInstance(); // 使用InstanceManager的单例模式
    this.pluginManager = PluginManager.getInstance(); // 使用PluginManager的单例模式
  }

  /**
   * 注册事件监听器
   * @param eventName 事件名称
   * @param listener 监听器函数
   */
  public on(eventName: string, listener: (...args: any[]) => void): void {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName)?.push(listener);
  }

  /**
   * 移除事件监听器
   * @param eventName 事件名称
   * @param listener 监听器函数
   */
  public off(eventName: string, listener: (...args: any[]) => void): void {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param args 事件参数
   */
  private emit(eventName: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`执行事件监听器时出错:`, error);
        }
      });
    }
  }

  /**
   * 获取当前执行上下文
   * @returns 当前的执行上下文对象或null
   */
  getContext(): ExecutionContext | null {
    try {
      return this.contextManager.getContext();
    } catch (error) {
      console.error('获取上下文失败：', error);
      return null;
    }
  }

  /**
   * 设置引擎执行失败状态
   * @param hasFailed 是否执行失败
   */
  public setHasFailed(hasFailed: boolean): void {
    this.hasFailed = hasFailed;
  }

  /**
   * 更新执行上下文
   * @param context 新的执行上下文对象
   */
  updateContext(context: ExecutionContext): void {
    this.contextManager.updateContext(context);
  }

  /**
   * 获取上下文管理器实例
   * @returns 上下文管理器实例
   */
  public getContextManager(): ContextManager {
    return this.contextManager;
  }

  /**
   * 获取当前流程中的所有节点
   * @returns 节点对象数组
   */
  public getNodes(): Node[] {
    if (!this.flow) {
      return [];
    }
    return [...this.flow.nodes];
  }

  /**
   * 获取指定的节点
   * @param nodeId 节点ID（可选）
   * @returns 单个节点对象、所有节点数组或undefined
   */
  public getNode(nodeId?: string): Node | Node[] | undefined {
    if (!this.flow) {
      return [];
    }
    if (!nodeId) {
      return [...this.flow.nodes];
    }

    // 使用缓存优化性能
    if (this.nodeCache.has(nodeId)) {
      return this.nodeCache.get(nodeId);
    }

    const node = this.nodes[nodeId];
    if (node) {
      this.nodeCache.set(nodeId, node);
    }
    return node;
  }

  /**
   * 获取指定节点的边
   * @param nodeId 节点ID
   * @param edgeType 边类型：'in'（入边）、'out'（出边）、'all'（所有边）
   * @returns 边数组
   */
  public getEdges(nodeId: string, edgeType: EdgeType = EdgeType.ALL): Edge[] {
    if (!this.flow) {
      return [];
    }

    // 使用缓存优化性能
    const cacheKey = `${nodeId}_${edgeType}`;
    if (this.edgeCache.has(cacheKey)) {
      return this.edgeCache.get(cacheKey)!;
    }

    let edges: Edge[];
    switch (edgeType) {
      case EdgeType.INCOMING:
        edges = this.flow.edges.filter((edge) => edge.target === nodeId);
        break;
      case EdgeType.OUTGOING:
        edges = this.flow.edges.filter((edge) => edge.source === nodeId);
        break;
      case EdgeType.ALL:
      default:
        edges = this.flow.edges.filter(
          (edge) => edge.source === nodeId || edge.target === nodeId,
        );
        break;
    }

    // 缓存结果
    this.edgeCache.set(cacheKey, edges);
    return edges;
  }

  /**
   * 获取指定节点的所有入边
   * @param nodeId 节点ID
   * @returns 入边数组
   */
  public getIncomingEdges(nodeId: string): Edge[] {
    return this.getEdges(nodeId, EdgeType.INCOMING);
  }

  /**
   * 获取指定节点的所有出边
   * @param nodeId 节点ID
   * @returns 出边数组
   */
  public getOutgoingEdges(nodeId: string): Edge[] {
    return this.getEdges(nodeId, EdgeType.OUTGOING);
  }

  /**
   * 获取实例管理器实例
   * @returns 实例管理器实例
   */
  public getComponentManager(): ComponentManager {
    return this.componentManager;
  }
  /**
   * 获取插件管理器实例
   * @returns 插件管理器实例
   */
  public getPluginManager(): PluginManager {
    return this.pluginManager;
  }

  /**
   * 获取规则引擎实例
   * @returns 规则引擎实例
   */
  private createEngine(): Engine {
    const engine = new Engine();
    registerAllOperators(engine);
    return engine;
  }
  /**
   * 递归提取条件中使用到的 fact 名称，避免未定义导致引擎抛错
   * @param conditions 规则条件
   * @param acc 累加器，用于存储提取到的 fact 名称
   * @returns 包含所有使用到的 fact 名称的 Set 集合
   */
  private collectConditionFacts(
    conditions: any,
    acc: Set<string> = new Set(),
  ): Set<string> {
    if (!conditions || typeof conditions !== 'object') return acc;
    const groups = Array.isArray(conditions)
      ? conditions
      : [...(conditions.all || []), ...(conditions.any || [])];
    groups.forEach((cond: any) => {
      if (!cond) return;
      if (typeof cond.fact === 'string') acc.add(cond.fact);
      if (cond.all || cond.any) this.collectConditionFacts(cond, acc);
    });
    return acc;
  }
  /**
   * 评估规则
   * @param conditions 规则
   * @param nodeId 节点ID（可选，用于错误上下文）
   * @returns boolean
   */
  async evaluateRule(conditions?: any, nodeId?: string): Promise<boolean> {
    if (!conditions) {
      return true;
    }

    // 每次都创建新的规则引擎实例，避免规则冲突
    const engine = this.createEngine();
    try {
      const variables = this.contextManager.getVariables();
      // 为缺失的 fact 填充默认值，避免 json-rules-engine 在取值时抛错
      const facts = this.collectConditionFacts(conditions);
      const safeVariables: Record<string, any> = { ...variables };
      facts.forEach((name) => {
        if (!Object.prototype.hasOwnProperty.call(safeVariables, name)) {
          safeVariables[name] = null; // 使用 null 作为默认空值
        }
      });

      console.log(`[PluginExecutionEngine] 评估规则 ${nodeId}:`, conditions);
      console.log(`[PluginExecutionEngine] 当前变量:`, variables);
      console.log(`[PluginExecutionEngine] 归一化变量:`, safeVariables);

      // 添加规则
      engine.addRule({
        conditions,
        event: { type: 'match' },
      });

      // 运行规则引擎（使用归一化变量）
      const results = await engine.run(safeVariables);

      // 检查是否有匹配的事件
      const isMatch = results.events.some(
        (event: any) => event.type === 'match',
      );

      console.log(`[PluginExecutionEngine] 规则 ${nodeId} 评估结果:`, isMatch);
      console.log(`[PluginExecutionEngine] 引擎结果:`, results);
      console.log(`[PluginExecutionEngine] 匹配的事件:`, results.events);

      return isMatch;
    } catch (error) {
      console.log(`[PluginExecutionEngine] 规则 ${nodeId} 评估异常:`, error);
      this.hasFailed = true;
      const flowError = FlowExecutionError.ruleEvaluationFailed(
        nodeId || 'unknown',
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error : undefined,
      );
      throw errorHandler.handleError(flowError);
    }
  }

  /**
   * 调用事件的方法
   * @param event 事件配置
   * @param nodeId 节点ID（可选，用于错误上下文）
   * @returns 方法执行结果
   */
  async evaluateMethod(event?: Event, nodeId?: string): Promise<any> {
    if (!event || Object.keys(event).length === 0) {
      return true;
    }
    if (!event.type) {
      return false;
    }

    try {
      const result = await this.componentManager.callMethod(
        event.type,
        event.params,
      );
      // 更新上下文
      if (result && typeof result === 'object') {
        this.contextManager.updateVariables(result);
      }
      return result;
    } catch (error) {
      const flowError = FlowExecutionError.eventExecutionFailed(
        nodeId || 'unknown',
        event.type,
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error : undefined,
      );

      if (this.currentHistoryItem) {
        this.currentHistoryItem.eventResult = flowError.message;
        this.currentHistoryItem.engineResult = flowError.message;
      }

      this.hasFailed = true;
      throw errorHandler.handleError(flowError);
    }
  }

  /**
   * 初始化引擎
   * @param flow 流程定义
   * @param context 执行上下文
   */
  initialize(flow: FlowData, context: ExecutionContext) {
    // 预处理：对齐节点名称到 data.name，兼容旧数据结构
    const normalizedFlow: FlowData = {
      ...flow,
      nodes: (flow.nodes || []).map((node) => {
        const data = { ...(node as any).data };
        const name =
          data?.name ?? data?.label ?? data?.pluginNodeType ?? node.id;
        return { ...node, data: { ...data, name } } as any;
      }),
      edges: flow.edges || [],
    };

    // 验证流程定义
    try {
      flowValidator.validateAndThrow(normalizedFlow);
    } catch (error) {
      throw errorHandler.handleError(error);
    }

    this.flow = normalizedFlow;
    this.contextManager.initialize({ ...context });
    this.executionHistory = []; // 重置执行历史记录
    this.hasFailed = false; // 重置失败标志

    // 清理缓存
    this.nodeCache.clear();
    this.edgeCache.clear();

    // 初始化节点映射（包含所有类型节点）
    this.nodes = normalizedFlow.nodes.reduce((map, node) => {
      map[node.id] = node;
      return map;
    }, {} as Record<string, Node>);
  }

  /**
   * 获取执行历史记录
   * @returns 执行历史记录数组
   */
  public getExecutionHistory(): ExecutionHistory[] {
    return [...this.executionHistory];
  }

  /**
   * 获取下一个节点ID
   * @param nodeId 节点ID
   * @param historyItem 执行历史记录项（可选）
   * @returns 下一个节点ID或null或ID数组
   */
  public async getNextNodeId(
    nodeId: string,
    historyItem?: ExecutionHistory,
  ): Promise<string | string[] | null> {
    if (!this.flow) {
      return null;
    }

    const node = this.nodes[nodeId];
    if (!node) {
      return null;
    }

    // 获取该节点的所有出边
    const outgoingEdges = this.getOutgoingEdges(node.id);

    // 调用插件的getNextNodeId方法获取下一个节点ID，传递historyItem参数
    const plugin = this.pluginManager.getPlugin(node.data?.pluginNodeType);
    if (plugin) {
      return await plugin.getNextNodeId(outgoingEdges, this, historyItem);
    }

    return null;
  }

  /**
   * 获取节点状态
   * @param nodeId 节点ID
   * @returns 节点状态或null
   */
  public async getNodeStatus(nodeId: string): Promise<NodeStatus | null> {
    if (!this.flow || !this.nodes[nodeId]) {
      return null;
    }

    const node = this.nodes[nodeId];
    const plugin = this.pluginManager.getPlugin(node.data?.pluginNodeType);
    if (plugin) {
      return await plugin.getExecuteNodeStatus(node, this);
    }

    return null;
  }

  /**
   * 执行整个流程
   * @returns 执行结果
   */
  async executeFlow(startNodeId = 'trigger'): Promise<{
    status: boolean;
    message: string;
    variables?: Record<string, any>;
    errorInfo?: any;
    executionReport?: any;
  }> {
    if (!this.flow) {
      return {
        status: false,
        message: '引擎未初始化，请先调用initialize方法',
      };
    }

    // 开始监控
    flowMonitor.startMonitoring(this.flow.flow.id);

    // 执行前先清空历史记录
    this.executionHistory = [];
    // 重置失败标志
    this.hasFailed = false;

    try {
      // 执行起始节点（默认trigger）
      await this.executeNode(startNodeId);

      // 检查是否有失败
      const hasFailed = this.checkForFailedNodes();

      // 停止监控并生成报告
      const executionReport = flowMonitor.stopMonitoring(this.flow.flow.id);

      // 根据执行结果返回相应信息
      const result = {
        status: !hasFailed,
        message: hasFailed ? '流程执行失败' : '流程执行完成',
        variables: this.contextManager.getVariables(),
        errorInfo: hasFailed ? this.findLatestFailedNode() : undefined,
        executionReport,
      };

      // 触发流程完成事件
      this.emit('flow_completed', result);
      return result;
    } catch (error) {
      // 停止监控
      const executionReport = flowMonitor.stopMonitoring(this.flow.flow.id);

      const result = {
        status: false,
        message: '流程执行失败',
        variables: this.contextManager.getVariables(),
        errorInfo: {
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        },
        executionReport,
      };

      // 触发流程完成事件
      this.emit('flow_completed', result);
      return result;
    }
  }

  /**
   * 执行节点的逻辑
   * @param nodeId 节点ID
   * @returns 执行结果
   */
  public async executeNode(nodeId: string): Promise<boolean> {
    if (!this.flow || !this.nodes[nodeId]) {
      this.hasFailed = true;
      return false;
    }

    const node = this.nodes[nodeId];
    const plugin = this.pluginManager.getPlugin(node.data?.pluginNodeType);

    // 如果没有对应类型的插件，无法执行
    if (!plugin) {
      const flowError = FlowExecutionError.pluginNotFound(
        node.data?.pluginNodeType || 'unknown',
      );
      throw errorHandler.handleError(flowError);
    }

    try {
      // 在执行节点前先判断是否应该执行该节点
      const shouldExecute = await plugin.shouldExecuteNode(node, this);

      if (!shouldExecute) {
        // 如果不应该执行，不创建历史记录，直接返回false
        console.log(`节点 ${node.id} 被跳过，不满足执行条件`);
        return false;
      }

      // 只有当应该执行时才创建历史记录项
      const historyItem: ExecutionHistory = {
        nodeId: node.id,
        nodeName: node.data?.name ?? node.id,
        nodeType: node.type,
        pluginNodeType: node.data?.pluginNodeType,
        status: NodeStatus.PENDING,
        startTime: new Date(),
        timestamp: new Date(),
        contextBefore: { ...this.contextManager.getVariables() },
        conditions: node.data?.config?.conditions,
        eventResult: undefined,
        engineResult: undefined,
      };

      // 只有当有event配置时才记录event
      if (node.data?.config?.event) {
        historyItem.event = node.data?.config?.event;
      }

      this.currentHistoryItem = historyItem;

      // 调用插件的execute方法执行节点逻辑
      const executeResult = await plugin.executeNode(node, this, historyItem);

      // 记录节点执行时间到监控器
      if (historyItem.startTime && historyItem.endTime) {
        const executionTime =
          historyItem.endTime.getTime() - historyItem.startTime.getTime();
        flowMonitor.recordNodeExecution(
          node.id,
          executionTime,
          historyItem.status as NodeStatus,
          historyItem.nodeName,
          historyItem.pluginNodeType,
        );
      }

      // 添加到历史记录中
      this.executionHistory.push(historyItem);

      // 触发历史记录更新事件
      this.emit('history_updated', this.getExecutionHistory());
      this.emit('node_executed', historyItem);

      // 调用插件的完成回调
      await plugin.onNodeComplete(node, this, historyItem, executeResult);

      return executeResult;
    } catch (error) {
      // 只有在有历史记录项时才处理错误
      if (this.currentHistoryItem) {
        this.handleExecutionError(this.currentHistoryItem, error);
      }
      this.hasFailed = true;
      return false;
    } finally {
      // 无论执行成功还是失败，都清除当前历史记录项
      this.currentHistoryItem = null;
    }
  }

  /**
   * 处理执行错误
   * @param historyItem 历史记录项
   * @param error 错误
   */
  private handleExecutionError(historyItem: ExecutionHistory, error: any) {
    console.error(`执行节点 ${historyItem.nodeName} 时发生错误:`, error);

    // 提取错误信息
    const errorMessage = error instanceof Error ? error.message : String(error);

    // 记录错误到历史项
    if (historyItem.event) {
      historyItem.eventResult = errorMessage;
    }

    historyItem.status = NodeStatus.FAILED;
    historyItem.endTime = new Date();
    historyItem.duration = historyItem.startTime
      ? historyItem.endTime.getTime() - historyItem.startTime.getTime()
      : 0;
    historyItem.contextAfter = { ...this.contextManager.getVariables() };
    historyItem.engineResult = errorMessage;

    // 确保只添加一次该历史记录项
    if (
      !this.executionHistory.some(
        (item) =>
          item.nodeId === historyItem.nodeId &&
          item.timestamp.getTime() === historyItem.timestamp.getTime(),
      )
    ) {
      this.executionHistory.push(historyItem);

      // 触发历史记录更新事件
      this.emit('history_updated', this.getExecutionHistory());
      this.emit('node_executed', historyItem);
    }
  }

  /**
   * 检查是否有失败的节点
   * @returns 是否有失败的节点
   */
  private checkForFailedNodes(): boolean {
    return this.executionHistory.some((item) => item.status === NodeStatus.FAILED);
  }

  /**
   * 查找最新失败的节点信息
   * @returns 最新失败节点的执行历史记录或undefined
   */
  private findLatestFailedNode(): ExecutionHistory | undefined {
    // 过滤出所有失败的历史记录
    const failedHistory = this.executionHistory.filter(
      (item) => item.status === NodeStatus.FAILED,
    );

    if (failedHistory.length === 0) {
      return undefined;
    }

    // 找到最新的失败记录
    return failedHistory.reduce((latest, current) =>
      current.timestamp.getTime() > latest.timestamp.getTime()
        ? current
        : latest,
    );
  }

  /**
   * 清理引擎资源
   * 释放所有占用的资源，重置状态，移除所有事件监听器
   */
  public dispose(): void {
    try {
      // 清理事件监听器
      this.eventListeners.clear();

      // 清理缓存
      this.nodeCache.clear();
      this.edgeCache.clear();

      // 重置执行状态
      this.executionHistory = [];
      this.currentHistoryItem = null;
      this.hasFailed = false;

      // 重置流程和节点数据
      this.flow = null;
      this.nodes = {};

      // 注意：不清理管理器实例，因为它们可能被其他地方引用
    } catch (error) {
      console.error('清理PluginExecutionEngine资源时出错:', error);
    }
  }
}

export default PluginExecutionEngine;

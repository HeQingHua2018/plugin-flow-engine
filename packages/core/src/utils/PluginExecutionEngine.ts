/*
 * @File: PluginExecutionEngine.ts
 * @desc: 插件化流程执行引擎核心类，负责协调各节点插件的执行和流程控制
 * @author: heqinghua
 * @date: 2025 年 09 月 24 日
 */


import {
  getGlobalComponentManager,
  ComponentManager,
  ContextManager,
  FlowExecutionError,
  errorHandler,
  registerAllOperators,
  ReadWriteLock,
  OperationSequence,
} from '@chloehe/logic-engine-common';

import { Engine, type Event } from 'json-rules-engine';
import { EdgeType, NodeStatus } from '../constants';
import type {
  Edge,
  ExecutionContext,
  ExecutionHistory,
  FlowData,
  Node,
} from '../types';
import { flowMonitor } from './FlowMonitor';
import { flowValidator } from './FlowValidator';
import { PluginManager, getGlobalPluginManager } from './PluginManager';
import { RuleEnginePool, globalRuleEnginePool } from './RuleEnginePool';
import { EnhancedRuleEngineCache, globalEnhancedRuleEngineCache } from './EnhancedRuleEngineCache';
import { NodePlugin } from '../plugins/NodePlugin';

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

  private contextManager: ContextManager;
  private componentManager: ComponentManager;
  private pluginManager: PluginManager;

  // 性能优化：规则引擎池和增强缓存
  private ruleEnginePool: RuleEnginePool;
  private enhancedRuleEngineCache: EnhancedRuleEngineCache;

  // 并发控制
  private variablesLock: ReadWriteLock;
  private operationSequence: OperationSequence;
  private threadId: string;
  private executionDepth: number = 0;
  private resourceLocks: Map<string, ReadWriteLock> = new Map();

  /**
   * 构造函数
   * 初始化执行引擎及其依赖的各管理器实例
   * @param options 可选配置
   * @param options.pluginManager 自定义插件管理器（默认创建新实例）
   */
  constructor(options?: { pluginManager?: PluginManager }) {
    // 初始化并发控制组件
    this.variablesLock = new ReadWriteLock({ maxWaitTime: 5000, reentrant: true });
    this.operationSequence = new OperationSequence();
    this.threadId = `engine_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 初始化管理器实例
    this.contextManager = new ContextManager();
    this.componentManager = getGlobalComponentManager();
    this.pluginManager = options?.pluginManager ?? getGlobalPluginManager();

    // 初始化性能优化组件
    this.ruleEnginePool = globalRuleEnginePool;
    this.enhancedRuleEngineCache = globalEnhancedRuleEngineCache;
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
   * @returns 当前的执行上下文对象或 null
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
   * 获取组件管理器实例
   */
  public getComponentManager(): ComponentManager {
    return this.componentManager;
  }

  /**
   * 注册业务组件实例到引擎的 ComponentManager
   * 供引擎执行节点事件时调用
   * @param components 组件配置数组，每项含 name 和 ref
   */
  public registerComponents(components: Array<{ name: string; ref: { current: any } }>): void {
    for (const comp of components) {
      if (comp.ref?.current) {
        this.componentManager.registerInstance(comp.name, comp.ref);
      }
    }
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
   * @param nodeId 节点 ID（可选）
   * @returns 单个节点对象、所有节点数组或 undefined
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
   * @param nodeId 节点 ID
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
   * @param nodeId 节点 ID
   * @returns 入边数组
   */
  public getIncomingEdges(nodeId: string): Edge[] {
    return this.getEdges(nodeId, EdgeType.INCOMING);
  }

  /**
   * 获取指定节点的所有出边
   * @param nodeId 节点 ID
   * @returns 出边数组
   */
  public getOutgoingEdges(nodeId: string): Edge[] {
    return this.getEdges(nodeId, EdgeType.OUTGOING);
  }

  /**
  /**
   * 获取插件管理器实例
   * @returns 插件管理器实例
   */
  public getPluginManager(): PluginManager {
    return this.pluginManager;
  }
  /**
   * 注册插件到引擎的插件管理器
   * @param plugin 要注册的插件实例
   * @param force 是否强制注册（默认 false）
   * @param silent 是否静默注册（默认 false）
   */
  public registerPlugin(plugin: NodePlugin, force: boolean = false, silent: boolean = false): void {
    this.pluginManager.registerPlugin(plugin, force, silent);
  }
  

  /**
   * 获取规则引擎池实例
   * @returns 规则引擎池实例
   */
  public getRuleEnginePool(): RuleEnginePool {
    return this.ruleEnginePool;
  }

  /**
   * 获取增强规则引擎缓存实例
   * @returns 增强规则引擎缓存实例
   */
  public getEnhancedRuleEngineCache(): EnhancedRuleEngineCache {
    return this.enhancedRuleEngineCache;
  }

  /**
   * 获取性能优化统计信息
   * @returns 性能统计信息
   */
  public getPerformanceStats() {
    return {
      ruleEnginePool: this.ruleEnginePool.getStats(),
      enhancedCache: this.enhancedRuleEngineCache.getStats(),
      nodeCacheSize: this.nodeCache.size,
      edgeCacheSize: this.edgeCache.size,
    };
  }

  /**
   * 重置性能优化统计信息
   */
  public resetPerformanceStats(): void {
    this.ruleEnginePool.resetStats();
    this.enhancedRuleEngineCache.resetStats();
  }

  /**
   * 获取规则引擎实例
   * @returns 规则引擎实例
   */
  private createEngine(): Engine {
    const engine = new Engine();
    try {
      registerAllOperators(engine);
    } catch (error) {
      const errinfo = error instanceof Error ? error.message : String(error);
      throw errorHandler.handleError('注册操作符失败：' + errinfo);
    }
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
   * @param nodeId 节点 ID（可选，用于错误上下文）
   * @returns boolean
   */
  async evaluateRule(conditions?: any, nodeId?: string): Promise<boolean> {
    if (!conditions) {
      return true;
    }

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

      // 尝试从增强缓存获取
      const cachedData = await this.enhancedRuleEngineCache.get(conditions, safeVariables);
      
      if (cachedData) {
        // 使用缓存的评估结果
        console.log(`[PluginExecutionEngine] 使用缓存的规则评估结果:`, cachedData.result);
        return cachedData.result;
      }

      // 缓存未命中，从规则引擎池获取引擎实例
      const engine = this.ruleEnginePool.acquire();
      console.log(`[PluginExecutionEngine] 从池中获取引擎实例`);
      
      try {
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

        // 将结果存入缓存
        await this.enhancedRuleEngineCache.set(conditions, safeVariables, {
          result: isMatch,
          facts: safeVariables,
          conditions,
          createdAt: Date.now(),
        });

        return isMatch;
      } finally {
        // 归还引擎实例到池中
        this.ruleEnginePool.release(engine);
      }
    } catch (error) {
      console.error(`[PluginExecutionEngine] 规则 ${nodeId} 评估异常:`, error);
      const flowError = FlowExecutionError.ruleEvaluationFailed(
        nodeId || 'unknown',
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error : undefined,
      );
      if (this.currentHistoryItem) {
        this.currentHistoryItem.engineResult = flowError.message;
        this.currentHistoryItem.status = NodeStatus.FAILED;
        this.currentHistoryItem.endTime = new Date();
      }
      this.hasFailed = true;
      throw errorHandler.handleError(flowError);
    }
  }

  /**
   * 调用事件的方法
   * @param event 事件配置
   * @param nodeId 节点 ID（可选，用于错误上下文）
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
        this.currentHistoryItem.status = NodeStatus.FAILED;
        this.currentHistoryItem.endTime = new Date();
      }

      this.hasFailed = true;
      throw errorHandler.handleError(flowError);
    }
  }

  /**
   * 从 flowData 中构建默认上下文变量，并与传入变量合并
   * @param flow 流程定义
   * @param context 执行上下文
   */
  private buildInitialVariables(
    flow: FlowData,
    context: ExecutionContext = { variables: {} },
  ): Record<string, any> {
    const defaultVariables = flow.context?.variables
      ? Object.keys(flow.context.variables).reduce((acc, key) => {
          const variableDef = flow.context.variables[key];
          acc[key] = variableDef?.default ?? null;
          return acc;
        }, {} as Record<string, any>)
      : {};

    return {
      ...defaultVariables,
      ...context.variables,
    };
  }

  /**
   * 初始化引擎
   * @param flow 流程定义
   * @param context 执行上下文
   */
  initialize(flow: FlowData, context: ExecutionContext = { variables: {} }) {
    const normalizedFlow: FlowData = {
      ...flow,
      nodes: (flow.nodes || []).map((node) => {
        const data = { ...(node as any).data };
        const label = data?.label ?? data?.pluginNodeType ?? node.id;
        return { ...node, data: { ...data, label } } as any;
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
    const mergedContext: ExecutionContext = {
      variables: this.buildInitialVariables(normalizedFlow, context),
      metadata: context.metadata,
    };
    this.contextManager.initialize(mergedContext);
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
   * 获取下一个节点 ID
   * @param nodeId 节点 ID
   * @param historyItem 执行历史记录项（可选）
   * @returns 下一个节点 ID 或 null 或 ID 数组
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

    // 调用插件的 getNextNodeId 方法获取下一个节点 ID，传递 historyItem 参数
    const plugin = this.pluginManager.getPlugin(node.data?.pluginNodeType);
    if (plugin) {
      return await plugin.getNextNodeId(outgoingEdges, this, historyItem);
    }

    return null;
  }

  /**
   * 获取节点状态
   * @param nodeId 节点 ID
   * @returns 节点状态或 null
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
  async executeFlow(nodeId?: string): Promise<{
    status: boolean;
    message: string;
    variables?: Record<string, any>;
    errorInfo?: any;
    executionReport?: any;
  }> {
    if (!this.flow) {
      return {
        status: false,
        message: '引擎未初始化，请先调用 initialize 方法',
      };
    }

    // 开始监控
    flowMonitor.startMonitoring(this.flow.flow.id);

    // 执行前先清空历史记录
    this.executionHistory = [];
    // 重置失败标志
    this.hasFailed = false;
    try {
      // 预验证规则引擎是否能正常创建，避免在节点执行过程中才发现引擎创建失败
      // 这样可以在节点执行开始时捕获引擎初始化问题，不会产生节点历史记录
      try {
        this.createEngine();
      } catch (engineError) {
        this.hasFailed = true;
        throw errorHandler.handleError(engineError);
      }

      // 自动检测起始节点：从 nodes 中查找 pluginNodeType === 'Trigger' 的节点
      const startNode = this.flow.nodes.find(
        (n: any) => n.data?.pluginNodeType === 'Trigger'
      );
      const resolvedNodeId = nodeId || startNode?.id;
      if (!resolvedNodeId) {
        throw new Error('未找到起始节点（pluginNodeType === Trigger）');
      }

      // 引擎初始化验证通过，开始执行节点
      await this.executeNode(resolvedNodeId);

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
   * @param nodeId 节点 ID
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

    // 获取操作序列号，保证顺序一致性
    const operationSeq = this.operationSequence.next();

    try {
      // 增加执行深度
      this.incrementExecutionDepth();

      // -------start---方式 2---
      // 方式 2: 更新现有历史记录，避免创建重复记录
      // 使用写锁保护历史记录的读取和写入
      let historyItem: ExecutionHistory;
      this.getContextLock().acquireWrite();
      try {
        historyItem = this.executionHistory.find(
          (item) => item.nodeId === node.id,
        ) as ExecutionHistory;

        // 如果不存在历史记录，则创建新的
        if (!historyItem) {
          historyItem = {
            nodeId: node.id,
            nodeName: node.data?.label ?? node.id,
            nodeType: node?.type ?? '',
            pluginNodeType: node.data?.pluginNodeType,
            status: NodeStatus.RUNNING,
            startTime: new Date(),
            timestamp: new Date(),
            contextBefore: { ...this.contextManager.getVariables() },
            conditions: node.data?.config?.conditions,
            eventResult: undefined,
            engineResult: undefined,
          };
          // 只有当有 event 配置时才记录 event
          if (node.data?.config?.event) {
            historyItem.event = node.data.config.event;
          }
          // 将新创建的历史记录推入数组
          this.executionHistory.push(historyItem);
        } else {
          // 更新已存在的历史记录
          historyItem.status = NodeStatus.RUNNING;
          historyItem.timestamp = new Date();
          historyItem.contextBefore = { ...this.contextManager.getVariables() };
        }
      } finally {
        this.getContextLock().releaseWrite();
      }
      // -------end---方式 2---

      this.currentHistoryItem = historyItem;

      // 调用插件的 execute 方法执行节点逻辑
      console.log(`[PluginExecutionEngine.executeNode] 开始执行 plugin.executeNode for node: ${node.id}`);
      const executeResult = await plugin.executeNode(node, this, historyItem);
      console.log(`[PluginExecutionEngine.executeNode] plugin.executeNode 返回:`, executeResult);

      // 记录节点执行结果
      if (executeResult) {
        // 如果插件未主动设置事件结果，则设置默认成功消息
        if (node.data?.config?.event && !historyItem.eventResult) {
          historyItem.eventResult = `[${node.data.config.event.type}] 事件调用成功`;
        }
        // 如果插件未主动设置结果，则设置默认成功消息
        if (!historyItem.engineResult) {
          historyItem.engineResult = '节点执行成功';
        }
        // 如果插件未主动设置状态，则根据返回值设置
        if (historyItem.status === NodeStatus.RUNNING) {
          historyItem.status = NodeStatus.SUCCESS;
          historyItem.endTime = new Date();
        }
      } else {
        // 如果插件未主动设置结果，则设置默认失败消息
        if (!historyItem.engineResult) {
          historyItem.engineResult = '节点执行失败';
        }
        // 如果插件未主动设置状态，则根据返回值设置
        if (historyItem.status === NodeStatus.RUNNING) {
          historyItem.status = NodeStatus.FAILED;
          historyItem.endTime = new Date();
        }
      }
      // 记录执行后上下文（执行引擎统一管理，避免插件遗漏）
      if (!historyItem.contextAfter) {
        historyItem.contextAfter = { ...this.contextManager.getVariables() };
      }
      console.log(`[PluginExecutionEngine.executeNode] 记录执行结果完成`);

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

      // -------start---方式 1---
      // 添加新的历史记录项（对应方式 1）
      // 在方式 1 中，每次执行都会创建新记录，并且按执行顺序 push，因此不需要额外排序
      // this.executionHistory.push(historyItem);
      // -------end---方式 1---

      // -------start---方式 2---
      // 如果是新创建的历史记录，则添加到历史记录中（对应方式 2）
      // 使用写锁保护历史记录的写入
      this.getContextLock().acquireWrite();
      try {
        if (!this.executionHistory.includes(historyItem)) {
          this.executionHistory.push(historyItem);
        }
        // 按时间戳对历史记录进行排序，确保执行顺序正确（方式 2 需要）
        this.executionHistory.sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return timeA - timeB;
        });
      } finally {
        this.getContextLock().releaseWrite();
      }
      // -------end---方式 2---

      // 触发历史记录更新事件
      this.emit('history_updated', this.getExecutionHistory());
      this.emit('node_executed', historyItem);

      // 调用插件的完成回调
      console.log(`[PluginExecutionEngine] 调用 onNodeComplete for node: ${node.id}, result:`, executeResult);
      try {
        await plugin.onNodeComplete(node, this, historyItem, executeResult);
        console.log(`[PluginExecutionEngine] onNodeComplete completed for node: ${node.id}`);
      } catch (onCompleteError) {
        console.error(`[PluginExecutionEngine] onNodeComplete 执行失败:`, onCompleteError);
        throw onCompleteError;
      }

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
      // 减少执行深度
      this.decrementExecutionDepth();
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
   * 考虑并行节点的执行策略，对于 ANY 策略的并行节点，即使部分分支失败，只要有一个分支成功，就不视为失败
   * @returns 是否有失败的节点
   */
  private checkForFailedNodes(): boolean {
    // 创建并行节点映射，记录每个并行节点的分支状态
    const parallelNodeStatus = new Map<
      string,
      { success: boolean; branches: Set<string> }
    >();

    // 首先标记所有并行节点的分支关系
    for (const historyItem of this.executionHistory) {
      if (
        historyItem.parallel_edges &&
        Array.isArray(historyItem.parallel_edges)
      ) {
        const branchIds = new Set<string>();
        for (const edge of historyItem.parallel_edges) {
          if (edge.target) {
            branchIds.add(edge.target);
          }
        }

        parallelNodeStatus.set(historyItem.nodeId, {
          success: false, // 初始设为 false，后续更新
          branches: branchIds,
        });
      }
    }

    // 检查每个并行节点的策略和分支状态
    const nodes = this.getNodes();
    for (const [parallelNodeId, statusInfo] of parallelNodeStatus) {
      const nodeData = nodes.find((n) => n.id === parallelNodeId);
      if (nodeData) {
        const parallelStrategy = nodeData.data?.config?.parallel_strategy;

        // 计算成功的分支数量
        let successCount = 0;

        for (const branchId of statusInfo.branches) {
          const branchHistory = this.executionHistory
            .filter((item) => item.nodeId === branchId)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

          if (
            branchHistory.length > 0 &&
            branchHistory[0].status === NodeStatus.SUCCESS
          ) {
            successCount++;
          }
        }

        // 根据策略判断并行节点是否成功
        if (parallelStrategy === 'ANY' || parallelStrategy === 'any') {
          // ANY 策略：至少一个成功就算成功
          statusInfo.success = successCount > 0;
        } else {
          // 默认 ALL 策略：所有分支都成功才算成功
          statusInfo.success = successCount === statusInfo.branches.size;
        }
      }
    }

    // 再次检查所有节点，跳过已被标记为成功的并行节点分支
    for (const historyItem of this.executionHistory) {
      // 检查是否为并行节点的分支
      let isParallelBranchAndGroupSuccess = false;

      for (const [, statusInfo] of parallelNodeStatus) {
        if (statusInfo.success && statusInfo.branches.has(historyItem.nodeId)) {
          isParallelBranchAndGroupSuccess = true;
          break;
        }
      }

      // 如果不是成功并行组的分支，且状态为失败，则整个流程失败
      if (
        !isParallelBranchAndGroupSuccess &&
        historyItem.status === NodeStatus.FAILED
      ) {
        return true;
      }
    }

    // 没有找到有效的失败节点
    return false;
  }

  /**
   * 查找最新失败的节点信息
   * @returns 最新失败节点的执行历史记录或 undefined
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

  // ==================== 调试相关方法 ====================

  /**
   * 启动调试
   * @param config 调试配置（断点列表、单步模式等）
   */
  public startDebug(config?: { breakpoints?: string[]; stepByStep?: boolean }): void {
    console.log('[PluginExecutionEngine] 启动调试模式', config);
  }

  /**
   * 暂停调试
   */
  public async pauseDebug(): Promise<void> {
    console.log('[PluginExecutionEngine] 暂停调试');
  }

  /**
   * 恢复调试
   */
  public resumeDebug(): void {
    console.log('[PluginExecutionEngine] 恢复调试');
  }

  /**
   * 停止调试
   */
  public stopDebug(): void {
    console.log('[PluginExecutionEngine] 停止调试');
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

      // 清理资源锁
      this.disposeResourceLocks();

      // 注意：不清理管理器实例，因为它们可能被其他地方引用
    } catch (error) {
      console.error('清理 PluginExecutionEngine 资源时出错:', error);
    }
  }

  // ==================== 并发控制相关方法 ====================

  /**
   * 获取或创建资源的读写锁
   * @param resourceId 资源 ID
   * @returns 读写锁实例
   */
  private getResourceLock(resourceId: string): ReadWriteLock {
    if (!this.resourceLocks.has(resourceId)) {
      this.resourceLocks.set(
        resourceId,
        new ReadWriteLock({ maxWaitTime: 5000, reentrant: true }),
      );
    }
    return this.resourceLocks.get(resourceId)!;
  }

  /**
   * 获取上下文变量的读写锁
   * @returns 读写锁实例
   */
  public getContextLock(): ReadWriteLock {
    return this.variablesLock;
  }

  /**
   * 获取操作序列号
   * @returns 操作序列号
   */
  public getNextSequence(): number {
    return this.operationSequence.next();
  }

  /**
   * 获取当前线程 ID
   * @returns 线程 ID
   */
  public getThreadId(): string {
    return this.threadId;
  }

  /**
   * 增加执行深度
   */
  public incrementExecutionDepth(): void {
    this.executionDepth++;
  }

  /**
   * 减少执行深度
   */
  public decrementExecutionDepth(): void {
    this.executionDepth--;
  }

  /**
   * 获取当前执行深度
   * @returns 执行深度
   */
  public getExecutionDepth(): number {
    return this.executionDepth;
  }

  /**
   * 获取并发控制统计信息
   * @returns 统计信息对象
   */
  public getConcurrencyStats(): {
    threadId: string;
    executionDepth: number;
    variablesLock: {
      status: string;
      readers: number;
      writers: number;
      waitingWriters: number;
      queueLength: number;
    };
    operationSequence: {
      current: number;
      lockedResources: number;
      waitingResources: number;
    };
    resourceLocks: number;
  } {
    return {
      threadId: this.threadId,
      executionDepth: this.executionDepth,
      variablesLock: this.variablesLock.getStats(),
      operationSequence: this.operationSequence.getStats(),
      resourceLocks: this.resourceLocks.size,
    };
  }

  /**
   * 启用并发调试（占位方法，用于未来扩展）
   * @param enabled 是否启用
   */
  public enableConcurrencyDebug(enabled: boolean): void {
    if (enabled) {
      console.log('[PluginExecutionEngine] 并发调试已启用');
    } else {
      console.log('[PluginExecutionEngine] 并发调试已禁用');
    }
  }

  /**
   * 获取并发调试日志
   * @returns 调试日志数组
   */
  public getConcurrencyLogs(): Array<{
    timestamp: number;
    threadId: string;
    action: string;
    resourceId?: string;
    sequence?: number;
    details?: any;
  }> {
    // 返回当前引擎的并发状态日志
    return [
      {
        timestamp: Date.now(),
        threadId: this.threadId,
        action: 'stats',
        details: this.getConcurrencyStats(),
      },
    ];
  }

  /**
   * 清空并发调试日志
   */
  public clearConcurrencyLogs(): void {
    console.log('[PluginExecutionEngine] 并发调试日志已清空');
  }

  /**
   * 生成并发调试报告
   * @returns 调试报告字符串
   */
  public generateConcurrencyReport(): string {
    return (
      '=== 引擎并发状态 ===\n' +
      `线程 ID: ${this.threadId}\n` +
      `执行深度：${this.executionDepth}\n` +
      `变量锁状态：${this.variablesLock.getStatus()}\n` +
      `操作序列号：${this.operationSequence.getCurrent()}\n` +
      `资源锁数量：${this.resourceLocks.size}\n`
    );
  }

  /**
   * 清理资源锁
   * 在引擎销毁时调用
   */
  private disposeResourceLocks(): void {
    this.resourceLocks.clear();
  }
}

export default PluginExecutionEngine;

/*
 * @File: FlowReplay.ts
 * @desc: 流程重放机制，支持选择性重放、异常注入、配置持久化和预览
 * @author: heqinghua
 * @date: 2026 年 04 月 10 日
 */

import type { PluginExecutionEngine } from './PluginExecutionEngine';
import type { ExecutionHistory, ExecutionContext, FlowData } from '../types';

/**
 * 重放模式
 */
export type ReplayMode = 'full' | 'incremental' | 'selective';

/**
 * 节点过滤策略
 */
export type NodeFilterStrategy = 'skip' | 'forceSkip' | 'forceExecute';

/**
 * 节点过滤配置
 */
export interface NodeFilter {
  /**
   * 节点 ID 列表
   */
  nodeIds: string[];

  /**
   * 过滤策略
   */
  strategy: NodeFilterStrategy;

  /**
   * 是否启用
   */
  enabled: boolean;

  /**
   * 描述
   */
  description?: string;
}

/**
 * 异常注入配置
 */
export interface ExceptionInjection {
  /**
   * 节点 ID 列表
   */
  nodeIds: string[];

  /**
   * 异常类型
   */
  type: 'error' | 'timeout' | 'custom';

  /**
   * 异常消息
   */
  message: string;

  /**
   * 异常代码
   */
  code?: string;

  /**
   * 触发概率 (0-1)
   */
  probability: number;

  /**
   * 是否启用
   */
  enabled: boolean;

  /**
   * 描述
   */
  description?: string;
}

/**
 * 重放配置
 */
export interface ReplayConfig {
  /**
   * 起始节点 ID
   */
  startNodeId?: string;

  /**
   * 是否从指定时间点开始重放
   */
  fromTimestamp?: Date;

  /**
   * 是否包含上下文变量
   */
  restoreContext?: boolean;

  /**
   * 重放模式
   */
  mode: ReplayMode;

  /**
   * 节点过滤配置
   */
  nodeFilter?: NodeFilter;

  /**
   * 异常注入配置
   */
  exceptionInjection?: ExceptionInjection;

  /**
   * 是否模拟执行（不实际执行，只预览）
   */
  dryRun?: boolean;

  /**
   * 节点执行延迟（用于模拟）
   */
  nodeDelay?: number;

  /**
   * 是否记录详细日志
   */
  verbose?: boolean;

  /**
   * 自定义配置键
   */
  customConfig?: Record<string, any>;
}

/**
 * 默认重放配置
 */
const defaultConfig: ReplayConfig = {
  mode: 'incremental',
  restoreContext: true,
  dryRun: false,
  nodeDelay: 0,
  verbose: false,
};

/**
 * 重放结果
 */
export interface ReplayResult {
  /**
   * 是否成功
   */
  success: boolean;

  /**
   * 消息
   */
  message: string;

  /**
   * 重放的节点数量
   */
  nodesReplayed: number;

  /**
   * 最终上下文
   */
  finalContext?: ExecutionContext;

  /**
   * 错误信息
   */
  error?: any;

  /**
   * 详细结果
   */
  details?: ReplayDetails;
}

/**
 * 重放详情
 */
export interface ReplayDetails {
  /**
   * 执行的节点列表
   */
  executedNodes: Array<{
    nodeId: string;
    nodeName: string;
    status: 'success' | 'failed' | 'skipped' | 'injected_error';
    duration?: number;
    errorMessage?: string;
  }>;

  /**
   * 跳过的节点列表
   */
  skippedNodes: string[];

  /**
   * 注入异常的节点列表
   */
  injectedExceptions: Array<{
    nodeId: string;
    nodeName: string;
    type: string;
    message: string;
  }>;

  /**
   * 上下文变化
   */
  contextChanges: Array<{
    nodeId: string;
    variableName: string;
    oldValue?: any;
    newValue?: any;
  }>;
}

/**
 * 重放预览结果
 */
export interface ReplayPreview {
  /**
   * 预览是否有效
   */
  valid: boolean;

  /**
   * 预览消息
   */
  message: string;

  /**
   * 将要执行的节点
   */
  nodesToExecute: Array<{
    nodeId: string;
    nodeName: string;
    willSkip: boolean;
    skipReason?: string;
    willInjectException: boolean;
    exceptionType?: string;
    exceptionMessage?: string;
  }>;

  /**
   * 统计信息
   */
  stats: {
    totalNodes: number;
    nodesToExecute: number;
    nodesToSkip: number;
    nodesWithExceptionInjection: number;
  };

  /**
   * 配置验证错误
   */
  validationErrors: string[];

  /**
   * 预览时间
   */
  previewedAt: Date;
}

/**
 * 重放配置持久化存储接口
 */
export interface ReplayConfigStorage {
  /**
   * 保存配置
   * @param configId 配置 ID
   * @param config 配置
   */
  save(configId: string, config: ReplayConfig): Promise<void>;

  /**
   * 获取配置
   * @param configId 配置 ID
   * @returns 配置
   */
  get(configId: string): Promise<ReplayConfig | undefined>;

  /**
   * 删除配置
   * @param configId 配置 ID
   */
  delete(configId: string): Promise<void>;

  /**
   * 获取所有配置
   * @returns 配置列表
   */
  getAll(): Promise<Array<{ id: string; config: ReplayConfig; createdAt: Date }>>;
}

/**
 * 内存配置存储
 */
export class MemoryReplayConfigStorage implements ReplayConfigStorage {
  private configs: Map<string, { config: ReplayConfig; createdAt: Date }> = new Map();

  async save(configId: string, config: ReplayConfig): Promise<void> {
    this.configs.set(configId, {
      config,
      createdAt: new Date(),
    });
  }

  async get(configId: string): Promise<ReplayConfig | undefined> {
    const entry = this.configs.get(configId);
    return entry?.config;
  }

  async delete(configId: string): Promise<void> {
    this.configs.delete(configId);
  }

  async getAll(): Promise<Array<{ id: string; config: ReplayConfig; createdAt: Date }>> {
    return Array.from(this.configs.entries()).map(([id, entry]) => ({
      id,
      config: entry.config,
      createdAt: entry.createdAt,
    }));
  }
}

/**
 * 流程重放器
 * 基于执行历史记录重放流程执行，支持选择性重放、异常注入和配置持久化
 */
export class FlowReplayer {
  private engine: PluginExecutionEngine | null = null;
  private flowData: FlowData | null = null;
  private configStorage: ReplayConfigStorage | null = null;

  /**
   * 设置引擎实例
   * @param engine 流程执行引擎
   */
  setEngine(engine: PluginExecutionEngine): void {
    this.engine = engine;
  }

  /**
   * 设置流程数据
   * @param flowData 流程数据
   */
  setFlowData(flowData: FlowData): void {
    this.flowData = flowData;
  }

  /**
   * 设置配置存储
   * @param storage 配置存储
   */
  setConfigStorage(storage: ReplayConfigStorage): void {
    this.configStorage = storage;
  }

  /**
   * 获取配置存储
   */
  getConfigStorage(): ReplayConfigStorage | null {
    return this.configStorage;
  }

  /**
   * 保存重放配置
   * @param configId 配置 ID
   * @param config 配置
   */
  async saveConfig(configId: string, config: ReplayConfig): Promise<void> {
    if (!this.configStorage) {
      throw new Error('配置存储未初始化');
    }
    await this.configStorage.save(configId, config);
  }

  /**
   * 加载重放配置
   * @param configId 配置 ID
   * @returns 配置
   */
  async loadConfig(configId: string): Promise<ReplayConfig | undefined> {
    if (!this.configStorage) {
      throw new Error('配置存储未初始化');
    }
    return this.configStorage.get(configId);
  }

  /**
   * 删除重放配置
   * @param configId 配置 ID
   */
  async deleteConfig(configId: string): Promise<void> {
    if (!this.configStorage) {
      throw new Error('配置存储未初始化');
    }
    await this.configStorage.delete(configId);
  }

  /**
   * 获取所有重放配置
   */
  async getAllConfigs(): Promise<Array<{ id: string; config: ReplayConfig; createdAt: Date }>> {
    if (!this.configStorage) {
      throw new Error('配置存储未初始化');
    }
    return this.configStorage.getAll();
  }

  /**
   * 执行重放
   * @param history 执行历史记录
   * @param config 重放配置
   * @returns 重放结果
   */
  async replay(
    history: ExecutionHistory[],
    config: ReplayConfig = { mode: 'incremental' }
  ): Promise<ReplayResult> {
    const mergedConfig = { ...defaultConfig, ...config };

    if (!this.engine) {
      return {
        success: false,
        message: '引擎未初始化',
        nodesReplayed: 0,
      };
    }

    if (!this.flowData) {
      return {
        success: false,
        message: '流程数据未初始化',
        nodesReplayed: 0,
      };
    }

    // 过滤需要重放的记录
    const replayHistory = this.filterReplayHistory(history, mergedConfig);

    if (replayHistory.length === 0) {
      return {
        success: true,
        message: '没有需要重放的历史记录',
        nodesReplayed: 0,
      };
    }

    // 预览模式
    if (mergedConfig.dryRun) {
      const preview = this.previewReplay(replayHistory, mergedConfig);
      return {
        success: preview.valid,
        message: preview.message,
        nodesReplayed: preview.stats.nodesToExecute,
        details: {
          executedNodes: preview.nodesToExecute
            .filter(n => !n.willSkip)
            .map(n => ({
              nodeId: n.nodeId,
              nodeName: n.nodeName,
              status: n.willInjectException ? 'injected_error' : 'success',
              errorMessage: n.willInjectException ? n.exceptionMessage : undefined,
            })),
          skippedNodes: preview.nodesToExecute
            .filter(n => n.willSkip)
            .map(n => n.nodeId),
          injectedExceptions: preview.nodesToExecute
            .filter(n => n.willInjectException)
            .map(n => ({
              nodeId: n.nodeId,
              nodeName: n.nodeName,
              type: n.exceptionType || 'error',
              message: n.exceptionMessage || '',
            })),
          contextChanges: [],
        },
      };
    }

    try {
      // 恢复上下文（如果需要）
      if (mergedConfig.restoreContext && replayHistory.length > 0) {
        const lastHistory = replayHistory[replayHistory.length - 1];
        if (lastHistory.contextAfter) {
          this.engine.updateContext({
            variables: lastHistory.contextAfter,
          });
        }
      }

      // 从指定节点开始重放
      const startNodeId =
        mergedConfig.startNodeId || replayHistory[0]?.nodeId;

      if (!startNodeId) {
        return {
          success: false,
          message: '无法确定重放起始节点',
          nodesReplayed: 0,
        };
      }

      const details: ReplayDetails = {
        executedNodes: [],
        skippedNodes: [],
        injectedExceptions: [],
        contextChanges: [],
      };

      // 执行重放
      for (const record of replayHistory) {
        const nodeResult = await this.executeReplayNode(
          record,
          mergedConfig,
          details
        );

        details.executedNodes.push(nodeResult);
      }

      return {
        success: true,
        message: '重放完成',
        nodesReplayed: replayHistory.length,
        finalContext: this.engine.getContext() || undefined,
        details,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : String(error),
        nodesReplayed: 0,
        error,
      };
    }
  }

  /**
   * 执行单个重放节点
   */
  private async executeReplayNode(
    record: ExecutionHistory,
    config: ReplayConfig,
    details: ReplayDetails
  ): Promise<{
    nodeId: string;
    nodeName: string;
    status: 'success' | 'failed' | 'skipped' | 'injected_error';
    duration?: number;
    errorMessage?: string;
  }> {
    const nodeId = record.nodeId;
    const nodeName = record.nodeName || nodeId;

    // 检查节点过滤
    if (config.nodeFilter?.enabled) {
      const filter = config.nodeFilter;
      const shouldProcess = this.shouldProcessNode(nodeId, filter);

      if (shouldProcess === 'skip') {
        details.skippedNodes.push(nodeId);
        return {
          nodeId,
          nodeName,
          status: 'skipped',
        };
      }
    }

    // 检查异常注入
    if (config.exceptionInjection?.enabled) {
      const injection = config.exceptionInjection;
      const shouldInject = injection.nodeIds.includes(nodeId);

      if (shouldInject) {
        // 检查触发概率
        const shouldTrigger = Math.random() < injection.probability;

        if (shouldTrigger) {
          details.injectedExceptions.push({
            nodeId,
            nodeName,
            type: injection.type,
            message: injection.message,
          });

          return {
            nodeId,
            nodeName,
            status: 'injected_error',
            errorMessage: injection.message,
          };
        }
      }
    }

    // 模拟延迟
    if (config.nodeDelay && config.nodeDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, config.nodeDelay));
    }

    // 实际执行（如果引擎可用）
    if (this.engine) {
      const startTime = Date.now();
      try {
        await this.engine.executeFlow(nodeId);
        return {
          nodeId,
          nodeName,
          status: 'success',
          duration: Date.now() - startTime,
        };
      } catch (error) {
        return {
          nodeId,
          nodeName,
          status: 'failed',
          duration: Date.now() - startTime,
          errorMessage: error instanceof Error ? error.message : String(error),
        };
      }
    }

    return {
      nodeId,
      nodeName,
      status: 'success',
    };
  }

  /**
   * 检查节点是否应该处理
   */
  private shouldProcessNode(nodeId: string, filter: NodeFilter): 'process' | 'skip' {
    const shouldSkip = filter.nodeIds.includes(nodeId);

    if (!shouldSkip) {
      return 'process';
    }

    switch (filter.strategy) {
      case 'skip':
      case 'forceSkip':
        return 'skip';
      case 'forceExecute':
        return 'process';
      default:
        return 'skip';
    }
  }

  /**
   * 过滤重放历史
   * @param history 执行历史
   * @param config 重放配置
   * @returns 过滤后的历史
   */
  private filterReplayHistory(
    history: ExecutionHistory[],
    config: ReplayConfig
  ): ExecutionHistory[] {
    let filtered = [...history];

    // 按时间排序
    filtered.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    // 从指定时间点开始
    if (config.fromTimestamp) {
      filtered = filtered.filter(
        (h) => h.timestamp.getTime() >= config.fromTimestamp!.getTime()
      );
    }

    // 节点过滤
    if (config.nodeFilter?.enabled && config.nodeFilter.strategy === 'skip') {
      filtered = filtered.filter(
        (h) => !config.nodeFilter!.nodeIds.includes(h.nodeId)
      );
    }

    return filtered;
  }

  /**
   * 重放预览
   * @param history 执行历史
   * @param config 重放配置
   * @returns 预览结果
   */
  previewReplay(
    history: ExecutionHistory[],
    config: ReplayConfig = { mode: 'incremental' }
  ): ReplayPreview {
    const mergedConfig = { ...defaultConfig, ...config };
    const validationErrors: string[] = [];

    // 验证配置
    if (mergedConfig.mode === 'selective' && !mergedConfig.nodeFilter?.enabled) {
      validationErrors.push('选择性重放模式需要启用节点过滤');
    }

    if (mergedConfig.exceptionInjection?.enabled) {
      const injection = mergedConfig.exceptionInjection;
      if (injection.probability < 0 || injection.probability > 1) {
        validationErrors.push('异常注入概率必须在 0-1 之间');
      }
      if (injection.nodeIds.length === 0) {
        validationErrors.push('异常注入需要指定节点 ID 列表');
      }
    }

    // 构建预览节点列表
    const nodesToExecute: ReplayPreview['nodesToExecute'] = history.map(h => {
      const willSkip = mergedConfig.nodeFilter?.enabled
        ? this.shouldProcessNode(h.nodeId, mergedConfig.nodeFilter!) === 'skip'
        : false;

      const willInjectException = mergedConfig.exceptionInjection?.enabled
        ? mergedConfig.exceptionInjection!.nodeIds.includes(h.nodeId)
        : false;

      return {
        nodeId: h.nodeId,
        nodeName: h.nodeName || h.nodeId,
        willSkip,
        skipReason: willSkip ? '节点过滤' : undefined,
        willInjectException,
        exceptionType: willInjectException ? mergedConfig.exceptionInjection!.type : undefined,
        exceptionMessage: willInjectException ? mergedConfig.exceptionInjection!.message : undefined,
      };
    });

    const stats = {
      totalNodes: history.length,
      nodesToExecute: nodesToExecute.filter(n => !n.willSkip).length,
      nodesToSkip: nodesToExecute.filter(n => n.willSkip).length,
      nodesWithExceptionInjection: nodesToExecute.filter(n => n.willInjectException).length,
    };

    return {
      valid: validationErrors.length === 0,
      message: validationErrors.length === 0
        ? `预览有效，将执行 ${stats.nodesToExecute} 个节点`
        : `预览存在错误：${validationErrors.join('; ')}`,
      nodesToExecute,
      stats,
      validationErrors,
      previewedAt: new Date(),
    };
  }

  /**
   * 分析执行历史
   * @param history 执行历史
   * @returns 分析结果
   */
  analyzeHistory(history: ExecutionHistory[]): {
    totalNodes: number;
    successNodes: number;
    failedNodes: number;
    totalTime: number;
    avgNodeTime: number;
    contextChanges: Array<{
      nodeId: string;
      before: Record<string, any>;
      after: Record<string, any>;
    }>;
  } {
    const totalNodes = history.length;
    const successNodes = history.filter(
      (h) => h.status === 'success'
    ).length;
    const failedNodes = history.filter(
      (h) => h.status === 'failed'
    ).length;

    const totalTime = history.reduce((sum, h) => {
      return sum + (h.duration || 0);
    }, 0);

    const avgNodeTime = totalNodes > 0 ? totalTime / totalNodes : 0;

    const contextChanges = history
      .filter((h) => h.contextBefore && h.contextAfter)
      .map((h) => ({
        nodeId: h.nodeId,
        before: h.contextBefore!,
        after: h.contextAfter!,
      }));

    return {
      totalNodes,
      successNodes,
      failedNodes,
      totalTime,
      avgNodeTime,
      contextChanges,
    };
  }

  /**
   * 清空重放器状态
   */
  clear(): void {
    this.engine = null;
    this.flowData = null;
  }
}

// 默认导出
export const flowReplayer = new FlowReplayer();
export const memoryReplayConfigStorage = new MemoryReplayConfigStorage();
export default flowReplayer;

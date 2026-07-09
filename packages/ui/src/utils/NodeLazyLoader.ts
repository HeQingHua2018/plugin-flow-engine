/*
 * @File: NodeLazyLoader.ts
 * @desc: 节点懒加载管理器，用于优化大型流程的节点数据加载性能
 * @author: heqinghua
 * @date: 2026 年 06 月 15 日
 */

import type { Node } from '@xyflow/react';

/**
 * 懒加载配置接口
 */
export interface LazyLoaderOptions {
  /**
   * 最大并发加载数量，默认 5
   */
  maxConcurrent?: number;
  /**
   * 加载超时时间（毫秒），默认 5000
   */
  loadTimeout?: number;
  /**
   * 是否启用加载缓存，默认 true
   */
  enableCache?: boolean;
  /**
   * 缓存有效期（毫秒），默认 10 分钟
   */
  cacheTTL?: number;
  /**
   * 是否启用统计，默认 true
   */
  enableStats?: boolean;
}

/**
 * 懒加载统计信息接口
 */
export interface LazyLoaderStats {
  /**
   * 已加载节点数
   */
  loadedCount: number;
  /**
   * 正在加载节点数
   */
  loadingCount: number;
  /**
   * 总加载次数
   */
  totalLoadCount: number;
  /**
   * 缓存命中次数
   */
  cacheHits: number;
  /**
   * 加载失败次数
   */
  loadFailures: number;
  /**
   * 平均加载时间（毫秒）
   */
  avgLoadTime: number;
}

/**
 * 默认懒加载配置
 */
const DEFAULT_LAZY_LOADER_OPTIONS: Required<LazyLoaderOptions> = {
  maxConcurrent: 5,
  loadTimeout: 5000,
  enableCache: true,
  cacheTTL: 10 * 60 * 1000, // 10 分钟
  enableStats: true,
};

/**
 * 节点懒加载管理器
 * 用于优化大型流程的节点数据加载性能，支持并发控制和缓存
 */
export class NodeLazyLoader {
  private loadingQueue: Set<string> = new Set();
  private loadedNodes: Map<string, { node: Node; timestamp: number }> = new Map();
  private loadPromises: Map<string, Promise<Node>> = new Map();
  private options: Required<LazyLoaderOptions>;
  private stats = {
    totalLoadCount: 0,
    cacheHits: 0,
    loadFailures: 0,
    totalLoadTime: 0,
  };
  private currentConcurrent: number = 0;

  constructor(options: LazyLoaderOptions = {}) {
    this.options = { ...DEFAULT_LAZY_LOADER_OPTIONS, ...options };
  }

  /**
   * 懒加载节点数据
   * @param nodeId 节点 ID
   * @param loadFn 加载函数
   * @returns Promise<Node>
   */
  async loadNode(
    nodeId: string,
    loadFn: (nodeId: string) => Promise<Node>
  ): Promise<Node> {
    // 检查缓存
    if (this.options.enableCache) {
      const cached = this.loadedNodes.get(nodeId);
      if (cached && !this.isCacheExpired(cached)) {
        this.stats.cacheHits++;
        return cached.node;
      }
    }

    // 如果正在加载，返回加载中的 Promise
    if (this.loadingQueue.has(nodeId)) {
      const loading = this.loadPromises.get(nodeId);
      if (loading) return loading;
    }

    // 等待并发控制
    await this.waitForConcurrencySlot();

    // 开始加载
    this.loadingQueue.add(nodeId);
    this.currentConcurrent++;

    const startTime = Date.now();
    const loadPromise = this.createLoadPromise(nodeId, loadFn, startTime);
    this.loadPromises.set(nodeId, loadPromise);

    try {
      const node = await loadPromise;
      return node;
    } finally {
      this.loadingQueue.delete(nodeId);
      this.currentConcurrent--;
      this.loadPromises.delete(nodeId);
    }
  }

  /**
   * 创建加载 Promise
   * @param nodeId 节点 ID
   * @param loadFn 加载函数
   * @param startTime 开始时间
   * @returns Promise<Node>
   */
  private async createLoadPromise(
    nodeId: string,
    loadFn: (nodeId: string) => Promise<Node>,
    startTime: number
  ): Promise<Node> {
    try {
      // 添加超时控制
      const node = await this.withTimeout(
        loadFn(nodeId),
        this.options.loadTimeout
      );

      // 更新统计信息
      const loadTime = Date.now() - startTime;
      this.stats.totalLoadCount++;
      this.stats.totalLoadTime += loadTime;

      // 缓存结果
      if (this.options.enableCache) {
        this.loadedNodes.set(nodeId, {
          node,
          timestamp: Date.now(),
        });
      }

      return node;
    } catch (error) {
      this.stats.loadFailures++;
      console.error(`[NodeLazyLoader] 加载节点 ${nodeId} 失败:`, error);
      throw error;
    }
  }

  /**
   * 批量预加载节点
   * @param nodeIds 节点 ID 数组
   * @param loadFn 加载函数
   * @returns Promise<void>
   */
  async preloadNodes(
    nodeIds: string[],
    loadFn: (nodeId: string) => Promise<Node>
  ): Promise<void> {
    const loadPromises = nodeIds.map(nodeId =>
      this.loadNode(nodeId, loadFn).catch(err => {
        console.warn(`[NodeLazyLoader] 预加载节点 ${nodeId} 失败:`, err);
        return null;
      })
    );

    await Promise.all(loadPromises);
  }

  /**
   * 批量加载节点（带优先级）
   * @param nodeIds 节点 ID 数组
   * @param loadFn 加载函数
   * @param priorities 优先级映射（可选）
   * @returns Promise<Node[]>
   */
  async loadNodesWithPriority(
    nodeIds: string[],
    loadFn: (nodeId: string) => Promise<Node>,
    priorities?: Map<string, number>
  ): Promise<Node[]> {
    // 按优先级排序
    const sortedIds = priorities
      ? nodeIds.sort((a, b) => (priorities.get(b) || 0) - (priorities.get(a) || 0))
      : nodeIds;

    const results: Node[] = [];
    const batchSize = this.options.maxConcurrent;

    // 分批加载
    for (let i = 0; i < sortedIds.length; i += batchSize) {
      const batch = sortedIds.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(nodeId =>
          this.loadNode(nodeId, loadFn).catch(err => {
            console.warn(`[NodeLazyLoader] 加载节点 ${nodeId} 失败:`, err);
            return null;
          })
        )
      );
      results.push(...batchResults.filter(node => node !== null) as Node[]);
    }

    return results;
  }

  /**
   * 清除已加载的节点
   * @param nodeIds 要清除的节点 ID 数组（可选）
   */
  clearLoaded(nodeIds?: string[]): void {
    if (nodeIds) {
      nodeIds.forEach(id => {
        this.loadedNodes.delete(id);
        this.loadPromises.delete(id);
        this.loadingQueue.delete(id);
      });
    } else {
      this.loadedNodes.clear();
      this.loadPromises.clear();
      this.loadingQueue.clear();
    }
  }

  /**
   * 清除过期缓存
   * @returns 清除的条目数量
   */
  clearExpiredCache(): number {
    let cleared = 0;
    const now = Date.now();

    for (const [nodeId, cached] of this.loadedNodes.entries()) {
      if (this.isCacheExpired(cached)) {
        this.loadedNodes.delete(nodeId);
        cleared++;
      }
    }

    return cleared;
  }

  /**
   * 获取加载状态
   * @returns 加载状态
   */
  getLoadStatus(): LazyLoaderStats {
    const avgLoadTime = this.stats.totalLoadCount > 0
      ? this.stats.totalLoadTime / this.stats.totalLoadCount
      : 0;

    return {
      loadedCount: this.loadedNodes.size,
      loadingCount: this.loadingQueue.size,
      totalLoadCount: this.stats.totalLoadCount,
      cacheHits: this.stats.cacheHits,
      loadFailures: this.stats.loadFailures,
      avgLoadTime,
    };
  }

  /**
   * 重置统计信息
   */
  resetStats(): void {
    this.stats = {
      totalLoadCount: 0,
      cacheHits: 0,
      loadFailures: 0,
      totalLoadTime: 0,
    };
  }

  /**
   * 判断缓存是否过期
   * @param cached 缓存数据
   * @returns 是否过期
   */
  private isCacheExpired(cached: { node: Node; timestamp: number }): boolean {
    return Date.now() - cached.timestamp > this.options.cacheTTL;
  }

  /**
   * 等待并发槽位
   */
  private async waitForConcurrencySlot(): Promise<void> {
    while (this.currentConcurrent >= this.options.maxConcurrent) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  /**
   * 添加超时控制
   * @param promise Promise
   * @param timeout 超时时间（毫秒）
   * @returns Promise
   */
  private async withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`加载超时 (${timeout}ms)`));
      }, timeout);

      promise
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  /**
   * 获取配置选项
   * @returns 配置选项
   */
  getOptions(): Required<LazyLoaderOptions> {
    return this.options;
  }

  /**
   * 调整最大并发数量
   * @param newMax 新的最大并发数量
   */
  setMaxConcurrent(newMax: number): void {
    this.options.maxConcurrent = newMax;
  }

  /**
   * 调整加载超时时间
   * @param newTimeout 新的超时时间（毫秒）
   */
  setLoadTimeout(newTimeout: number): void {
    this.options.loadTimeout = newTimeout;
  }

  /**
   * 启用/禁用缓存
   * @param enabled 是否启用
   */
  setCacheEnabled(enabled: boolean): void {
    this.options.enableCache = enabled;
    if (!enabled) {
      this.loadedNodes.clear();
    }
  }

  /**
   * 检查节点是否已加载
   * @param nodeId 节点 ID
   * @returns 是否已加载
   */
  isLoaded(nodeId: string): boolean {
    const cached = this.loadedNodes.get(nodeId);
    return cached ? !this.isCacheExpired(cached) : false;
  }

  /**
   * 检查节点是否正在加载
   * @param nodeId 节点 ID
   * @returns 是否正在加载
   */
  isLoading(nodeId: string): boolean {
    return this.loadingQueue.has(nodeId);
  }

  /**
   * 获取已加载的节点
   * @param nodeId 节点 ID
   * @returns 节点对象或 undefined
   */
  getLoadedNode(nodeId: string): Node | undefined {
    const cached = this.loadedNodes.get(nodeId);
    if (cached && !this.isCacheExpired(cached)) {
      return cached.node;
    }
    return undefined;
  }
}

export default NodeLazyLoader;
/*
 * @File: RuleEnginePool.ts
 * @desc: 规则引擎对象池，使用对象池模式复用 Engine 实例，避免重复创建
 * @author: heqinghua
 * @date: 2026 年 06 月 15 日
 */

import { Engine } from 'json-rules-engine';
import { registerAllOperators } from '@chloehe/logic-engine-common';

/**
 * 规则引擎池配置接口
 */
export interface RuleEnginePoolOptions {
  /**
   * 最大池大小，默认 10
   */
  maxPoolSize?: number;
  /**
   * 是否启用统计，默认 true
   */
  enableStats?: boolean;
  /**
   * 池预热数量，默认 3
   */
  warmupCount?: number;
}

/**
 * 池统计信息接口
 */
export interface PoolStats {
  /**
   * 当前池大小
   */
  poolSize: number;
  /**
   * 当前使用中的实例数
   */
  currentSize: number;
  /**
   * 创建实例总数
   */
  createCount: number;
  /**
   * 复用实例总数
   */
  reuseCount: number;
  /**
   * 复用率（百分比）
   */
  reuseRate: number;
  /**
   * 等待获取实例的次数
   */
  waitCount: number;
  /**
   * 平均等待时间（毫秒）
   */
  avgWaitTime: number;
}

/**
 * 默认池配置
 */
const DEFAULT_POOL_OPTIONS: Required<RuleEnginePoolOptions> = {
  maxPoolSize: 10,
  enableStats: true,
  warmupCount: 3,
};

/**
 * 规则引擎对象池
 * 使用对象池模式复用 Engine 实例，避免重复创建和销毁
 */
export class RuleEnginePool {
  private pool: Engine[] = [];
  private maxPoolSize: number;
  private currentSize: number = 0;
  private options: Required<RuleEnginePoolOptions>;
  private stats = {
    createCount: 0,
    reuseCount: 0,
    waitCount: 0,
    totalWaitTime: 0,
  };
  private waitingQueue: Array<{
    resolve: (engine: Engine) => void;
    timestamp: number;
  }> = [];

  constructor(options: RuleEnginePoolOptions = {}) {
    this.options = { ...DEFAULT_POOL_OPTIONS, ...options };
    this.maxPoolSize = this.options.maxPoolSize;
    
    // 预热池
    this.warmup();
  }

  /**
   * 预热池，预先创建一定数量的实例
   */
  private warmup(): void {
    const warmupCount = Math.min(this.options.warmupCount, this.maxPoolSize);
    for (let i = 0; i < warmupCount; i++) {
      const engine = this.createEngine();
      this.pool.push(engine);
      this.currentSize++;
    }
  }

  /**
   * 从池中获取 Engine 实例
   * 如果池中有可用实例则复用，否则创建新实例
   * @returns Engine 实例
   */
  acquire(): Engine {
    // 优先从池中获取
    if (this.pool.length > 0) {
      this.stats.reuseCount++;
      return this.pool.pop()!;
    }

    // 池为空但未达到最大限制，创建新实例
    if (this.currentSize < this.maxPoolSize) {
      this.stats.createCount++;
      this.currentSize++;
      return this.createEngine();
    }

    // 池已满，需要等待
    return this.waitForAvailableInstance();
  }

  /**
   * 异步获取 Engine 实例
   * 当池已满时，等待其他实例归还
   * @returns Promise<Engine>
   */
  async acquireAsync(): Promise<Engine> {
    // 优先从池中获取
    if (this.pool.length > 0) {
      this.stats.reuseCount++;
      return this.pool.pop()!;
    }

    // 池为空但未达到最大限制，创建新实例
    if (this.currentSize < this.maxPoolSize) {
      this.stats.createCount++;
      this.currentSize++;
      return this.createEngine();
    }

    // 池已满，等待可用实例
    return new Promise<Engine>((resolve) => {
      this.stats.waitCount++;
      this.waitingQueue.push({
        resolve,
        timestamp: Date.now(),
      });
    });
  }

  /**
   * 将 Engine 实例归还到池中
   * @param engine Engine 实例
   */
  release(engine: Engine): void {
    // 创建新的干净引擎实例（json-rules-engine 不支持 removeAllRules，只能创建新实例）
    const newEngine = this.createEngine();

    // 检查是否有等待的请求
    if (this.waitingQueue.length > 0) {
      const waiting = this.waitingQueue.shift()!;
      const waitTime = Date.now() - waiting.timestamp;
      this.stats.totalWaitTime += waitTime;
      waiting.resolve(newEngine);
      return;
    }

    // 归还到池中
    if (this.pool.length < this.maxPoolSize) {
      this.pool.push(newEngine);
    } else {
      // 池已满，丢弃实例
      this.currentSize--;
    }
  }

  /**
   * 创建新的 Engine 实例
   * @returns Engine 实例
   */
  private createEngine(): Engine {
    const engine = new Engine();
    try {
      registerAllOperators(engine);
    } catch (error) {
      console.error('[RuleEnginePool] 注册操作符失败:', error);
      throw error;
    }
    return engine;
  }

  

  /**
   * 等待可用实例（同步阻塞）
   * 注意：这是一个简化的实现，实际应用中建议使用 acquireAsync
   * @returns Engine 实例
   */
  private waitForAvailableInstance(): Engine {
    // 简化实现：直接创建新实例（超过最大限制）
    // 实际应用中应该使用异步等待或抛出错误
    console.warn('[RuleEnginePool] 池已满，临时创建新实例');
    this.stats.createCount++;
    return this.createEngine();
  }

  /**
   * 获取池统计信息
   * @returns 统计信息
   */
  getStats(): PoolStats {
    const totalOperations = this.stats.createCount + this.stats.reuseCount;
    const avgWaitTime = this.stats.waitCount > 0
      ? this.stats.totalWaitTime / this.stats.waitCount
      : 0;

    return {
      poolSize: this.pool.length,
      currentSize: this.currentSize,
      createCount: this.stats.createCount,
      reuseCount: this.stats.reuseCount,
      reuseRate: totalOperations > 0
        ? (this.stats.reuseCount / totalOperations) * 100
        : 0,
      waitCount: this.stats.waitCount,
      avgWaitTime,
    };
  }

  /**
   * 重置统计信息
   */
  resetStats(): void {
    this.stats = {
      createCount: 0,
      reuseCount: 0,
      waitCount: 0,
      totalWaitTime: 0,
    };
  }

  /**
   * 清空对象池
   */
  clear(): void {
    this.pool = [];
    this.currentSize = 0;
    this.waitingQueue = [];
  }

  /**
   * 调整池大小
   * @param newSize 新的最大池大小
   */
  resize(newSize: number): void {
    if (newSize < this.maxPoolSize) {
      // 缩小池，移除多余实例
      const toRemove = this.pool.length - newSize;
      if (toRemove > 0) {
        this.pool.splice(0, toRemove);
        this.currentSize -= toRemove;
      }
    }
    this.maxPoolSize = newSize;
  }

  /**
   * 获取池配置
   */
  getOptions(): Required<RuleEnginePoolOptions> {
    return this.options;
  }

  /**
   * 启用/禁用统计
   * @param enabled 是否启用
   */
  setStatsEnabled(enabled: boolean): void {
    this.options.enableStats = enabled;
  }
}

/**
 * 全局规则引擎池实例
 */
export const globalRuleEnginePool = new RuleEnginePool();

export default RuleEnginePool;
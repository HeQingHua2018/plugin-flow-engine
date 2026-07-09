/*
 * @File: EnhancedRuleEngineCache.ts
 * @desc: 增强的规则引擎缓存，集成 LRU 缓存策略和规则引擎池
 * @author: heqinghua
 * @date: 2026 年 06 月 15 日
 */

import { Engine } from 'json-rules-engine';
import { registerAllOperators } from '@chloehe/logic-engine-common';
import { LRUCache } from './LRUCache';
import { RuleEnginePool } from './RuleEnginePool';
import { RuleCacheKeyGenerator } from './RuleEngineCache';

/**
 * 增强缓存配置接口
 */
export interface EnhancedCacheOptions {
  /**
   * LRU 缓存容量，默认 100
   */
  lruCapacity?: number;
  /**
   * 缓存有效期（毫秒），默认 5 分钟
   */
  ttl?: number;
  /**
   * 规则引擎池大小，默认 10
   */
  poolSize?: number;
  /**
   * 是否启用预热，默认 true
   */
  enableWarmup?: boolean;
  /**
   * 是否启用统计，默认 true
   */
  enableStats?: boolean;
}

/**
 * 缓存数据接口
 */
export interface CachedRuleData {
  /**
   * 规则评估结果
   */
  result: boolean;
  /**
   * 事实数据
   */
  facts: Record<string, any>;
  /**
   * 规则条件
   */
  conditions: any;
  /**
   * 创建时间
   */
  createdAt: number;
}

/**
 * 增强缓存统计信息
 */
export interface EnhancedCacheStats {
  /**
   * LRU 缓存统计
   */
  lruStats: {
    hits: number;
    misses: number;
    evictions: number;
    size: number;
    capacity: number;
    hitRate: number;
  };
  /**
   * 规则引擎池统计
   */
  poolStats: {
    poolSize: number;
    currentSize: number;
    createCount: number;
    reuseCount: number;
    reuseRate: number;
    waitCount: number;
    avgWaitTime: number;
  };
  /**
   * 预热统计
   */
  warmupStats: {
    preloadedCount: number;
    warmupTime: number;
  };
}

/**
 * 默认增强缓存配置
 */
const DEFAULT_ENHANCED_CACHE_OPTIONS: Required<EnhancedCacheOptions> = {
  lruCapacity: 100,
  ttl: 5 * 60 * 1000, // 5 分钟
  poolSize: 10,
  enableWarmup: true,
  enableStats: true,
};

/**
 * 增强的规则引擎缓存
 * 集成 LRU 缓存策略和规则引擎池，提供高效的缓存管理
 */
export class EnhancedRuleEngineCache {
  private lruCache: LRUCache<string, CachedRuleData>;
  private ruleEnginePool: RuleEnginePool;
  private options: Required<EnhancedCacheOptions>;
  private preloadCache: Set<string> = new Set();
  private warmupStats = {
    preloadedCount: 0,
    warmupTime: 0,
  };

  constructor(options: EnhancedCacheOptions = {}) {
    this.options = { ...DEFAULT_ENHANCED_CACHE_OPTIONS, ...options };

    // 初始化 LRU 缓存
    this.lruCache = new LRUCache({
      capacity: this.options.lruCapacity,
      ttl: this.options.ttl,
      enableStats: this.options.enableStats,
    });

    // 初始化规则引擎池
    this.ruleEnginePool = new RuleEnginePool({
      maxPoolSize: this.options.poolSize,
      enableStats: this.options.enableStats,
    });
  }

  /**
   * 获取缓存数据
   * @param conditions 规则条件
   * @param variables 变量
   * @returns 缓存的规则数据或 undefined
   */
  async get(
    conditions: any,
    variables: Record<string, any>
  ): Promise<CachedRuleData | undefined> {
    const key = RuleCacheKeyGenerator.generate(conditions, variables);
    const cached = this.lruCache.get(key);

    if (cached) {
      // 命中缓存，检查是否需要更新
      if (this.shouldUpdateCache(cached, variables)) {
        const updated = await this.updateCachedData(conditions, variables, cached);
        if (updated) {
          this.lruCache.set(key, updated);
          return updated;
        }
      }
      return cached;
    }

    // 缓存未命中，创建新数据
    const newData = await this.createNewData(conditions, variables);
    this.lruCache.set(key, newData);
    return newData;
  }

  /**
   * 设置缓存数据
   * @param conditions 规则条件
   * @param variables 变量
   * @param data 缓存数据
   */
  async set(
    conditions: any,
    variables: Record<string, any>,
    data: CachedRuleData
  ): Promise<void> {
    const key = RuleCacheKeyGenerator.generate(conditions, variables);
    this.lruCache.set(key, data);
  }

  /**
   * 预热缓存
   * @param rules 预加载的规则列表
   */
  async warmup(
    rules: Array<{ conditions: any; variables: Record<string, any> }>
  ): Promise<void> {
    if (!this.options.enableWarmup) return;

    const startTime = Date.now();
    const warmupPromises = rules.map(async (rule) => {
      const key = RuleCacheKeyGenerator.generate(rule.conditions, rule.variables);

      if (!this.preloadCache.has(key)) {
        const engine = this.ruleEnginePool.acquire();
        try {
          engine.addRule({
            conditions: rule.conditions,
            event: { type: 'match' }
          });

          const results = await engine.run(rule.variables);
          const isMatch = results.events.some((event: any) => event.type === 'match');

          const cachedData: CachedRuleData = {
            result: isMatch,
            facts: rule.variables,
            conditions: rule.conditions,
            createdAt: Date.now(),
          };

          this.lruCache.set(key, cachedData);
          this.preloadCache.add(key);
          this.warmupStats.preloadedCount++;
        } finally {
          this.ruleEnginePool.release(engine);
        }
      }
    });

    await Promise.all(warmupPromises);
    this.warmupStats.warmupTime = Date.now() - startTime;
  }

  /**
   * 清除过期缓存
   * @returns 清除的条目数量
   */
  clearExpired(): number {
    return this.lruCache.clearExpired();
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.lruCache.clear();
    this.preloadCache.clear();
    this.warmupStats = { preloadedCount: 0, warmupTime: 0 };
  }

  /**
   * 获取统计信息
   */
  getStats(): EnhancedCacheStats {
    return {
      lruStats: this.lruCache.getStats(),
      poolStats: this.ruleEnginePool.getStats(),
      warmupStats: this.warmupStats,
    };
  }

  /**
   * 重置统计信息
   */
  resetStats(): void {
    this.lruCache.resetStats();
    this.ruleEnginePool.resetStats();
    this.warmupStats = { preloadedCount: 0, warmupTime: 0 };
  }

  /**
   * 获取热点数据
   * @param n 前N个
   * @returns 热点数据列表
   */
  getHotData(n: number): Array<{
    key: string;
    data: CachedRuleData;
    accessCount: number;
  }> {
    const hotData = this.lruCache.getHotData(n);
    return hotData.map(item => ({
      key: item.key,
      data: item.value,
      accessCount: item.accessCount,
    }));
  }

  /**
   * 调整缓存容量
   * @param newCapacity 新的容量
   */
  resize(newCapacity: number): void {
    this.lruCache.resize(newCapacity);
  }

  /**
   * 调整规则引擎池大小
   * @param newSize 新的池大小
   */
  resizePool(newSize: number): void {
    this.ruleEnginePool.resize(newSize);
  }

  /**
   * 判断是否需要更新缓存
   * @param cached 缓存数据
   * @param variables 当前变量
   * @returns 是否需要更新
   */
  private shouldUpdateCache(
    cached: CachedRuleData,
    variables: Record<string, any>
  ): boolean {
    // 检查变量是否发生变化
    const cachedFacts = cached.facts;
    const currentFacts = variables;

    // 简化判断：如果变量数量不同，则需要更新
    if (Object.keys(cachedFacts).length !== Object.keys(currentFacts).length) {
      return true;
    }

    // 检查关键变量是否变化
    for (const key of Object.keys(currentFacts)) {
      if (cachedFacts[key] !== currentFacts[key]) {
        return true;
      }
    }

    return false;
  }

  /**
   * 更新缓存数据
   * @param conditions 规则条件
   * @param variables 变量
   * @param cached 原缓存数据
   * @returns 更新后的缓存数据或 undefined
   */
  private async updateCachedData(
    conditions: any,
    variables: Record<string, any>,
    cached: CachedRuleData
  ): Promise<CachedRuleData | undefined> {
    try {
      const engine = this.ruleEnginePool.acquire();
      try {
        engine.addRule({
          conditions,
          event: { type: 'match' }
        });

        const results = await engine.run(variables);
        const isMatch = results.events.some((event: any) => event.type === 'match');

        return {
          result: isMatch,
          facts: variables,
          conditions,
          createdAt: Date.now(),
        };
      } finally {
        this.ruleEnginePool.release(engine);
      }
    } catch (error) {
      console.error('[EnhancedRuleEngineCache] 更新缓存失败:', error);
      return undefined;
    }
  }

  /**
   * 创建新的缓存数据
   * @param conditions 规则条件
   * @param variables 变量
   * @returns 新的缓存数据
   */
  private async createNewData(
    conditions: any,
    variables: Record<string, any>
  ): Promise<CachedRuleData> {
    const engine = this.ruleEnginePool.acquire();
    try {
      engine.addRule({
        conditions,
        event: { type: 'match' }
      });

      const results = await engine.run(variables);
      const isMatch = results.events.some((event: any) => event.type === 'match');

      return {
        result: isMatch,
        facts: variables,
        conditions,
        createdAt: Date.now(),
      };
    } finally {
      this.ruleEnginePool.release(engine);
    }
  }

  /**
   * 获取缓存配置
   */
  getOptions(): Required<EnhancedCacheOptions> {
    return this.options;
  }

  /**
   * 获取规则引擎池实例
   */
  getPool(): RuleEnginePool {
    return this.ruleEnginePool;
  }

  /**
   * 获取 LRU 缓存实例
   */
  getLRUCache(): LRUCache<string, CachedRuleData> {
    return this.lruCache;
  }
}

/**
 * 全局增强规则引擎缓存实例
 */
export const globalEnhancedRuleEngineCache = new EnhancedRuleEngineCache();

export default EnhancedRuleEngineCache;
/*
 * @File: RuleEngineCache.ts
 * @desc: 规则引擎缓存模块，提供规则评估结果的缓存功能，避免重复计算
 * @author: heqinghua
 * @date: 2026 年 04 月 10 日
 */

import { Engine } from 'json-rules-engine';

/**
 * 缓存项接口
 */
interface CacheItem {
  value: CachedRuleData;
  timestamp: number;
  accessCount: number;
  contentHash: string; // 内容哈希，用于冲突检测
}

/**
 * 规则缓存配置接口
 */
export interface RuleCacheOptions {
  /**
   * 缓存有效期（毫秒），默认 5 分钟
   */
  ttl?: number;
  /**
   * 最大缓存条目数，默认 100
   */
  maxSize?: number;
  /**
   * 是否启用缓存，默认 true
   */
  enabled?: boolean;
  /**
   * 是否启用哈希冲突检测，默认 true
   */
  enableConflictDetection?: boolean;
}

/**
 * 规则缓存数据接口
 */
export interface CachedRuleData {
  engine: Engine;
  facts: Record<string, any>;
}

/**
 * 规则缓存默认配置
 */
const DEFAULT_CACHE_OPTIONS: Required<RuleCacheOptions> = {
  ttl: 5 * 60 * 1000, // 5 分钟
  maxSize: 100,
  enabled: true,
  enableConflictDetection: true,
};

/**
 * 哈希冲突信息
 */
interface HashConflict {
  key: string;
  originalContent: string;
  newContent: string;
  timestamp: number;
}

/**
 * 规则评估缓存键生成器
 * 使用更可靠的键生成策略，基于内容的哈希
 */
export class RuleCacheKeyGenerator {
  /**
   * 生成规则评估的缓存键
   * 使用基于内容的哈希策略，确保相同内容生成相同键
   * @param conditions 规则条件
   * @param variables 变量
   * @returns 缓存键
   */
  static generate(conditions: any, variables: Record<string, any>): string {
    // 规范化条件和变量，确保顺序一致性
    const normalizedConditions = this.normalizeObject(conditions);
    const normalizedVariables = this.normalizeObject(variables);

    // 生成内容字符串
    const contentStr = JSON.stringify({
      conditions: normalizedConditions,
      variables: normalizedVariables,
    });

    // 使用现代哈希算法生成键
    return this.fnv1a64(contentStr);
  }

  /**
   * 生成内容的完整哈希（用于冲突检测）
   * @param conditions 规则条件
   * @param variables 变量
   * @returns 内容哈希
   */
  static async generateContentHash(conditions: any, variables: Record<string, any>): Promise<string> {
    const normalizedConditions = this.normalizeObject(conditions);
    const normalizedVariables = this.normalizeObject(variables);
    const contentStr = JSON.stringify({
      conditions: normalizedConditions,
      variables: normalizedVariables,
    });
    return this.sha256(contentStr);
  }

  /**
   * 规范化对象，确保键的顺序一致性
   * @param obj 要规范化的对象
   * @returns 规范化后的对象
   */
  private static normalizeObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.normalizeObject(item));
    }

    // 对对象键进行排序
    const sortedKeys = Object.keys(obj).sort();
    const result: Record<string, any> = {};
    for (const key of sortedKeys) {
      result[key] = this.normalizeObject(obj[key]);
    }
    return result;
  }

  /**
   * FNV-1a 64 位哈希算法
   * 一种快速、非加密的哈希算法，适合用于缓存键生成
   * @param str 输入字符串
   * @returns 64 位哈希值的十六进制表示
   */
  private static fnv1a64(str: string): string {
    // FNV-1a 64 位参数（使用 BigInt 避免 JavaScript 精度丢失）
    const fnvOffsetBasis = BigInt('14695981039346656037');
    const fnvPrime = BigInt('1099511628211');
    const mask64 = (BigInt(1) << BigInt(64)) - BigInt(1);

    let hash = fnvOffsetBasis;
    for (let i = 0; i < str.length; i++) {
      hash ^= BigInt(str.charCodeAt(i));
      hash = (hash * fnvPrime) & mask64;
    }

    // 转换为 16 进制字符串（固定 16 位长度）
    return hash.toString(16).padStart(16, '0');
  }

  /**
   * 简化的 SHA-256 哈希实现（用于冲突检测）
   * 使用 Web Crypto API（现代浏览器和 Node.js 15+）
   * @param str 输入字符串
   * @returns SHA-256 哈希值的十六进制表示
   */
  private static async sha256(str: string): Promise<string> {
    // 尝试使用 Web Crypto API
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // 降级方案：使用 FNV-1a 的变体
    // 对字符串进行两次哈希以增加复杂度
    let hash1 = 0;
    for (let i = 0; i < str.length; i++) {
      hash1 = ((hash1 << 5) - hash1 + str.charCodeAt(i)) >>> 0;
    }

    let hash2 = 0;
    for (let i = 0; i < str.length; i++) {
      hash2 = ((hash2 << 7) - hash2 + str.charCodeAt(str.length - 1 - i)) >>> 0;
    }

    return (hash1 >>> 0).toString(16) + (hash2 >>> 0).toString(16);
  }
}

/**
 * 规则引擎缓存类
 * 提供规则评估结果的缓存功能，减少重复计算
 */
export class RuleEngineCache {
  private cache: Map<string, CacheItem>;
  private options: Required<RuleCacheOptions>;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    conflicts: 0,
  };
  private conflicts: HashConflict[] = []; // 冲突记录
  private maxConflicts: number = 100; // 最大冲突记录数

  constructor(options: RuleCacheOptions = {}) {
    this.options = { ...DEFAULT_CACHE_OPTIONS, ...options };
    this.cache = new Map();
  }

  /**
   * 获取缓存配置
   */
  getOptions(): Required<RuleCacheOptions> {
    return this.options;
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    hits: number;
    misses: number;
    evictions: number;
    conflicts: number;
    hitRate: number;
  } {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      evictions: this.stats.evictions,
      conflicts: this.stats.conflicts,
      hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
    };
  }

  /**
   * 获取冲突记录
   */
  getConflicts(): HashConflict[] {
    return [...this.conflicts];
  }

  /**
   * 重置统计信息
   */
  resetStats(): void {
    this.stats = { hits: 0, misses: 0, evictions: 0, conflicts: 0 };
    this.conflicts = [];
  }

  /**
   * 从缓存获取规则
   * @param conditions 规则条件
   * @param variables 变量
   * @returns 缓存的规则数据或 undefined
   */
  async get(conditions: any, variables: Record<string, any>): Promise<CachedRuleData | undefined> {
    if (!this.options.enabled) {
      this.stats.misses++;
      return undefined;
    }

    const key = RuleCacheKeyGenerator.generate(conditions, variables);
    const cacheItem = this.cache.get(key);

    if (!cacheItem) {
      this.stats.misses++;
      return undefined;
    }

    // 检查缓存是否过期
    if (Date.now() - cacheItem.timestamp > this.options.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return undefined;
    }

    // 哈希冲突检测
    if (this.options.enableConflictDetection) {
      const contentHash = await RuleCacheKeyGenerator.generateContentHash(conditions, variables);
      if (cacheItem.contentHash !== contentHash) {
        // 检测到哈希冲突
        this.handleHashConflict(key, cacheItem.contentHash, contentHash);
        this.stats.misses++;
        return undefined;
      }
    }

    // 更新访问计数和时间戳
    cacheItem.accessCount++;
    cacheItem.timestamp = Date.now();
    this.stats.hits++;

    // 深拷贝返回，避免外部修改缓存
    return this.deepCloneRuleData(cacheItem.value);
  }

  /**
   * 将规则存入缓存
   * @param conditions 规则条件
   * @param variables 变量
   * @param ruleData 规则数据
   */
  async set(conditions: any, variables: Record<string, any>, ruleData: CachedRuleData): Promise<void> {
    if (!this.options.enabled) {
      return;
    }

    const key = RuleCacheKeyGenerator.generate(conditions, variables);
    const contentHash = await RuleCacheKeyGenerator.generateContentHash(conditions, variables);

    // 检查是否存在哈希冲突
    if (this.options.enableConflictDetection && this.cache.has(key)) {
      const existingItem = this.cache.get(key)!;
      if (existingItem.contentHash !== contentHash) {
        // 检测到冲突，记录并拒绝覆盖
        this.handleHashConflict(key, existingItem.contentHash, contentHash);
        return;
      }
    }

    // 检查是否需要清理过期或最久未使用的条目
    if (this.cache.size >= this.options.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      value: { ...ruleData },
      timestamp: Date.now(),
      accessCount: 1,
      contentHash,
    });
  }

  /**
   * 处理哈希冲突
   * @param key 缓存键
   * @param originalHash 原始内容哈希
   * @param newHash 新内容哈希
   */
  private handleHashConflict(key: string, originalHash: string, newHash: string): void {
    this.stats.conflicts++;

    const conflict: HashConflict = {
      key,
      originalContent: originalHash,
      newContent: newHash,
      timestamp: Date.now(),
    };

    this.conflicts.push(conflict);

    // 限制冲突记录数量
    if (this.conflicts.length > this.maxConflicts) {
      this.conflicts.shift();
    }

    console.warn('[RuleEngineCache] 检测到哈希冲突:', {
      key,
      originalHash,
      newHash,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 清除过期缓存
   * @returns 清除的条目数量
   */
  clearExpired(): number {
    const now = Date.now();
    let cleared = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.options.ttl) {
        this.cache.delete(key);
        cleared++;
      }
    }

    return cleared;
  }

  /**
   * 清除最久未使用的条目
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 获取缓存大小
   */
  getSize(): number {
    return this.cache.size;
  }

  /**
   * 生成缓存键（内部方法，用于测试验证）
   */
  getKey(conditions: any, variables: Record<string, any>): string {
    return RuleCacheKeyGenerator.generate(conditions, variables);
  }

  /**
   * 生成内容哈希（内部方法，用于测试验证）
   */
  async getContentHash(conditions: any, variables: Record<string, any>): Promise<string> {
    return RuleCacheKeyGenerator.generateContentHash(conditions, variables);
  }

  /**
   * 深度克隆规则数据对象
   */
  private deepCloneRuleData(data: CachedRuleData): CachedRuleData {
    return {
      engine: data.engine, // 引擎对象不能深拷贝，直接引用
      facts: this.deepClone(data.facts),
    };
  }

  /**
   * 深度克隆对象
   */
  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * 启用缓存
   */
  enable(): void {
    this.options.enabled = true;
  }

  /**
   * 禁用缓存
   */
  disable(): void {
    this.options.enabled = false;
  }

  /**
   * 调整缓存大小限制
   * @param newSize 新的大小限制
   */
  resize(newSize: number): void {
    if (newSize < this.options.maxSize) {
      // 缩小缓存，移除多余条目
      const toRemove = this.options.maxSize - newSize;
      let removed = 0;
      for (const [key, item] of this.cache.entries()) {
        if (removed >= toRemove) break;
        this.cache.delete(key);
        this.stats.evictions++;
        removed++;
      }
    }
    this.options.maxSize = newSize;
  }

  /**
   * 调整缓存有效期
   * @param newTtl 新的有效期（毫秒）
   */
  setTTL(newTtl: number): void {
    this.options.ttl = newTtl;
  }

  /**
   * 启用/禁用哈希冲突检测
   * @param enabled 是否启用
   */
  setConflictDetection(enabled: boolean): void {
    this.options.enableConflictDetection = enabled;
  }
}

/**
 * 全局规则引擎缓存实例
 */
export const globalRuleEngineCache = new RuleEngineCache();

export default RuleEngineCache;

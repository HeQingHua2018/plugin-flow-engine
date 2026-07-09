/*
 * @File: LRUCache.ts
 * @desc: LRU（最近最少使用）缓存算法实现，使用双向链表 + 哈希表的经典实现
 * @author: heqinghua
 * @date: 2026 年 06 月 15 日
 */

/**
 * LRU 缓存节点
 */
class LRUNode<K, V> {
  key: K;
  value: V;
  prev: LRUNode<K, V> | null = null;
  next: LRUNode<K, V> | null = null;
  timestamp: number;
  accessCount: number = 0;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
    this.timestamp = Date.now();
  }
}

/**
 * LRU 缓存配置接口
 */
export interface LRUCacheOptions {
  /**
   * 缓存容量，默认 100
   */
  capacity?: number;
  /**
   * 缓存有效期（毫秒），默认 5 分钟
   */
  ttl?: number;
  /**
   * 是否启用统计，默认 true
   */
  enableStats?: boolean;
}

/**
 * 缓存统计信息接口
 */
export interface CacheStats {
  /**
   * 命中次数
   */
  hits: number;
  /**
   * 未命中次数
   */
  misses: number;
  /**
   * 淘汰次数
   */
  evictions: number;
  /**
   * 当前缓存大小
   */
  size: number;
  /**
   * 缓存容量
   */
  capacity: number;
  /**
   * 命中率（百分比）
   */
  hitRate: number;
}

/**
 * 默认缓存配置
 */
const DEFAULT_LRU_CACHE_OPTIONS: Required<LRUCacheOptions> = {
  capacity: 100,
  ttl: 5 * 60 * 1000, // 5 分钟
  enableStats: true,
};

/**
 * LRU 缓存实现
 * 使用双向链表 + 哈希表的经典实现，提供高效的缓存管理
 */
export class LRUCache<K, V> {
  private capacity: number;
  private ttl: number;
  private cache: Map<K, LRUNode<K, V>>;
  private head: LRUNode<K, V>;
  private tail: LRUNode<K, V>;
  private options: Required<LRUCacheOptions>;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
  };

  constructor(options: LRUCacheOptions = {}) {
    this.options = { ...DEFAULT_LRU_CACHE_OPTIONS, ...options };
    this.capacity = this.options.capacity;
    this.ttl = this.options.ttl;
    this.cache = new Map();

    // 创建哨兵节点，简化链表操作
    this.head = new LRUNode<K, V>(null as any, null as any);
    this.tail = new LRUNode<K, V>(null as any, null as any);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * 获取缓存值
   * @param key 缓存键
   * @returns 缓存值或 undefined
   */
  get(key: K): V | undefined {
    const node = this.cache.get(key);

    if (!node) {
      this.stats.misses++;
      return undefined;
    }

    // 检查是否过期
    if (this.isExpired(node)) {
      this.delete(key);
      this.stats.misses++;
      return undefined;
    }

    // 命中缓存，移动到头部（最近使用）
    this.moveToHead(node);
    node.accessCount++;
    node.timestamp = Date.now();
    this.stats.hits++;

    return node.value;
  }

  /**
   * 设置缓存值
   * @param key 缓存键
   * @param value 缓存值
   */
  set(key: K, value: V): void {
    const existingNode = this.cache.get(key);

    if (existingNode) {
      // 更新现有节点
      existingNode.value = value;
      existingNode.timestamp = Date.now();
      existingNode.accessCount++;
      this.moveToHead(existingNode);
    } else {
      // 创建新节点
      const newNode = new LRUNode(key, value);
      this.cache.set(key, newNode);
      this.addToHead(newNode);

      // 检查容量，淘汰最久未使用的节点
      if (this.cache.size > this.capacity) {
        this.removeTail();
      }
    }
  }

  /**
   * 删除指定键
   * @param key 缓存键
   * @returns 是否删除成功
   */
  delete(key: K): boolean {
    const node = this.cache.get(key);
    if (!node) return false;

    this.removeNode(node);
    this.cache.delete(key);
    return true;
  }

  /**
   * 检查键是否存在
   * @param key 缓存键
   * @returns 是否存在
   */
  has(key: K): boolean {
    const node = this.cache.get(key);
    if (!node) return false;

    // 检查是否过期
    if (this.isExpired(node)) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.stats = { hits: 0, misses: 0, evictions: 0 };
  }

  /**
   * 获取缓存大小
   * @returns 缓存大小
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * 获取统计信息
   * @returns 统计信息
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      evictions: this.stats.evictions,
      size: this.cache.size,
      capacity: this.capacity,
      hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
    };
  }

  /**
   * 重置统计信息
   */
  resetStats(): void {
    this.stats = { hits: 0, misses: 0, evictions: 0 };
  }

  /**
   * 清除过期缓存
   * @returns 清除的条目数量
   */
  clearExpired(): number {
    let cleared = 0;
    const now = Date.now();

    for (const [key, node] of this.cache.entries()) {
      if (now - node.timestamp > this.ttl) {
        this.delete(key);
        cleared++;
      }
    }

    return cleared;
  }

  /**
   * 调整缓存容量
   * @param newCapacity 新的容量
   */
  resize(newCapacity: number): void {
    if (newCapacity < this.capacity) {
      // 缩小缓存，移除多余条目
      const toRemove = this.cache.size - newCapacity;
      for (let i = 0; i < toRemove && this.cache.size > newCapacity; i++) {
        this.removeTail();
      }
    }
    this.capacity = newCapacity;
  }

  /**
   * 获取所有键（按使用频率排序）
   * @returns 键数组
   */
  getKeysByUsage(): K[] {
    const keys: K[] = [];
    let current = this.head.next;

    while (current && current !== this.tail) {
      keys.push(current.key);
      current = current.next;
    }

    return keys;
  }

  /**
   * 获取热点数据（访问次数最多的前 N 个）
   * @param n 前N个
   * @returns 键值对数组
   */
  getHotData(n: number): Array<{ key: K; value: V; accessCount: number }> {
    const allNodes = Array.from(this.cache.values())
      .filter(node => !this.isExpired(node))
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, n);

    return allNodes.map(node => ({
      key: node.key,
      value: node.value,
      accessCount: node.accessCount,
    }));
  }

  /**
   * 预热缓存
   * @param entries 要预热的键值对
   */
  warmup(entries: Array<{ key: K; value: V }>): void {
    entries.forEach(({ key, value }) => {
      this.set(key, value);
    });
  }

  /**
   * 判断节点是否过期
   * @param node 缓存节点
   * @returns 是否过期
   */
  private isExpired(node: LRUNode<K, V>): boolean {
    return Date.now() - node.timestamp > this.ttl;
  }

  /**
   * 将节点移动到头部
   * @param node 缓存节点
   */
  private moveToHead(node: LRUNode<K, V>): void {
    this.removeNode(node);
    this.addToHead(node);
  }

  /**
   * 添加节点到头部
   * @param node 缓存节点
   */
  private addToHead(node: LRUNode<K, V>): void {
    node.prev = this.head;
    node.next = this.head.next;

    if (this.head.next) {
      this.head.next.prev = node;
    }
    this.head.next = node;
  }

  /**
   * 移除节点
   * @param node 缓存节点
   */
  private removeNode(node: LRUNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
  }

  /**
   * 移除尾部节点（最久未使用）
   */
  private removeTail(): void {
    const tailNode = this.tail.prev;
    if (tailNode && tailNode !== this.head) {
      this.removeNode(tailNode);
      this.cache.delete(tailNode.key);
      this.stats.evictions++;
    }
  }

  /**
   * 获取缓存配置
   */
  getOptions(): Required<LRUCacheOptions> {
    return this.options;
  }

  /**
   * 设置 TTL
   * @param newTtl 新的 TTL（毫秒）
   */
  setTTL(newTtl: number): void {
    this.ttl = newTtl;
  }

  /**
   * 遍历缓存（按使用顺序）
   * @param callback 回调函数
   */
  forEach(callback: (key: K, value: V, timestamp: number) => void): void {
    let current = this.head.next;
    while (current && current !== this.tail) {
      callback(current.key, current.value, current.timestamp);
      current = current.next;
    }
  }
}

export default LRUCache;
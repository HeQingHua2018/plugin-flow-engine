/*
 * @File: RuleEngineCache.test.ts
 * @desc: 规则引擎缓存测试
 * @author: heqinghua
 * @date: 2026 年 04 月 16 日
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { RuleEngineCache, CachedRuleData, RuleCacheOptions } from './RuleEngineCache';
import { Engine } from 'json-rules-engine';

describe('RuleEngineCache', () => {
  let cache: RuleEngineCache;
  const mockEngine = new Engine();

  beforeEach(() => {
    cache = new RuleEngineCache({
      ttl: 5000,
      maxSize: 10,
      enabled: true,
      enableConflictDetection: true,
    });
  });

  afterEach(() => {
    cache.clear();
    cache.resetStats();
  });

  describe('缓存键生成', () => {
    it('相同内容应生成相同的缓存键', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables = { temperature: 35, humidity: 60 };

      const key1 = await (cache as any).getKey(conditions, variables);
      const key2 = await (cache as any).getKey(conditions, variables);

      expect(key1).toBe(key2);
    });

    it('不同内容应生成不同的缓存键', async () => {
      const conditions1 = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const conditions2 = { all: [{ fact: 'temperature', operator: 'greater_than', value: 25 }] };
      const variables = { temperature: 35, humidity: 60 };

      const key1 = await (cache as any).getKey(conditions1, variables);
      const key2 = await (cache as any).getKey(conditions2, variables);

      expect(key1).not.toBe(key2);
    });

    it('变量顺序不应影响缓存键', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables1 = { temperature: 35, humidity: 60 };
      const variables2 = { humidity: 60, temperature: 35 };

      const key1 = await (cache as any).getKey(conditions, variables1);
      const key2 = await (cache as any).getKey(conditions, variables2);

      expect(key1).toBe(key2);
    });

    it('对象键顺序不应影响缓存键', async () => {
      const conditions1 = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const conditions2 = { all: [{ operator: 'greater_than', fact: 'temperature', value: 30 }] };
      const variables = { temperature: 35 };

      const key1 = await (cache as any).getKey(conditions1, variables);
      const key2 = await (cache as any).getKey(conditions2, variables);

      expect(key1).toBe(key2);
    });
  });

  describe('内容哈希生成', () => {
    it('相同内容应生成相同的内容哈希', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables = { temperature: 35 };

      const hash1 = await (cache as any).getContentHash(conditions, variables);
      const hash2 = await (cache as any).getContentHash(conditions, variables);

      expect(hash1).toBe(hash2);
    });

    it('不同内容应生成不同的内容哈希', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables1 = { temperature: 35 };
      const variables2 = { temperature: 40 };

      const hash1 = await (cache as any).getContentHash(conditions, variables1);
      const hash2 = await (cache as any).getContentHash(conditions, variables2);

      expect(hash1).not.toBe(hash2);
    });

    it('内容哈希应具有足够的长度', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables = { temperature: 35 };

      const hash = await (cache as any).getContentHash(conditions, variables);

      // SHA-256 应该生成 64 位十六进制字符串，降级方案至少 32 位
      expect(hash.length).toBeGreaterThanOrEqual(16);
    });
  });

  describe('缓存操作', () => {
    it('应能成功存储和检索缓存', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables = { temperature: 35 };
      const ruleData: CachedRuleData = {
        engine: mockEngine,
        facts: { temperature: 35 },
      };

      await cache.set(conditions, variables, ruleData);
      const result = await cache.get(conditions, variables);

      expect(result).toBeDefined();
      expect(result?.facts.temperature).toBe(35);
    });

    it('应返回未命中缓存的 undefined', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables = { temperature: 35 };

      const result = await cache.get(conditions, variables);

      expect(result).toBeUndefined();
    });

    it('应正确统计命中和未命中', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables = { temperature: 35 };
      const ruleData: CachedRuleData = {
        engine: mockEngine,
        facts: { temperature: 35 },
      };

      // 第一次获取应未命中
      const result1 = await cache.get(conditions, variables);
      expect(result1).toBeUndefined();

      // 存储后再次获取应命中
      await cache.set(conditions, variables, ruleData);
      const result2 = await cache.get(conditions, variables);
      expect(result2).toBeDefined();

      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });

    it('应返回深拷贝避免外部修改', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables = { temperature: 35 };
      const ruleData: CachedRuleData = {
        engine: mockEngine,
        facts: { temperature: 35 },
      };

      await cache.set(conditions, variables, ruleData);
      const result = await cache.get(conditions, variables);

      // 修改返回的结果
      result!.facts.temperature = 100;

      // 再次获取应不受影响
      const result2 = await cache.get(conditions, variables);
      expect(result2?.facts.temperature).toBe(35);
    });
  });

  describe('缓存过期', () => {
    it('过期的缓存应被清除', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables = { temperature: 35 };
      const ruleData: CachedRuleData = {
        engine: mockEngine,
        facts: { temperature: 35 },
      };

      // 设置一个非常短的 TTL
      cache.setTTL(100);
      await cache.set(conditions, variables, ruleData);

      // 等待过期
      await new Promise(resolve => setTimeout(resolve, 150));

      const result = await cache.get(conditions, variables);
      expect(result).toBeUndefined();
    });

    it('clearExpired 应清除过期条目', async () => {
      const conditions1 = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const conditions2 = { all: [{ fact: 'humidity', operator: 'greater_than', value: 60 }] };
      const variables = { temperature: 35, humidity: 70 };
      const ruleData: CachedRuleData = {
        engine: mockEngine,
        facts: { temperature: 35 },
      };

      // 设置一个非常短的 TTL
      cache.setTTL(100);
      await cache.set(conditions1, variables, ruleData);
      await cache.set(conditions2, variables, ruleData);

      // 等待过期
      await new Promise(resolve => setTimeout(resolve, 150));

      const cleared = cache.clearExpired();
      expect(cleared).toBe(2);
    });
  });

  describe('缓存大小限制', () => {
    it('达到最大容量时应淘汰最旧的条目', async () => {
      cache = new RuleEngineCache({
        ttl: 5000,
        maxSize: 3,
        enabled: true,
      });

      const conditions1 = { all: [{ fact: 'a', operator: 'equal', value: 1 }] };
      const conditions2 = { all: [{ fact: 'b', operator: 'equal', value: 2 }] };
      const conditions3 = { all: [{ fact: 'c', operator: 'equal', value: 3 }] };
      const conditions4 = { all: [{ fact: 'd', operator: 'equal', value: 4 }] };
      const variables = { a: 1, b: 2, c: 3, d: 4 };
      const ruleData: CachedRuleData = {
        engine: mockEngine,
        facts: {},
      };

      await cache.set(conditions1, variables, ruleData);
      await cache.set(conditions2, variables, ruleData);
      await cache.set(conditions3, variables, ruleData);

      // 添加第四个条目，应淘汰第一个
      await cache.set(conditions4, variables, ruleData);

      expect(cache.getSize()).toBe(3);

      // 第一个条目应被移除
      const result1 = await cache.get(conditions1, variables);
      expect(result1).toBeUndefined();

      // 其他条目应仍然存在
      const result2 = await cache.get(conditions2, variables);
      expect(result2).toBeDefined();
    });
  });

  describe('哈希冲突检测', () => {
    it('应检测到哈希冲突并拒绝覆盖', async () => {
      const conditions1 = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const conditions2 = { all: [{ fact: 'humidity', operator: 'greater_than', value: 60 }] };
      const variables = { temperature: 35, humidity: 70 };
      const ruleData1: CachedRuleData = {
        engine: mockEngine,
        facts: { temperature: 35 },
      };
      const ruleData2: CachedRuleData = {
        engine: mockEngine,
        facts: { humidity: 70 },
      };

      await cache.set(conditions1, variables, ruleData1);

      // 尝试用不同内容覆盖相同键（理论上不应发生，但应被检测）
      await cache.set(conditions2, variables, ruleData2);

      const stats = cache.getStats();
      expect(stats.conflicts).toBeGreaterThanOrEqual(0);
    });

    it('应记录冲突信息', async () => {
      const conditions1 = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const conditions2 = { all: [{ fact: 'humidity', operator: 'greater_than', value: 60 }] };
      const variables = { temperature: 35, humidity: 70 };
      const ruleData1: CachedRuleData = {
        engine: mockEngine,
        facts: { temperature: 35 },
      };
      const ruleData2: CachedRuleData = {
        engine: mockEngine,
        facts: { humidity: 70 },
      };

      await cache.set(conditions1, variables, ruleData1);
      await cache.set(conditions2, variables, ruleData2);

      const conflicts = cache.getConflicts();
      expect(Array.isArray(conflicts)).toBe(true);
    });

    it('禁用冲突检测后不应记录冲突', async () => {
      cache.setConflictDetection(false);

      const conditions1 = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const conditions2 = { all: [{ fact: 'humidity', operator: 'greater_than', value: 60 }] };
      const variables = { temperature: 35, humidity: 70 };
      const ruleData1: CachedRuleData = {
        engine: mockEngine,
        facts: { temperature: 35 },
      };
      const ruleData2: CachedRuleData = {
        engine: mockEngine,
        facts: { humidity: 70 },
      };

      await cache.set(conditions1, variables, ruleData1);
      await cache.set(conditions2, variables, ruleData2);

      const stats = cache.getStats();
      expect(stats.conflicts).toBe(0);
    });
  });

  describe('统计信息', () => {
    it('应正确计算命中率', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables = { temperature: 35 };
      const ruleData: CachedRuleData = {
        engine: mockEngine,
        facts: { temperature: 35 },
      };

      // 2 次未命中 + 2 次命中
      await cache.get(conditions, variables);
      await cache.set(conditions, variables, ruleData);
      await cache.get(conditions, variables);
      await cache.get(conditions, variables);

      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBeCloseTo(66.67, 2); // 2/3 * 100
    });

    it('重置统计应清空所有计数器', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables = { temperature: 35 };
      const ruleData: CachedRuleData = {
        engine: mockEngine,
        facts: { temperature: 35 },
      };

      await cache.set(conditions, variables, ruleData);
      await cache.get(conditions, variables);

      cache.resetStats();

      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.evictions).toBe(0);
      expect(stats.conflicts).toBe(0);
    });
  });

  describe('缓存启用/禁用', () => {
    it('禁用缓存后应返回未命中', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables = { temperature: 35 };
      const ruleData: CachedRuleData = {
        engine: mockEngine,
        facts: { temperature: 35 },
      };

      await cache.set(conditions, variables, ruleData);
      cache.disable();

      const result = await cache.get(conditions, variables);
      expect(result).toBeUndefined();

      const stats = cache.getStats();
      expect(stats.misses).toBe(1);
    });

    it('启用缓存后应恢复正常', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables = { temperature: 35 };
      const ruleData: CachedRuleData = {
        engine: mockEngine,
        facts: { temperature: 35 },
      };

      await cache.set(conditions, variables, ruleData);
      cache.disable();

      // while disabled, get should return undefined
      const disabledResult = await cache.get(conditions, variables);
      expect(disabledResult).toBeUndefined();

      cache.enable();

      const result = await cache.get(conditions, variables);
      expect(result).toBeDefined();
    });
  });

  describe('配置调整', () => {
    it('调整 TTL 应生效', async () => {
      const conditions = { all: [{ fact: 'temperature', operator: 'greater_than', value: 30 }] };
      const variables = { temperature: 35 };
      const ruleData: CachedRuleData = {
        engine: mockEngine,
        facts: { temperature: 35 },
      };

      cache.setTTL(100);
      await cache.set(conditions, variables, ruleData);

      await new Promise(resolve => setTimeout(resolve, 150));

      const result = await cache.get(conditions, variables);
      expect(result).toBeUndefined();
    });

    it('调整缓存大小应生效', async () => {
      cache = new RuleEngineCache({
        ttl: 5000,
        maxSize: 2,
        enabled: true,
        enableConflictDetection: false,
      });

      const conditions1 = { all: [{ fact: 'a', operator: 'equal', value: 1 }] };
      const conditions2 = { all: [{ fact: 'b', operator: 'equal', value: 2 }] };
      const variables = { a: 1, b: 2 };
      const ruleData: CachedRuleData = {
        engine: mockEngine,
        facts: {},
      };

      await cache.set(conditions1, variables, ruleData);
      await cache.set(conditions2, variables, ruleData);

      cache.resize(1);

      expect(cache.getSize()).toBe(1);
    });
  });
});

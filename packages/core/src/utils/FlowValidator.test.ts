/*
 * @File: FlowValidator.test.ts
 * @desc: 流程验证器单元测试
 */
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { FlowValidator } from './FlowValidator';
import type { Node, Edge, FlowData } from '../types';

function createMockFlow(nodes: Node[], edges: Edge[]): FlowData {
  return {
    flow: {
      id: 'test-flow',
      name: 'Test Flow',
      version: '1.0.0',
      description: '',
      category: 'test',
      enable: true,
      create_date: '2024-01-01',
      update_date: '2024-01-01',
    },
    context: { variables: {} },
    nodes,
    edges,
    global_config: { timeout: 30000, max_depth: 10 },
  };
}

function createNode(id: string, type: string, pluginNodeType: string): Node {
  return {
    id,
    type,
    position: { x: 0, y: 0 },
    data: { label: `Node ${id}`, pluginNodeType, config: {} },
  } as Node;
}

describe('FlowValidator', () => {
  let validator: FlowValidator;

  beforeEach(() => {
    validator = new FlowValidator({ enableCache: true });
  });

  afterEach(() => {
    validator.clearCache();
  });

  describe('基础验证', () => {
    it('空流程应产生 MISSING_TRIGGER 错误', async () => {
      const result = await validator.validate(createMockFlow([], []));
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_TRIGGER')).toBe(true);
    });

    it('含 Trigger 节点的流程应有效', async () => {
      const flow = createMockFlow(
        [createNode('1', 'trigger', 'Trigger')],
        [],
      );
      const result = await validator.validate(flow);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('边验证', () => {
    it('自环边应产生 SELF_LOOP_EDGE 错误', async () => {
      const flow = createMockFlow(
        [createNode('1', 'trigger', 'Trigger')],
        [{ id: 'e1', source: '1', target: '1' } as Edge],
      );
      const result = await validator.validate(flow);
      expect(result.warnings.some(w => w.code === 'SELF_LOOP_EDGE')).toBe(true);
    });

    it('指向不存在节点的边应产生 INVALID_TARGET_NODE 错误', async () => {
      const flow = createMockFlow(
        [createNode('1', 'trigger', 'Trigger')],
        [{ id: 'e1', source: '1', target: 'nonexistent' } as Edge],
      );
      const result = await validator.validate(flow);
      expect(result.errors.some(e => e.code === 'INVALID_TARGET_NODE')).toBe(true);
      expect(result.isValid).toBe(false);
    });
  });

  describe('缓存功能', () => {
    it('清除缓存后应重新验证', async () => {
      const flow = createMockFlow([], []);
      validator.clearCache();
      const result = await validator.validate(flow);
      expect(result).toBeDefined();
    });
  });

  describe('增量验证', () => {
    it('相同流程增量验证应返回结果', async () => {
      const flow = createMockFlow([], []);
      const result = await validator.validateIncremental(flow, flow);
      expect(result).toBeDefined();
    });
  });

  describe('配置选项', () => {
    it('禁用缓存应可正常验证', async () => {
      const noCacheValidator = new FlowValidator({ enableCache: false });
      const flow = createMockFlow([], []);
      const result = await noCacheValidator.validate(flow);
      expect(result).toBeDefined();
    });
  });
});

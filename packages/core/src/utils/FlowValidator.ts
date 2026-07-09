/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @File: FlowValidator.ts
 * @desc: 流程验证器，用于验证流程定义的有效性，支持增量验证
 * @author: heqinghua
 * @date: 2025 年 01 月 27 日
 */

import { type FlowData, type Node, type Edge } from "../types";
import { FlowExecutionError } from '@chloehe/logic-engine-common';

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  timestamp?: number;
  cacheKey?: string;
}

/**
 * 验证错误接口
 */
export interface ValidationError {
  code: string;
  message: string;
  nodeId?: string;
  edgeId?: string;
  severity: 'error' | 'warning';
}

/**
 * 验证警告接口
 */
export interface ValidationWarning {
  code: string;
  message: string;
  nodeId?: string;
  edgeId?: string;
}

/**
 * 变更集接口
 */
export interface FlowChanges {
  addedNodes: Set<string>;
  removedNodes: Set<string>;
  modifiedNodes: Set<string>;
  addedEdges: Set<string>;
  removedEdges: Set<string>;
  modifiedEdges: Set<string>;
}

/**
 * 缓存项接口
 */
interface ValidationCacheItem {
  flowHash: string;
  result: ValidationResult;
  timestamp: number;
  nodeHashes: Map<string, string>;
  edgeHashes: Map<string, string>;
}

/**
 * 验证器配置接口
 */
export interface FlowValidatorOptions {
  /**
   * 是否启用缓存，默认 true
   */
  enableCache?: boolean;
  /**
   * 缓存有效期（毫秒），默认 60 秒
   */
  cacheTTL?: number;
  /**
   * 最大缓存数量，默认 100
   */
  maxCacheSize?: number;
  /**
   * 是否启用增量验证，默认 true
   */
  enableIncremental?: boolean;
}

/**
 * 默认验证器配置
 */
const DEFAULT_VALIDATOR_OPTIONS: Required<FlowValidatorOptions> = {
  enableCache: true,
  cacheTTL: 60 * 1000, // 60 秒
  maxCacheSize: 100,
  enableIncremental: true,
};

/**
 * 内容哈希生成器
 */
class ContentHashGenerator {
  /**
   * 生成字符串的简单哈希
   */
  static hash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash + char) >>> 0;
    }
    return hash.toString(16).padStart(8, '0');
  }

  /**
   * 生成对象的哈希
   */
  static objectHash(obj: any): string {
    const normalized = this.normalizeObject(obj);
    return this.hash(JSON.stringify(normalized));
  }

  /**
   * 规范化对象，确保键顺序一致
   */
  private static normalizeObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.normalizeObject(item));
    }
    const sortedKeys = Object.keys(obj).sort();
    const result: Record<string, any> = {};
    for (const key of sortedKeys) {
      result[key] = this.normalizeObject(obj[key]);
    }
    return result;
  }
}

/**
 * 流程验证器类
 * 提供流程定义的有效性验证功能，支持增量验证和缓存
 */
export class FlowValidator {
  private options: Required<FlowValidatorOptions>;
  private cache: Map<string, ValidationCacheItem> = new Map();
  private cacheHitCount = 0;
  private cacheMissCount = 0;

  constructor(options: FlowValidatorOptions = {}) {
    this.options = { ...DEFAULT_VALIDATOR_OPTIONS, ...options };
  }

  /**
   * 获取验证器配置
   */
  getOptions(): Required<FlowValidatorOptions> {
    return this.options;
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    cacheHits: number;
    cacheMisses: number;
    cacheSize: number;
    hitRate: number;
  } {
    const total = this.cacheHitCount + this.cacheMissCount;
    return {
      cacheHits: this.cacheHitCount,
      cacheMisses: this.cacheMissCount,
      cacheSize: this.cache.size,
      hitRate: total > 0 ? (this.cacheHitCount / total) * 100 : 0,
    };
  }

  /**
   * 重置统计信息
   */
  resetStats(): void {
    this.cacheHitCount = 0;
    this.cacheMissCount = 0;
  }

  /**
   * 验证流程定义
   * @param flow 流程定义
   * @returns 验证结果
   */
  public validate(flow: FlowData): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 基础结构验证
    this.validateBasicStructure(flow, errors, warnings);

    // 节点验证
    this.validateNodes(flow, errors, warnings);

    // 边验证
    this.validateEdges(flow, errors, warnings);

    // 流程逻辑验证
    this.validateFlowLogic(flow, errors, warnings);

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      timestamp: Date.now(),
    };

    // 尝试使用缓存（如果启用）
    if (this.options.enableCache) {
      this.tryCacheResult(flow, result);
    }

    return result;
  }

  /**
   * 验证流程基础结构
   * @param flow 流程定义
   * @param errors 错误数组
   * @param warnings 警告数组
   */
  private validateBasicStructure(
    flow: FlowData,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // 检查 flow 是否为对象
    if (!flow || typeof flow !== 'object') {
      errors.push({
        code: 'INVALID_FLOW_STRUCTURE',
        message: '流程定义必须是有效的对象',
        severity: 'error',
      });
      return;
    }

    // 检查 nodes 是否存在且为数组
    if (!flow.nodes || !Array.isArray(flow.nodes)) {
      errors.push({
        code: 'MISSING_NODES',
        message: '流程定义缺少 nodes 数组',
        severity: 'error',
      });
    }

    // 检查 edges 是否存在且为数组
    if (!flow.edges || !Array.isArray(flow.edges)) {
      errors.push({
        code: 'MISSING_EDGES',
        message: '流程定义缺少 edges 数组',
        severity: 'error',
      });
    }

    // 检查是否有至少一个节点
    if (flow.nodes && flow.nodes.length === 0) {
      warnings.push({
        code: 'EMPTY_FLOW',
        message: '流程定义中没有节点',
      });
    }

    // 检查节点 ID 唯一性
    if (flow.nodes) {
      const nodeIds = new Set<string>();
      for (const node of flow.nodes) {
        if (!node.id) {
          errors.push({
            code: 'MISSING_NODE_ID',
            message: '节点缺少 id 字段',
            severity: 'error',
          });
        } else if (nodeIds.has(node.id)) {
          errors.push({
            code: 'DUPLICATE_NODE_ID',
            message: `重复的节点 ID: ${node.id}`,
            nodeId: node.id,
            severity: 'error',
          });
        } else {
          nodeIds.add(node.id);
        }
      }
    }

    // 检查边 ID 唯一性
    if (flow.edges) {
      const edgeIds = new Set<string>();
      for (const edge of flow.edges) {
        if (!edge.id) {
          errors.push({
            code: 'MISSING_EDGE_ID',
            message: '边缺少 id 字段',
            severity: 'error',
          });
        } else if (edgeIds.has(edge.id)) {
          errors.push({
            code: 'DUPLICATE_EDGE_ID',
            message: `重复的边 ID: ${edge.id}`,
            edgeId: edge.id,
            severity: 'error',
          });
        } else {
          edgeIds.add(edge.id);
        }
      }
    }
  }

  /**
   * 验证节点
   * @param flow 流程定义
   * @param errors 错误数组
   * @param warnings 警告数组
   */
  private validateNodes(
    flow: FlowData,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!flow.nodes) return;

    for (const node of flow.nodes) {
      // 检查节点 ID
      if (!node.id) {
        errors.push({
          code: 'MISSING_NODE_ID',
          message: '节点缺少 id 字段',
          severity: 'error',
        });
        continue;
      }

      // 检查节点数据
      if (!node.data || typeof node.data !== 'object') {
        errors.push({
          code: 'INVALID_NODE_DATA',
          message: `节点 ${node.id} 的 data 字段必须是对象`,
          nodeId: node.id,
          severity: 'error',
        });
      }

      // 检查节点名称
      if (!node.data?.label) {
        warnings.push({
          code: 'MISSING_NODE_LABEL',
          message: `节点 ${node.id} 缺少名称`,
          nodeId: node.id,
        });
      }
    }
  }

  /**
   * 验证边
   * @param flow 流程定义
   * @param errors 错误数组
   * @param warnings 警告数组
   */
  private validateEdges(
    flow: FlowData,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!flow.edges) return;

    const nodeIds = new Set(flow.nodes?.map(n => n.id) || []);

    for (const edge of flow.edges) {
      // 检查边 ID
      if (!edge.id) {
        errors.push({
          code: 'MISSING_EDGE_ID',
          message: '边缺少 id 字段',
          severity: 'error',
        });
        continue;
      }

      // 检查源节点是否存在
      if (!nodeIds.has(edge.source)) {
        errors.push({
          code: 'INVALID_SOURCE_NODE',
          message: `边 ${edge.id} 的源节点不存在：${edge.source}`,
          edgeId: edge.id,
          severity: 'error',
        });
      }

      // 检查目标节点是否存在
      if (!nodeIds.has(edge.target)) {
        errors.push({
          code: 'INVALID_TARGET_NODE',
          message: `边 ${edge.id} 的目标节点不存在：${edge.target}`,
          edgeId: edge.id,
          severity: 'error',
        });
      }

      // 检查自循环
      if (edge.source === edge.target) {
        warnings.push({
          code: 'SELF_LOOP_EDGE',
          message: `边 ${edge.id} 存在自循环`,
          edgeId: edge.id,
        });
      }
    }
  }

  /**
   * 验证流程逻辑
   * @param flow 流程定义
   * @param errors 错误数组
   * @param warnings 警告数组
   */
  private validateFlowLogic(
    flow: FlowData,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!flow.nodes || !flow.edges) return;

    // 检查循环依赖
    this.checkCircularDependency(flow, errors);

    // 检查不可达节点
    this.checkUnreachableNodes(flow, warnings);

    // 检查是否有触发器节点
    this.checkTriggerNode(flow, errors, warnings);
  }

  /**
   * 检查循环依赖
   */
  private checkCircularDependency(
    flow: FlowData,
    errors: ValidationError[]
  ): void {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) {
        return true;
      }
      if (visited.has(nodeId)) {
        return false;
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = flow.edges.filter(e => e.source === nodeId && e.source !== e.target);
      for (const edge of outgoingEdges) {
        if (dfs(edge.target)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of flow.nodes) {
      if (!visited.has(node.id)) {
        if (dfs(node.id)) {
          errors.push({
            code: 'CIRCULAR_DEPENDENCY',
            message: '流程中存在循环依赖',
            nodeId: node.id,
            severity: 'error',
          });
          break;
        }
      }
    }
  }

  /**
   * 检查不可达节点
   */
  private checkUnreachableNodes(
    flow: FlowData,
    warnings: ValidationWarning[]
  ): void {
    const triggerNodes = flow.nodes.filter(n => n.data?.pluginNodeType === 'Trigger');
    if (triggerNodes.length === 0) return;

    const reachableNodes = new Set<string>();

    const dfs = (nodeId: string): void => {
      if (reachableNodes.has(nodeId)) return;

      reachableNodes.add(nodeId);
      const outgoingEdges = flow.edges.filter(e => e.source === nodeId);

      for (const edge of outgoingEdges) {
        dfs(edge.target);
      }
    };

    // 从所有触发器节点开始遍历
    for (const triggerNode of triggerNodes) {
      dfs(triggerNode.id);
    }

    // 检查不可达节点
    for (const node of flow.nodes) {
      if (!reachableNodes.has(node.id)) {
        warnings.push({
          code: 'UNREACHABLE_NODE',
          message: `节点 ${node.id} 从触发器节点不可达`,
          nodeId: node.id,
        });
      }
    }
  }

  /**
   * 检查触发器节点
   */
  private checkTriggerNode(
    flow: FlowData,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const triggerNodes = flow.nodes.filter(n => n.data?.pluginNodeType === 'Trigger');
    if (triggerNodes.length === 0) {
      errors.push({
        code: 'MISSING_TRIGGER',
        message: '流程缺少触发器节点',
        severity: 'error',
      });
    } else if (triggerNodes.length > 1) {
      warnings.push({
        code: 'MULTIPLE_TRIGGERS',
        message: `流程中有多个触发器节点 (${triggerNodes.length} 个)`,
      });
    }
  }

  /**
   * 增量验证流程定义
   * 只验证变更的部分，提高验证效率
   * @param flow 当前流程定义
   * @param previousFlow 上一个流程定义
   * @returns 验证结果
   */
  public validateIncremental(
    flow: FlowData,
    previousFlow: FlowData
  ): ValidationResult {
    if (!this.options.enableIncremental) {
      // 如果禁用增量验证，回退到完整验证
      return this.validate(flow);
    }

    // 计算变更集
    const changes = this.calculateChanges(flow, previousFlow);

    // 如果没有变更，尝试从缓存获取结果
    if (this.isFlowUnchanged(flow, previousFlow)) {
      return this.get_cached_result(flow);
    }

    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 只验证变更的部分
    this.validateChanges(flow, changes, errors, warnings);

    // 如果没有错误，验证受影响的逻辑部分
    if (errors.length === 0) {
      this.validateAffectedLogic(flow, changes, errors, warnings);
    }

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      timestamp: Date.now(),
    };

    // 尝试使用缓存
    if (this.options.enableCache) {
      this.tryCacheResult(flow, result);
    }

    return result;
  }

  /**
   * 计算两个流程之间的变更集
   * @param flow 当前流程
   * @param previousFlow 上一个流程
   * @returns 变更集
   */
  public calculateChanges(
    flow: FlowData,
    previousFlow: FlowData
  ): FlowChanges {
    const addedNodes = new Set<string>();
    const removedNodes = new Set<string>();
    const modifiedNodes = new Set<string>();
    const addedEdges = new Set<string>();
    const removedEdges = new Set<string>();
    const modifiedEdges = new Set<string>();

    // 检查节点变更
    const previousNodeIds = new Set(previousFlow.nodes?.map(n => n.id) || []);
    const previousEdgeIds = new Set(previousFlow.edges?.map(e => e.id) || []);

    for (const node of flow.nodes || []) {
      if (!previousNodeIds.has(node.id)) {
        addedNodes.add(node.id);
      } else {
        // 检查节点是否修改
        const previousNode = previousFlow.nodes?.find(n => n.id === node.id);
        if (previousNode && this.isNodeModified(node, previousNode)) {
          modifiedNodes.add(node.id);
        }
      }
    }

    for (const node of previousFlow.nodes || []) {
      if (!flow.nodes?.some(n => n.id === node.id)) {
        removedNodes.add(node.id);
      }
    }

    // 检查边变更
    for (const edge of flow.edges || []) {
      if (!previousEdgeIds.has(edge.id)) {
        addedEdges.add(edge.id);
      } else {
        // 检查边是否修改
        const previousEdge = previousFlow.edges?.find(e => e.id === edge.id);
        if (previousEdge && this.isEdgeModified(edge, previousEdge)) {
          modifiedEdges.add(edge.id);
        }
      }
    }

    for (const edge of previousFlow.edges || []) {
      if (!flow.edges?.some(e => e.id === edge.id)) {
        removedEdges.add(edge.id);
      }
    }

    return {
      addedNodes,
      removedNodes,
      modifiedNodes,
      addedEdges,
      removedEdges,
      modifiedEdges,
    };
  }

  /**
   * 验证变更部分
   * @param flow 当前流程
   * @param changes 变更集
   * @param errors 错误数组
   * @param warnings 警告数组
   */
  private validateChanges(
    flow: FlowData,
    changes: FlowChanges,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // 验证新增的节点
    for (const nodeId of changes.addedNodes) {
      const node = flow.nodes?.find(n => n.id === nodeId);
      if (node) {
        this.validateNodeIncremental(node, errors, warnings);
      }
    }

    // 验证修改的节点
    for (const nodeId of changes.modifiedNodes) {
      const node = flow.nodes?.find(n => n.id === nodeId);
      if (node) {
        this.validateNodeIncremental(node, errors, warnings);
      }
    }

    // 验证新增的边
    for (const edgeId of changes.addedEdges) {
      const edge = flow.edges?.find(e => e.id === edgeId);
      if (edge) {
        this.validateEdgeIncremental(edge, flow, errors, warnings);
      }
    }

    // 验证修改的边
    for (const edgeId of changes.modifiedEdges) {
      const edge = flow.edges?.find(e => e.id === edgeId);
      if (edge) {
        this.validateEdgeIncremental(edge, flow, errors, warnings);
      }
    }

    // 验证被删除的节点相关的边
    for (const nodeId of changes.removedNodes) {
      const relatedEdges = flow.edges?.filter(e =>
        e.source === nodeId || e.target === nodeId
      ) || [];
      for (const edge of relatedEdges) {
        warnings.push({
          code: 'ORPHANED_EDGE',
          message: `边 ${edge.id} 连接到已删除的节点 ${nodeId}`,
          edgeId: edge.id,
        });
      }
    }

    // 验证被删除的边相关的节点
    for (const edgeId of changes.removedEdges) {
      // 边已删除，不需要验证
    }
  }

  /**
   * 验证受影响的逻辑部分
   * @param flow 当前流程
   * @param changes 变更集
   * @param errors 错误数组
   * @param warnings 警告数组
   */
  private validateAffectedLogic(
    flow: FlowData,
    changes: FlowChanges,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // 收集受影响的节点（直接连接变更节点的节点）
    const affectedNodes = new Set<string>();

    // 新增/修改的节点会影响其连接的节点
    for (const nodeId of [...changes.addedNodes, ...changes.modifiedNodes]) {
      const connectedEdges = flow.edges?.filter(e =>
        e.source === nodeId || e.target === nodeId
      ) || [];
      for (const edge of connectedEdges) {
        if (edge.source !== nodeId) affectedNodes.add(edge.source);
        if (edge.target !== nodeId) affectedNodes.add(edge.target);
      }
    }

    // 删除的节点会影响其连接的节点
    for (const nodeId of changes.removedNodes) {
      const connectedEdges = flow.edges?.filter(e =>
        e.source === nodeId || e.target === nodeId
      ) || [];
      for (const edge of connectedEdges) {
        if (edge.source !== nodeId) affectedNodes.add(edge.source);
        if (edge.target !== nodeId) affectedNodes.add(edge.target);
      }
    }

    // 检查循环依赖（只检查受影响的节点）
    this.checkAffectedCircularDependency(flow, affectedNodes, errors);

    // 检查不可达节点（只检查受影响的节点）
    this.checkAffectedUnreachableNodes(flow, affectedNodes, warnings);
  }

  /**
   * 检查受影响的循环依赖
   */
  private checkAffectedCircularDependency(
    flow: FlowData,
    affectedNodes: Set<string>,
    errors: ValidationError[]
  ): void {
    if (affectedNodes.size === 0) return;

    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) {
        return true;
      }
      if (visited.has(nodeId)) {
        return false;
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = flow.edges.filter(e => e.source === nodeId && e.source !== e.target);
      for (const edge of outgoingEdges) {
        if (dfs(edge.target)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const nodeId of affectedNodes) {
      if (!visited.has(nodeId)) {
        if (dfs(nodeId)) {
          errors.push({
            code: 'CIRCULAR_DEPENDENCY',
            message: `流程中存在循环依赖（受节点 ${nodeId} 变更影响）`,
            nodeId: nodeId,
            severity: 'error',
          });
          break;
        }
      }
    }
  }

  /**
   * 检查受影响的不可达节点
   */
  private checkAffectedUnreachableNodes(
    flow: FlowData,
    affectedNodes: Set<string>,
    warnings: ValidationWarning[]
  ): void {
    if (affectedNodes.size === 0) return;

    const triggerNodes = flow.nodes.filter(n => n.data?.pluginNodeType === "Trigger");
    if (triggerNodes.length === 0) return;

    const reachableNodes = new Set<string>();

    const dfs = (nodeId: string): void => {
      if (reachableNodes.has(nodeId)) return;

      reachableNodes.add(nodeId);
      const outgoingEdges = flow.edges.filter(e => e.source === nodeId);

      for (const edge of outgoingEdges) {
        dfs(edge.target);
      }
    };

    // 从所有触发器节点开始遍历
    for (const triggerNode of triggerNodes) {
      dfs(triggerNode.id);
    }

    // 只检查受影响的节点是否可达
    for (const nodeId of affectedNodes) {
      if (!reachableNodes.has(nodeId)) {
        warnings.push({
          code: 'UNREACHABLE_NODE',
          message: `节点 ${nodeId} 从触发器节点不可达（受变更影响）`,
          nodeId: nodeId,
        });
      }
    }
  }

  /**
   * 增量验证单个节点
   */
  private validateNodeIncremental(
    node: Node,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // 检查必要字段
    if (!node.data?.label) {
      errors.push({
        code: 'MISSING_NODE_LABEL',
        message: `节点 ${node.id} 缺少名称`,
        nodeId: node.id,
        severity: 'error',
      });
    }

    // 验证节点配置
    this.validateNodeConfigIncremental(node, errors, warnings);
  }

  /**
   * 增量验证节点配置
   */
  private validateNodeConfigIncremental(
    node: Node,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // 验证迭代节点配置
    if (node.data?.pluginNodeType === "Iteration") {
      const iterationCount = node.data?.config?.iteration_count;
      if (iterationCount !== undefined && (iterationCount < 1 || iterationCount > 100)) {
        errors.push({
          code: 'INVALID_ITERATION_COUNT',
          message: `节点 ${node.id} 的迭代次数必须在 1-100 之间`,
          nodeId: node.id,
          severity: 'error',
        });
      }
    }

    // 验证并行节点配置
    if (node.data?.pluginNodeType === "Parallel") {
      const strategy = node.data?.config?.parallel_strategy;
      if (strategy && !['all', 'any'].includes(strategy)) {
        errors.push({
          code: 'INVALID_PARALLEL_STRATEGY',
          message: `节点 ${node.id} 的并行策略无效`,
          nodeId: node.id,
          severity: 'error',
        });
      }
    }
  }

  /**
   * 增量验证单个边
   */
  private validateEdgeIncremental(
    edge: Edge,
    flow: FlowData,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const nodeIds = new Set(flow.nodes.map(n => n.id));

    // 检查源节点是否存在
    if (!nodeIds.has(edge.source)) {
      errors.push({
        code: 'INVALID_SOURCE_NODE',
        message: `边 ${edge.id} 的源节点不存在：${edge.source}`,
        edgeId: edge.id,
        severity: 'error',
      });
    }

    // 检查目标节点是否存在
    if (!nodeIds.has(edge.target)) {
      errors.push({
        code: 'INVALID_TARGET_NODE',
        message: `边 ${edge.id} 的目标节点不存在：${edge.target}`,
        edgeId: edge.id,
        severity: 'error',
      });
    }

    // 检查自循环
    if (edge.source === edge.target) {
      warnings.push({
        code: 'SELF_LOOP_EDGE',
        message: `边 ${edge.id} 存在自循环`,
        edgeId: edge.id,
      });
    }
  }

  /**
   * 检查节点是否修改
   */
  private isNodeModified(node: Node, previousNode: Node): boolean {
    // 比较节点的关键属性
    const nodeHash = ContentHashGenerator.objectHash({
      id: node.id,
      type: node.type,
      data: node.data,
    });
    const previousNodeHash = ContentHashGenerator.objectHash({
      id: previousNode.id,
      type: previousNode.type,
      data: previousNode.data,
    });
    return nodeHash !== previousNodeHash;
  }

  /**
   * 检查边是否修改
   */
  private isEdgeModified(edge: Edge, previousEdge: Edge): boolean {
    // 比较边的关键属性
    const edgeHash = ContentHashGenerator.objectHash({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      data: edge.data,
    });
    const previousEdgeHash = ContentHashGenerator.objectHash({
      id: previousEdge.id,
      source: previousEdge.source,
      target: previousEdge.target,
      data: previousEdge.data,
    });
    return edgeHash !== previousEdgeHash;
  }

  /**
   * 检查流程是否未改变
   */
  private isFlowUnchanged(flow: FlowData, previousFlow: FlowData): boolean {
    const flowHash = this.calculateFlowHash(flow);
    const previousFlowHash = this.calculateFlowHash(previousFlow);
    return flowHash === previousFlowHash;
  }

  /**
   * 计算流程哈希
   */
  private calculateFlowHash(flow: FlowData): string {
    const nodesHash = ContentHashGenerator.objectHash(flow.nodes || []);
    const edgesHash = ContentHashGenerator.objectHash(flow.edges || []);
    const flowHash = ContentHashGenerator.objectHash(flow.flow || {});
    return `${flowHash}_${nodesHash}_${edgesHash}`;
  }

  /**
   * 尝试缓存验证结果
   */
  private tryCacheResult(flow: FlowData, result: ValidationResult): void {
    const flowHash = this.calculateFlowHash(flow);

    // 检查是否已缓存
    const cached = this.cache.get(flowHash);
    if (cached) {
      this.cacheHitCount++;
      return;
    }

    this.cacheMissCount++;

    // 清理过期缓存
    this.cleanExpiredCache();

    // 添加新缓存
    const nodeHashes = new Map<string, string>();
    const edgeHashes = new Map<string, string>();

    for (const node of flow.nodes || []) {
      nodeHashes.set(node.id, ContentHashGenerator.objectHash(node));
    }

    for (const edge of flow.edges || []) {
      edgeHashes.set(edge.id, ContentHashGenerator.objectHash(edge));
    }

    const cacheItem: ValidationCacheItem = {
      flowHash,
      result,
      timestamp: Date.now(),
      nodeHashes,
      edgeHashes,
    };

    this.cache.set(flowHash, cacheItem);

    // 如果超出最大缓存大小，移除最旧的
    if (this.cache.size > this.options.maxCacheSize) {
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
      }
    }
  }

  /**
   * 获取缓存的验证结果
   */
  private get_cached_result(flow: FlowData): ValidationResult {
    const flowHash = this.calculateFlowHash(flow);
    const cached = this.cache.get(flowHash);
    if (cached) {
      this.cacheHitCount++;
      return { ...cached.result, cacheKey: flowHash };
    }
    this.cacheMissCount++;
    return { isValid: true, errors: [], warnings: [] };
  }

  /**
   * 清理过期的缓存
   */
  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.options.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 清除所有缓存
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * 禁用缓存
   */
  public disableCache(): void {
    this.options.enableCache = false;
  }

  /**
   * 启用缓存
   */
  public enableCache(): void {
    this.options.enableCache = true;
  }

  /**
   * 禁用增量验证
   */
  public disableIncremental(): void {
    this.options.enableIncremental = false;
  }

  /**
   * 启用增量验证
   */
  public enableIncremental(): void {
    this.options.enableIncremental = true;
  }

  /**
   * 设置缓存 TTL
   */
  public setCacheTTL(ttl: number): void {
    this.options.cacheTTL = ttl;
    this.cleanExpiredCache();
  }

  /**
   * 设置最大缓存大小
   */
  public setMaxCacheSize(size: number): void {
    this.options.maxCacheSize = size;
    if (this.cache.size > size) {
      let toRemove = this.cache.size - size;
      const items = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp);
      for (const [key] of items) {
        if (toRemove <= 0) break;
        this.cache.delete(key);
        toRemove--;
      }
    }
  }

  /**
   * 验证流程定义并抛出错误（如果无效）
   * @param flow 流程定义
   * @throws FlowExecutionError 如果流程定义无效
   */
  public validateAndThrow(flow: FlowData): void {
    const result = this.validate(flow);

    if (!result.isValid) {
      const errorMessages = result.errors.map(e => e.message).join('; ');
      throw FlowExecutionError.flowDefinitionInvalid(errorMessages);
    }
  }
}

// 导出单例实例
export const flowValidator = new FlowValidator();

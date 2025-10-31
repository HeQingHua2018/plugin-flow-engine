/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @File: FlowValidator.ts
 * @desc: 流程验证器，用于验证流程定义的有效性
 * @author: heqinghua
 * @date: 2025年01月27日
 */

import { type FlowData, type Node } from "@plugin-flow-engine/type/core";
import { FlowExecutionError } from './FlowError';

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
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
 * 流程验证器类
 * 提供流程定义的有效性验证功能
 */
export class FlowValidator {
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

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 验证基础结构
   */
  private validateBasicStructure(
    flow: FlowData,
    errors: ValidationError[],
    _warnings: ValidationWarning[]
  ): void {
    // 检查必要字段
    if (!flow.flow?.id) {
      errors.push({
        code: 'MISSING_FLOW_ID',
        message: '流程ID不能为空',
        severity: 'error'
      });
    }

    if (!flow.flow?.name) {
      errors.push({
        code: 'MISSING_FLOW_NAME',
        message: '流程名称不能为空',
        severity: 'error'
      });
    }

    if (!Array.isArray(flow.nodes) || flow.nodes.length === 0) {
      errors.push({
        code: 'MISSING_NODES',
        message: '流程必须包含至少一个节点',
        severity: 'error'
      });
    }

    if (!Array.isArray(flow.edges)) {
      errors.push({
        code: 'MISSING_EDGES',
        message: '流程边定义不能为空',
        severity: 'error'
      });
    }
  }

  /**
   * 验证节点
   */
  private validateNodes(
    flow: FlowData,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const nodeIds = new Set<string>();
    const triggerNodes: Node[] = [];
    const endNodes: Node[] = [];

    for (const node of flow.nodes) {
      // 检查节点ID唯一性
      if (nodeIds.has(node.id)) {
        errors.push({
          code: 'DUPLICATE_NODE_ID',
          message: `节点ID重复: ${node.id}`,
          nodeId: node.id,
          severity: 'error'
        });
      } else {
        nodeIds.add(node.id);
      }

      // 检查必要字段
      if (!node.data?.name) {
        errors.push({
          code: 'MISSING_NODE_NAME',
          message: `节点 ${node.id} 缺少名称`,
          nodeId: node.id,
          severity: 'error'
        });
      }

      // 收集特殊节点类型
      if (node.data?.pluginNodeType === "Trigger") {
        triggerNodes.push(node);
      } else if (node.data?.pluginNodeType === "End") {
        endNodes.push(node);
      }

      // 验证节点配置
      this.validateNodeConfig(node, errors, warnings);
    }

    // 检查触发器节点
    if (triggerNodes.length === 0) {
      errors.push({
        code: 'MISSING_TRIGGER_NODE',
        message: '流程必须包含至少一个触发器节点',
        severity: 'error'
      });
    } else if (triggerNodes.length > 1) {
      warnings.push({
        code: 'MULTIPLE_TRIGGER_NODES',
        message: `发现多个触发器节点: ${triggerNodes.map(n => n.id).join(', ')}`,
      });
    }

    // 检查结束节点
    if (endNodes.length === 0) {
      warnings.push({
        code: 'MISSING_END_NODE',
        message: '建议流程包含至少一个结束节点',
      });
    }
  }

  /**
   * 验证节点配置
   */
  private validateNodeConfig(
    node: Node,
    errors: ValidationError[],
    _warnings: ValidationWarning[]
  ): void {
    // 验证迭代节点配置
    if (node.data?.pluginNodeType === "Iteration") {
      const iterationCount = node.data?.config?.iteration_count;
      if (iterationCount !== undefined && (iterationCount < 1 || iterationCount > 100)) {
        errors.push({
          code: 'INVALID_ITERATION_COUNT',
          message: `节点 ${node.id} 的迭代次数必须在1-100之间`,
          nodeId: node.id,
          severity: 'error'
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
          severity: 'error'
        });
      }
    }
  }

  /**
   * 验证边
   */
  private validateEdges(
    flow: FlowData,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const nodeIds = new Set(flow.nodes.map(n => n.id));
    const edgeIds = new Set<string>();

    for (const edge of flow.edges) {
      // 检查边ID唯一性
      if (edgeIds.has(edge.id)) {
        errors.push({
          code: 'DUPLICATE_EDGE_ID',
          message: `边ID重复: ${edge.id}`,
          edgeId: edge.id,
          severity: 'error'
        });
      } else {
        edgeIds.add(edge.id);
      }

      // 检查源节点是否存在
      if (!nodeIds.has(edge.source)) {
        errors.push({
          code: 'INVALID_SOURCE_NODE',
          message: `边 ${edge.id} 的源节点不存在: ${edge.source}`,
          edgeId: edge.id,
          severity: 'error'
        });
      }

      // 检查目标节点是否存在
      if (!nodeIds.has(edge.target)) {
        errors.push({
          code: 'INVALID_TARGET_NODE',
          message: `边 ${edge.id} 的目标节点不存在: ${edge.target}`,
          edgeId: edge.id,
          severity: 'error'
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
   */
  private validateFlowLogic(
    flow: FlowData,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // 检查循环依赖
    this.checkCircularDependency(flow, errors);

    // 检查孤立节点
    this.checkOrphanedNodes(flow, warnings);

    // 检查不可达节点
    this.checkUnreachableNodes(flow, warnings);
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
        return true; // 发现循环
      }
      if (visited.has(nodeId)) {
        return false;
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = flow.edges.filter(e => e.source === nodeId);
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
            severity: 'error'
          });
          break;
        }
      }
    }
  }

  /**
   * 检查孤立节点
   */
  private checkOrphanedNodes(
    flow: FlowData,
    warnings: ValidationWarning[]
  ): void {
    const connectedNodes = new Set<string>();
    
    for (const edge of flow.edges) {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    }

    for (const node of flow.nodes) {
      if (!connectedNodes.has(node.id)) {
        warnings.push({
          code: 'ORPHANED_NODE',
          message: `节点 ${node.id} 没有连接任何边`,
          nodeId: node.id,
        });
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
    const triggerNodes = flow.nodes.filter(n => n.type === "Trigger");
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

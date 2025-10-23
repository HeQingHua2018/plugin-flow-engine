/*
 * @File: 
 * @desc: 
 * @author: heqinghua
 * @date: 2025年10月23日 14:31:15
 * @example: 调用示例
 */

import type { Node as FlowNode, Edge as FlowEdge } from '@xyflow/react';

/**
 * 流程数据结构
 */
interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

/**
 * 流程节点结构
 */
interface Node extends FlowNode {
 [key:string]: any
}

/**
 * 流程边结构
 */
interface Edge extends FlowEdge {
  [key:string]: any
}

export type {
    FlowData,
    Node,
    Edge,
}